import { auth } from '@/auth';
import { PrismaClient } from '@/app/generated/prisma';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import {getTranslations} from 'next-intl/server';

const prisma = new PrismaClient();


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const t = await getTranslations();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
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
  const session = await auth();
  const userId = params.id;

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
