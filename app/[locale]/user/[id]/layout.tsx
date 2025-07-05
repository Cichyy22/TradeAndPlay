import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import {getTranslations} from 'next-intl/server';
import { prisma } from '@/prisma';



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations();
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  const name = user?.name ?? "";
  if (!user) return {};

   return {
    title: t('user.profileTitle', {name}),
    description: t('user.profileDescription', {name}),
    openGraph: {
      title: t('user.profileTitle', {name}),
      description: t('user.profileDescription', {name}),
      type: 'profile',
      images: user.image
        ? [{ url: user.image, alt: t('user.profileImageAlt', {name}) }]
        : [],
    },
  };
}


export default async function UserProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const { id } = await params;
  const session = await auth();
  const userId = id;

  if (!session || session.userId !== userId) {
    return notFound(); 
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return notFound(); 
  }

  return <>{children}</>;
}
