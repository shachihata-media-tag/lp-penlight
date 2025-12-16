import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google"; // Corrected import
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_METADATA } from "@/lib/constants";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next";



// Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  openGraph: {
    type: "website",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={cn(inter.variable, notoSansJP.variable, "font-sans min-h-screen flex flex-col")}>
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
