import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import {NextIntlClientProvider} from 'next-intl';
import Navbar from "@/app/components/Navbar";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string; locale: string }>
}){
  const { id } = await params;
  const t = await getTranslations();
  const user = await prisma.user.findUnique({
    where: { id },
  });
  const name = user?.name ?? '';
  if (!user) return {};

  return {
    title: t('user.profileTitle', { name }),
    description: t('user.profileDescription', { name }),
    openGraph: {
      title: t('user.profileTitle', { name }),
      description: t('user.profileDescription', { name }),
      type: 'profile',
      images: user.image
        ? [{ url: user.image, alt: t('user.profileImageAlt', { name }) }]
        : [],
    },
  };
}

export default async function UserProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user?.id !== id) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return notFound();
  }

  return <><NextIntlClientProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden">
        <div className="h-12 shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div></NextIntlClientProvider></>;
}