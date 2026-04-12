import type { Metadata } from "next";
import { Newsreader, Manrope, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: "Komi Heritage | Rooted in Flavor. Wrapped in Heritage.",
  description: "Accra's premier kenkey destination. Fusing timeless recipes with modern street culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} ${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-manrope bg-surface text-on-surface">
        <Navigation />
        <main className="flex-1 flex flex-col mt-[72px] md:mt-[80px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
