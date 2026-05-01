import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import TutorDetailClient from './_components/TutorDetailClient';
import { getTutorFullProfileServer, TutorNotFoundError } from '@/services/tutorDetail.server';
import { env } from '@/lib/env';
import { formatCity } from './_components/utils';

/**
 * /tutor-detail/[id] — Server Component (Phase 4 SEO chủ lực).
 *
 * Strategy:
 *  1. Server fetch tutor profile (revalidate 300s).
 *  2. 404 → notFound() → render `app/not-found.tsx`.
 *  3. generateMetadata: dynamic title, description, OG image (avatar), canonical.
 *  4. JSON-LD `Person` schema → Google Rich Results (star rating + review count
 *     trong search snippet).
 *  5. Render Header + TutorDetailClient + Footer.
 *
 * Caching: page-level revalidate KHÔNG cần (searchParams = path params, Next handle
 * naturally). `searchTutorsServer` đã có `revalidate: 300` ở fetch level.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await getTutorFullProfileServer(id);
    const profile = response.content;

    const subjects =
      profile.subjects
        ?.map((s) => s.subjectName)
        .filter(Boolean)
        .join(', ') || 'mọi môn';
    const city = formatCity(profile.teachingAreaCity);
    const fullName = profile.fullName || 'Gia sư';
    const headline = profile.headline || 'Gia sư đã được xác minh hồ sơ';

    // `title` field cho metadata: KHÔNG add suffix "| TUTORA" — layout.tsx đã set
    // `title.template: '%s | TUTORA'` sẽ tự wrap. Add ở đây sẽ thành "X | TUTORA | TUTORA".
    // OG/Twitter title CẦN suffix manual vì template không apply cho 2 field này.
    //
    // Truncate headline để title (sau khi layout wrap "| TUTORA") ≤ ~60 chars — quá dài
    // Google sẽ cắt giữa từ trong SERP. fullName ưu tiên giữ trọn.
    const TITLE_BUDGET = 50; // ~60 - " | TUTORA".length (9)
    const reserved = fullName.length + 3; // "Name — "
    const headlineMax = Math.max(20, TITLE_BUDGET - reserved);
    const headlineTrimmed =
      headline.length > headlineMax ? headline.slice(0, headlineMax - 1).trimEnd() + '…' : headline;
    const title = `${fullName} — ${headlineTrimmed}`;
    const fullTitle = `${title} | TUTORA`;
    const description = (() => {
      const bio = profile.bio?.trim();
      if (bio && bio.length > 50) {
        return bio.length > 160 ? bio.slice(0, 157) + '...' : bio;
      }
      return `Gia sư ${fullName} — ${subjects} tại ${city}. Đã được xác minh hồ sơ, đặt lịch học online, nhận báo cáo tiến độ tự động sau mỗi buổi.`;
    })();

    const canonical = `/tutor-detail/${id}`;
    const ogImage = profile.avatarUrl || `${env.SITE_URL}/tutora-logo.png`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: fullTitle,
        description,
        url: canonical,
        type: 'profile',
        images: [{ url: ogImage, width: 800, height: 800, alt: fullName }],
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    if (!(error instanceof TutorNotFoundError)) {
      throw error;
    }

    return {
      title: 'Gia sư không tồn tại',
      description: 'Không tìm thấy thông tin gia sư.',
      robots: { index: false, follow: false },
    };
  }
}

/**
 * Build JSON-LD Person schema for Google Rich Results.
 * Schema: https://schema.org/Person
 * Helps Google show: name, image, rating stars, review count in SERP.
 */
function buildPersonSchema(
  profile: Awaited<ReturnType<typeof getTutorFullProfileServer>>['content'],
  id: string
) {
  const subjects =
    profile.subjects
      ?.map((s) => s.subjectName)
      .filter((s): s is string => !!s) || [];

  // schema.org expects strings — VN local format OK.
  const baseSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    image: profile.avatarUrl || undefined,
    description: profile.bio || profile.headline || undefined,
    jobTitle: 'Gia sư',
    url: `${env.SITE_URL}/tutor-detail/${id}`,
    knowsAbout: subjects.length > 0 ? subjects : undefined,
  };

  if (profile.education) {
    baseSchema.alumniOf = {
      '@type': 'EducationalOrganization',
      name: profile.education,
    };
  }

  if (profile.teachingAreaCity) {
    baseSchema.address = {
      '@type': 'PostalAddress',
      addressLocality: formatCity(profile.teachingAreaCity),
      addressCountry: 'VN',
    };
  }

  if (profile.totalFeedbacks > 0 && profile.averageRating > 0) {
    baseSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: profile.averageRating.toFixed(1),
      reviewCount: profile.totalFeedbacks,
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (profile.hourlyRate) {
    baseSchema.offers = {
      '@type': 'Offer',
      price: Math.round(profile.hourlyRate * 1.05),
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Service',
        name: 'Dạy kèm 1-1',
      },
    };
  }

  // Strip undefined fields for clean JSON
  return JSON.parse(JSON.stringify(baseSchema));
}

export default async function TutorDetailPage({ params }: PageProps) {
  const { id } = await params;

  let profile;
  try {
    const response = await getTutorFullProfileServer(id);
    profile = response.content;
  } catch (error) {
    if (error instanceof TutorNotFoundError) {
      notFound();
    }
    throw error; // Other errors → Next error.tsx (or default error UI)
  }

  const personSchema = buildPersonSchema(profile, id);

  return (
    <div className="tutor-detail-page">
      <Header />

      {/*
        Spacer-only wrapper — Header là position:fixed/sticky nên hero sẽ bị
        che nếu không có element này push content xuống. Trước đây chứa
        breadcrumb (Trang chủ › Tìm kiếm Gia sư › Hồ sơ {Tên}); user yêu cầu
        bỏ nội dung breadcrumb nhưng phải GIỮ wrapper để bảo toàn padding-top.
      */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          paddingTop: 'var(--header-height, 80px)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            padding: '0 35px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <TutorDetailClient profile={profile} tutorId={id} />

      <Footer />

      {/* JSON-LD Person schema — Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </div>
  );
}
