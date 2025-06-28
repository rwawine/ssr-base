import Head from "next/head";
import { useSeo } from "./SeoProvider";
import { siteConfig } from "@/lib/metadata";

interface SeoHeadProps {
  fallbackSeo?: {
    title?: string;
    description?: string;
    canonical?: string;
  };
}

export function SeoHead({ fallbackSeo }: SeoHeadProps) {
  const { getCurrentSeo } = useSeo();
  const seo = getCurrentSeo();

  // Используем fallback или дефолтные значения
  const title = seo?.title || fallbackSeo?.title || siteConfig.name;
  const description =
    seo?.description || fallbackSeo?.description || siteConfig.description;
  const canonical = seo?.canonical || fallbackSeo?.canonical || siteConfig.url;
  const keywords = seo?.keywords || siteConfig.keywords;
  const ogImage = seo?.ogImage || siteConfig.ogImage;
  const ogType = seo?.ogType || "website";

  // Формируем полный canonical URL
  const fullCanonical = canonical.startsWith("http")
    ? canonical
    : `${siteConfig.url}${canonical}`;

  return (
    <Head>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={`${siteConfig.url}${ogImage}`} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteConfig.url}${ogImage}`} />

      {/* Robots */}
      <meta name="robots" content={seo?.noindex ? "noindex" : "index,follow"} />
      {seo?.nofollow && <meta name="robots" content="nofollow" />}

      {/* Структурированные данные */}
      {seo?.structuredData?.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}
    </Head>
  );
}
