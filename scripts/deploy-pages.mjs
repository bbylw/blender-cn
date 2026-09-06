/**
 * 部署到 GitHub Pages（gh-pages 分支）。
 *
 * 用法：
 *   bun run deploy            # 推到默认仓库 bbylw/blender-cn
 *   REPO=other/repo bun run deploy
 *
 * 前置：已在 GitHub 上启用 Pages 并选择分支 gh-pages（或用下方 API 命令启用）。
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repo = process.env.REPO || 'bbylw/blender-cn';
const remote = `https://github.com/${repo}.git`;

const run = (cmd, opts = {}) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
};

const AUTH = '-c user.name=bbylw -c user.email=bbylw521@gmail.com';

console.log('== 1/3 构建站点 ==');
run('bun run build');

const dir = mkdtempSync(join(tmpdir(), 'blender-cn-deploy-'));
try {
  console.log('== 2/3 准备 gh-pages 分支内容 ==');
  // 把 dist 的内容（而非 dist 目录本身）复制进临时目录
  for (const entry of readdirSync('dist')) {
    cpSync(join('dist', entry), join(dir, entry), { recursive: true });
  }
  run(`${AUTH} git init -b gh-pages`, { cwd: dir });
  run(`${AUTH} git add -A`, { cwd: dir });
  const stamp = new Date().toISOString().slice(0, 10);
  run(`${AUTH} git commit -m "deploy: static site ${stamp}" --quiet`, { cwd: dir });

  console.log(`== 3/3 推送到 ${remote} (gh-pages) ==`);
  run(`git remote add origin ${remote}`, { cwd: dir });
  run('git push -f origin HEAD:gh-pages', { cwd: dir });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log('完成：gh-pages 已更新。');
