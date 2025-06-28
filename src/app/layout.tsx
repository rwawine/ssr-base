import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { CartProvider } from "@/hooks/CartContext";
import { FavoritesProvider } from "@/hooks/FavoritesContext";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          async
          src="https://script.click-chat.ru/chat.js?wid=2806a4e5-3f63-4afe-b6a3-d09e0d4f08b4"
        />

        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(102656171, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true,
                   ecommerce:"dataLayer"
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/102656171"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

        {/* Yandex.Metrika counter #2 */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103105597, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103105597"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter #2 */}


      </head>
      <body>
        <CartProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Footer />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
