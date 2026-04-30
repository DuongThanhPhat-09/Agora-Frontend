import type { MetadataRoute } from 'next';
import { searchTutorsServer } from '@/services/tutorSearch.server';
import { env } from '@/lib/env';

/**
 * Generated /sitemap.xml.
 *
 * Strategy: enumerate tutor IDs qua search endpoint paginate (Vite không expose
 * dedicated "list all tutor IDs" endpoint). Page size 100 — đủ rộng để giảm số
 * round-trip; backend giới hạn tự động nếu pageSize lớn quá.
 *
 * Cache: Next tự cache sitemap (staleness do `searchTutorsServer.revalidate: 120s`).
 *
 * SEO:
 *  - `/`, `/tutor-search` → priority cao (entry points)
 *  - `/tutor-detail/{id}` → priority thấp hơn nhưng nhiều URLs (long-tail)
 *  - `lastModified` để hint Google biết khi nào re-crawl
 *
 * Trang portal/auth: KHÔNG đưa vào sitemap (đã `Disallow` trong robots.ts).
 */

const SITE = env.SITE_URL;
const MAX_PAGES = 50; // safety cap: 50 × 100 = 5000 tutors max

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static entries
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE}/tutor-search`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Tutor detail entries — paginate search until exhausted or hit cap
  const tutorEntries: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    while (page <= MAX_PAGES) {
      const res = await searchTutorsServer({ pageNumber: page, pageSize: 100 });
      const items = res.content.items || [];
      for (const tutor of items) {
        if (!tutor.tutorId) continue;
        tutorEntries.push({
          url: `${SITE}/tutor-detail/${tutor.tutorId}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
      if (!res.content.hasNext) break;
      page++;
    }
  } catch (error) {
    console.error('[sitemap] Failed to enumerate tutors:', error);
    // Soft fail — return static entries only nếu backend down
  }

  return [...staticEntries, ...tutorEntries];
}
