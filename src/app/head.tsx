import React from "react";

export default function Head() {
  return (
    <>
      <title>Dilavia — Мебель для вашего дома | Интернет-магазин dilavia.by</title>
      <meta name="description" content="Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров. Доставка, гарантия, лучшие цены!" />
      <meta name="keywords" content="мебель, диваны, кровати, кресла, купить, Минск, Беларусь, интернет-магазин, dilavia.by" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:title" content="Dilavia — Мебель для вашего дома" />
      <meta property="og:description" content="Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров." />
      <meta property="og:url" content="https://dilavia.by/" />
      <meta property="og:site_name" content="Dilavia" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Dilavia — Мебель для вашего дома" />
      <meta name="twitter:description" content="Купить мебель в Минске и по всей Беларуси. Большой выбор диванов, кроватей, кресел и аксессуаров." />
      <meta name="twitter:site" content="@dilavia_by" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://dilavia.by/" />
      <meta name="yandex-verification" content="example-verification-code" />
      {/* Organization schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Dilavia",
            "url": "https://dilavia.by/",
            "logo": "https://dilavia.by/favicon.ico",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+375291234567",
                "contactType": "customer service",
                "email": "info@dilavia.by"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Минск",
              "addressCountry": "BY"
            }
          })
        }}
      />
    </>
  );
} 