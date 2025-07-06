import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { headers } from 'next/headers';
import { SessionProvider } from 'next-auth/react';
// import { Session } from 'next-auth';
import { ToastContainer } from 'react-toastify';

import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('root');

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('opengraphTitle'),
      description: t('opengraphDescription'),
      url: "https://trade-and-play.vercel.app", 
      siteName: "Trade and Play",
      images: [
        {
          url: "../public/earth.jpeg",
          width: 1200,
          height: 630,
          alt: t('opengraphTitle'),
        },
      ],
      type: "website",
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://trade-and-play.vercel.app'), 
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = (await headersList).get("x-invoke-path") || "";
  const locale = pathname.split("/")[1] || "en"; 
  const session = await auth();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          <div className="h-screen w-screen flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {children}
              <ToastContainer />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
