import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { bodyToText, extractHeadings } from '../lib/docs';

/** 构建期生成全站文档的搜索索引（静态 JSON）。 */
export const GET: APIRoute = async () => {
  const entries = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);

  const items = entries.map((entry) => {
    const body = entry.body ?? '';
    return {
      slug: entry.id,
      href: `/docs/${entry.id}`,
      group: entry.data.group,
      icon: entry.data.icon,
      order: entry.data.order,
      title: entry.data.title,
      tagline: entry.data.tagline,
      description: entry.data.description,
      updated: entry.data.updated,
      headings: extractHeadings(body).map((h) => h.text),
      text: bodyToText(body),
    };
  });

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
