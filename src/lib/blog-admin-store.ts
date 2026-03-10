import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from '@/data/articles';

export type BlogSeoSettings = {
  homepageTitle: string;
  homepageDescription: string;
};

const ADMIN_ARTICLES_PATH = path.join(process.cwd(), 'src/data/admin-blog-articles.json');
const SEO_SETTINGS_PATH = path.join(process.cwd(), 'src/data/seo-settings.json');

const DEFAULT_SEO_SETTINGS: BlogSeoSettings = {
  homepageTitle: 'Wedding Blog | Wervice',
  homepageDescription: 'Wedding planning guides, inspiration, and vendor tips for Moroccan weddings.',
};

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

export async function getAdminBlogArticles(): Promise<Article[]> {
  const rows = await readJsonFile<Article[]>(ADMIN_ARTICLES_PATH, []);
  if (!Array.isArray(rows)) return [];
  return rows;
}

export async function saveAdminBlogArticles(articles: Article[]): Promise<void> {
  await writeJsonFile(ADMIN_ARTICLES_PATH, articles);
}

export async function getBlogSeoSettings(): Promise<BlogSeoSettings> {
  const raw = await readJsonFile<Partial<BlogSeoSettings>>(SEO_SETTINGS_PATH, DEFAULT_SEO_SETTINGS);
  return {
    homepageTitle: raw.homepageTitle || DEFAULT_SEO_SETTINGS.homepageTitle,
    homepageDescription: raw.homepageDescription || DEFAULT_SEO_SETTINGS.homepageDescription,
  };
}

export async function saveBlogSeoSettings(settings: BlogSeoSettings): Promise<void> {
  await writeJsonFile(SEO_SETTINGS_PATH, settings);
}
