import React from "react";

export default function Head() {
  return (
    <>
      {/* Верификация Яндекса */}
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