import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import {
  CustomCursor,
  PageTransition,
  SmoothScrollProvider,
} from "@/components/motion";
import { Footer, Header, WhatsAppFab } from "@/components/layout";
import { LanguageProvider } from "@/components/i18n";
import { JsonLd } from "@/components/seo/JsonLd";
import { Metrika } from "@/components/analytics";
import { localBusinessSchema, organizationSchema } from "@/lib/schema";
import { defaultLocale, pageSeo, site, titleTemplate } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: pageSeo.home.title, template: titleTemplate },
  description: pageSeo.home.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "разработка сайтов Астана",
    "разработка сайтов Алматы",
    "заказать сайт Казахстан",
    "IT агентство Астана",
    "Telegram-бот на заказ",
    "интеграция с 1С",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: pageSeo.home.title,
    description: pageSeo.home.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#141824" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} className={fontVariables} suppressHydrationWarning>
      <body className="antialiased">
        {/* Первое, что получает фокус на любой странице. */}
        <a
          href="#main"
          className="sr-only-focusable bg-ink text-paper fixed top-4 left-4 z-[200] rounded-full px-5 py-2.5 text-small font-semibold"
        >
          Перейти к содержимому
        </a>

        {/* Провайдер языка обязан оборачивать всё, что читает словарь:
            шапку, футер, кнопку WhatsApp и содержимое страниц. */}
        <LanguageProvider>
          <Header />

          <SmoothScrollProvider>
            <PageTransition>{children}</PageTransition>
          </SmoothScrollProvider>

          <Footer />
          <WhatsAppFab />
        </LanguageProvider>

        <CustomCursor />

        <Metrika />

        <JsonLd data={organizationSchema()} />
        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  );
}
