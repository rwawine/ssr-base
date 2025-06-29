import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "404 — Страница не найдена | Dilavia",
  description:
    "К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.",
  openGraph: {
    title: "404 — Страница не найдена | Dilavia",
    description:
      "К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.",
    url: "https://dilavia.by/404",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "404 — Страница не найдена | Dilavia",
    description:
      "К сожалению, запрашиваемая страница не существует или была перемещена. Перейдите на главную или воспользуйтесь навигацией сайта.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Генерируем структурированные данные для страницы 404
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 - Страница не найдена",
    description:
      "К сожалению, запрашиваемая страница не существует или была перемещена.",
    url: "https://dilavia.by/404",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://dilavia.by",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "404",
          item: "https://dilavia.by/404",
        },
      ],
    },
    mainEntity: {
      "@type": "Article",
      name: "Страница не найдена",
      description: "Информация о том, что запрашиваемая страница не существует",
      author: {
        "@type": "Organization",
        name: "ООО МЯГКИЙ КОМФОРТ",
        url: "https://dilavia.by",
        image: "https://dilavia.by/images/logo.svg",
      },
      publisher: {
        "@type": "Organization",
        name: "Dilavia",
        url: "https://dilavia.by",
        image: "https://dilavia.by/images/logo.svg",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
