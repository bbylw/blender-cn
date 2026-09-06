import { getCollection, type CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;
export type GroupKey = DocEntry['data']['group'];

/** 组件可直接使用的纯数据对象（避免把集合条目对象往下传） */
export interface DocItem {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  group: GroupKey;
  order: number;
  updated: string;
  source?: { url: string; label: string };
}

export const GROUP_LABELS: Record<GroupKey, string> = {
  manual: '使用手册',
  dev: '开发者文档',
};

export const GROUP_TAGLINES: Record<GroupKey, string> = {
  manual: '对应官方中文手册章节的使用导读',
  dev: '基于官方开发者文档整理的开发指南',
};

const byOrder = (a: DocEntry, b: DocEntry) => a.data.order - b.data.order;

function toItem(entry: DocEntry): DocItem {
  return {
    slug: entry.id,
    href: `/docs/${entry.id}`,
    title: entry.data.title,
    tagline: entry.data.tagline,
    description: entry.data.description,
    icon: entry.data.icon,
    group: entry.data.group,
    order: entry.data.order,
    updated: entry.data.updated,
    source: entry.data.source,
  };
}

/** 全部文档，按全局线性顺序 */
export async function getAllDocs(): Promise<DocItem[]> {
  const entries = await getCollection('docs');
  return entries.sort(byOrder).map(toItem);
}

export async function getGroupDocs(group: GroupKey): Promise<DocItem[]> {
  const entries = await getCollection('docs', ({ data }) => data.group === group);
  return entries.sort(byOrder).map(toItem);
}

/** 前后篇（跨组线性） */
export function neighbors(docs: DocItem[], slug: string): { prev?: DocItem; next?: DocItem } {
  const i = docs.findIndex((d) => d.slug === slug);
  if (i === -1) return {};
  return { prev: docs[i - 1], next: docs[i + 1] };
}

/** 从 Markdown 原文提取 h2/h3 目录（正文标题由 Astro 自动生成同名 id） */
export function extractHeadings(body: string): { level: 2 | 3; text: string }[] {
  const headings: { level: 2 | 3; text: string }[] = [];
  let inFence = false;
  for (const raw of body.split('\n')) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接只保留文字
      .replace(/[*_`>]/g, '')
      .trim();
    if (text) headings.push({ level: m[1].length === 2 ? 2 : 3, text });
  }
  return headings;
}

/** 供站内搜索使用的纯文本（去掉代码块与标记语法） */
export function bodyToText(body: string, max = 8000): string {
  const lines: string[] = [];
  let inFence = false;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!line) continue;
    let text = line
      .replace(/^#{1,4}\s+/, '') // 标题
      .replace(/^\s*[-*+]\s+/, '') // 无序列表
      .replace(/^\s*\d+[.)]\s+/, '') // 有序列表
      .replace(/^\s*\|.*\|\s*$/, ' ') // 表格整行降级为空格
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接文字
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
      .replace(/[`>*~]/g, '')
      .replace(/\|/g, ' ')
      .trim();
    if (text) lines.push(text);
  }
  const out = lines.join(' ').replace(/\s+/g, ' ').trim();
  return out.slice(0, max);
}
