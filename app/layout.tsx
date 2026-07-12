import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/content";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://sufy.infindigital.net";
const DESCRIPTION =
  "Saleeth Sufiyan (Sufy) — SEO & Performance Marketing specialist. Winning the Game of Growth: SEO, paid media, analytics and CRO that turn budgets into conquests.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SUFY — Saleeth Sufiyan · SEO & Performance Marketing",
    template: "%s · SUFY",
  },
  description: DESCRIPTION,
  keywords: [
    "SEO specialist",
    "performance marketing",
    "paid ads",
    "Google Ads",
    "Meta Ads",
    "conversion rate optimization",
    "growth marketing",
    "Saleeth Sufiyan",
    "Sufy",
  ],
  authors: [{ name: BRAND.fullName }],
  creator: BRAND.fullName,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "SUFY — SEO & Performance Marketing",
    description: DESCRIPTION,
    siteName: "SUFY",
  },
  twitter: {
    card: "summary_large_image",
    title: "SUFY — SEO & Performance Marketing",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Saleeth Sufiyan",
      alternateName: "Sufy",
      jobTitle: "SEO & Performance Marketing Specialist",
      email: "mailto:work@infindigital.net",
      url: SITE_URL,
      knowsAbout: [
        "Search Engine Optimization",
        "Performance Marketing",
        "Paid Advertising",
        "Google Ads",
        "Meta Ads",
        "Conversion Rate Optimization",
        "Web Analytics",
      ],
    },
    {
      "@type": "ProfessionalService",
      name: "SUFY — SEO & Performance Marketing",
      description: DESCRIPTION,
      url: SITE_URL,
      email: "mailto:work@infindigital.net",
      areaServed: "Worldwide",
      serviceType: [
        "SEO",
        "Performance Marketing",
        "Analytics",
        "Conversion Rate Optimization",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#07070a" />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg`}
          type="image/svg+xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <div className="grain-overlay" aria-hidden />
        <div className="vignette-overlay" aria-hidden />
      </body>
    </html>
  );
}
