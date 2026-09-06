import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/** 与 src/components/Icon.astro 中的图标名保持一致 */
export const ICON_NAMES = [
  'info',
  'compass',
  'layout',
  'box',
  'sparkles',
  'activity',
  'sun',
  'film',
  'folder',
  'blocks',
  'terminal',
  'users',
  'shield',
  'search',
  'arrowUp',
  'book',
] as const;

export const GROUP_KEYS = ['manual', 'dev'] as const;

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    /** 侧栏与页面大标题 */
    title: z.string().min(1),
    /** 卡片/列表里的短描述 */
    tagline: z.string().min(1),
    /** 页面大段描述 */
    description: z.string().min(1),
    icon: z.enum(ICON_NAMES),
    group: z.enum(GROUP_KEYS),
    /** 全局线性阅读顺序 */
    order: z.number().int().positive(),
    /** 内容版本/更新时间说明 */
    updated: z.string(),
    /** 官方对应章节入口 */
    source: z
      .object({
        url: z.url(),
        label: z.string(),
      })
      .optional(),
  }),
});

export const collections = { docs };
