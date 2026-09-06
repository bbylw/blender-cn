/**
 * 冒烟测试（本地静态站 QA）：
 *  1. 启动 `bun run preview`
 *  2. 用系统 Chrome 逐页检查：标题/h1、控制台与页面错误、移动端横向溢出
 *  3. 验证内部链接全部可访问、搜索可用、文档页 TOC 正常生成
 *
 * 用法：bun run smoke  （需要先 bun run build）
 */
import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const PORT = 4397;
const BASE = `http://127.0.0.1:${PORT}`;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'.replace('Google/Chrome', 'Microsoft/Edge'),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const SLUGS = [
  'about', 'getting-started', 'editors', 'modeling', 'sculpt-paint', 'animation',
  'rendering', 'tracking-video', 'assets-files', 'extensions', 'glossary',
  'build', 'contribute', 'license',
];
const HTML_ROUTES = ['/', '/docs/', '/search/', '/404.html', ...SLUGS.map((s) => `/docs/${s}/`)];
const ASSET_ROUTES = ['/search.json', '/favicon.svg', '/robots.txt'];

const failures = [];
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { failures.push(msg); console.log(`  ✗ ${msg}`); };

function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    if (existsSync(c)) return c;
    const found = spawnSync('which', [c], { encoding: 'utf8' }).stdout?.trim();
    if (found) return found;
  }
  return null;
}

const chromePath = findChrome();
if (!chromePath) {
  console.log('未找到 Chrome/Edge，跳过浏览器冒烟测试（可设置 CHROME_PATH 环境变量）。');
  process.exit(0);
}
console.log(`使用浏览器：${chromePath}`);

// ---------- 启动 preview ----------
const preview = spawn('bun', ['run', 'preview', '--', '--port', String(PORT), '--host', '127.0.0.1'], {
  shell: process.platform === 'win32',
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});
let previewOut = '';
preview.stdout.on('data', (d) => (previewOut += d));
preview.stderr.on('data', (d) => (previewOut += d));

async function waitServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview 未在 ${BASE} 就绪。输出：\n${previewOut}`);
}

function killPreview() {
  try {
    if (process.platform === 'win32' && preview.pid) {
      spawnSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
    } else if (preview.pid) {
      process.kill(-preview.pid, 'SIGTERM');
    }
  } catch {}
}

let browser;
try {
  await waitServer();
  browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });

  // ---------- 1. 全路由检查（桌面 + 移动端溢出） ----------
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await desktop.newPage();
  const pageM = await mobile.newPage();

  for (const route of HTML_ROUTES) {
    const url = BASE + route;
    const errors = [];
    const onConsole = (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`);
    const onPageError = (e) => errors.push(`pageerror: ${e.message}`);
    page.on('console', onConsole);
    page.on('pageerror', onPageError);
    await page.goto(url, { waitUntil: 'load' });
    await pageM.goto(url, { waitUntil: 'load' });

    const checks = await page.evaluate(() => ({
      title: document.title,
      h1: !!document.querySelector('h1'),
      lang: document.documentElement.lang,
    }));
    const overflowInfo = await pageM.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const delta = document.documentElement.scrollWidth - docW;
      if (delta <= 1) return { delta, offenders: [] };
      const describe = (el) => {
        const cls = el.className && typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 2).join('.')}` : '';
        return `${el.tagName.toLowerCase()}${cls}「${(el.textContent ?? '').trim().slice(0, 26)}」right=${Math.round(el.getBoundingClientRect().right)}`;
      };
      // 只报告“真正撑宽文档”的元素：不在任何可滚动祖先（overflow auto/scroll/hidden）内
      const blockers = [];
      for (const el of Array.from(document.querySelectorAll('body *'))) {
        const r = el.getBoundingClientRect();
        if (r.right <= docW + 2 || r.left >= docW) continue;
        let p = el.parentElement;
        let insideScroller = false;
        while (p && p !== document.body) {
          const o = getComputedStyle(p).overflowX;
          if (['auto', 'scroll', 'hidden', 'clip'].includes(o)) { insideScroller = true; break; }
          p = p.parentElement;
        }
        if (!insideScroller) blockers.push(describe(el));
      }
      const offenders = blockers.length ? blockers : Array.from(document.querySelectorAll('body *'))
        .filter((el) => el.getBoundingClientRect().right > docW + 2 && el.getBoundingClientRect().left < docW)
        .slice(0, 8)
        .map(describe);
      return { delta, offenders: offenders.slice(0, 8) };
    });
    const overflow = overflowInfo.delta;

    if (!checks.title) errors.push('空 title');
    if (route !== '/404.html' && !checks.h1) errors.push('缺少 h1');
    if (overflow > 1) errors.push(`移动端横向溢出 ${overflow}px\n        ${overflowInfo.offenders.join('\n        ')}`);

    page.off('console', onConsole);
    page.off('pageerror', onPageError);

    if (errors.length) {
      fail(`${route} → ${errors.join('；')}`);
    } else {
      pass(`${route}（lang=${checks.lang}, h1=${checks.h1}, overflow=${overflow}px）`);
    }
  }

  // ---------- 2. 文档页 TOC / 进度 / 返回顶部 ----------
  const doc = await desktop.newPage();
  await doc.goto(`${BASE}/docs/build/`, { waitUntil: 'load' });
  const toc = await doc.evaluate(() => ({
    links: document.querySelectorAll('#side-toc a').length,
    progress: !!document.getElementById('reading-progress'),
    backtop: !!document.getElementById('back-to-top'),
    h2: document.querySelectorAll('#doc-body h2').length,
    h3: document.querySelectorAll('#doc-body h3').length,
    tocTexts: Array.from(document.querySelectorAll('#side-toc a')).map((a) => a.textContent),
    headingTexts: Array.from(document.querySelectorAll('#doc-body h2, #doc-body h3')).map((h) => h.textContent),
    firstHref: document.querySelector('#side-toc a')?.getAttribute('href') ?? '',
  }));
  const totalHeadings = toc.h2 + toc.h3;
  if (toc.links !== totalHeadings || JSON.stringify(toc.tocTexts) !== JSON.stringify(toc.headingTexts)) {
    console.log('  · TOC 诊断 →', JSON.stringify({ toc: toc.tocTexts, body: toc.headingTexts }));
  }
  if (totalHeadings > 0 && toc.links === totalHeadings) pass(`TOC 条目数与正文标题一致（h2=${toc.h2}, h3=${toc.h3}）`);
  else fail(`TOC 不一致：标题 ${totalHeadings} / 目录 ${toc.links}`);
  if (!toc.progress || !toc.backtop) fail('阅读进度条或返回顶部缺失');
  if (!toc.firstHref.startsWith('#')) fail('TOC 锚点不是页内跳转');

  // 锚点跳转目标存在
  const target = await doc.evaluate((href) => !!document.getElementById(decodeURIComponent(href.slice(1))), toc.firstHref);
  if (target) pass('TOC 首个锚点可定位到正文标题');
  else fail(`TOC 锚点找不到目标：${toc.firstHref}`);

  // 点击“下一篇”可导航
  await doc.click('a[href="/docs/contribute"] >> nth=0');
  await doc.waitForLoadState('load');
  if (doc.url().includes('/docs/contribute')) pass('上一篇/下一篇链接可跳转');
  else fail('上下篇跳转异常');
  await doc.close();

  // ---------- 3. 搜索 ----------
  const search = await desktop.newPage();
  await search.goto(`${BASE}/search/`, { waitUntil: 'load' });
  const searchData = await search.evaluate(async () => {
    const r = await fetch('/search.json');
    if (!r.ok) return { ok: false, status: r.status };
    const arr = await r.json();
    return { ok: true, count: arr.length };
  });
  if (!searchData.ok) fail('search.json 不可用');
  else pass(`search.json 索引 ${searchData.count} 篇`);

  await search.fill('#search-input', 'GPLv3');
  await search.waitForTimeout(400);
  const results = await search.locator('#search-results a').count();
  if (results >= 1) {
    pass(`搜索“GPLv3”返回 ${results} 条结果`);
    const firstText = await search.locator('#search-results a').first().innerText();
    if (!firstText.includes('许可证')) fail('搜索命中第一条不是“许可证”相关');
  } else {
    fail('搜索“GPLv3”无结果');
  }
  await search.fill('#search-input', '');
  await search.waitForTimeout(300);
  const emptyNote = await search.locator('#search-status').innerText();
  if (emptyNote) pass('清空关键词后有提示');
  await search.close();

  // ---------- 4. 内部链接走查 ----------
  // ---------- 4. 静态资源断言 ----------
  const assetPage = await desktop.newPage();
  for (const asset of ASSET_ROUTES) {
    const r = await assetPage.request.get(BASE + asset);
    if (r.status() === 200) pass(`静态资源 ${asset} → 200`);
    else fail(`静态资源 ${asset} → ${r.status()}`);
  }
  await assetPage.close();

  // ---------- 5. 内部链接走查 ----------
  const crawlPage = await desktop.newPage();
  const internal = new Set();
  for (const route of ['/', '/docs/', '/search/', ...SLUGS.map((s) => `/docs/${s}/`)]) {
    await crawlPage.goto(BASE + route, { waitUntil: 'load' });
    const hrefs = await crawlPage.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/') && !h.startsWith('//'))
    );
    hrefs.forEach((h) => internal.add(h.split('#')[0].replace(/\/$/, '') || '/'));
  }
  const bad = [];
  for (const href of internal) {
    const r = await crawlPage.request.get(BASE + href);
    if (r.status() >= 400 && href !== '/404.html') bad.push(`${href} → ${r.status()}`);
  }
  if (bad.length) bad.forEach((b) => fail(`内部链接失效：${b}`));
  else pass(`内部链接走查通过（${internal.size} 个去重链接）`);
  await crawlPage.close();

  await desktop.close();
  await mobile.close();

  console.log('');
  if (failures.length) {
    console.log(`冒烟测试结束：${failures.length} 个问题`);
    process.exitCode = 1;
  } else {
    console.log('冒烟测试全部通过 ✓');
  }
} catch (err) {
  console.error('冒烟测试执行失败：', err);
  process.exitCode = 1;
} finally {
  try { await browser?.close(); } catch {}
  killPreview();
}
