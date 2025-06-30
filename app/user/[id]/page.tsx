import { PrismaClient } from '@/app/generated/prisma';
import UserProfileCard from '@/app/components/UserProfileCard';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow z-10">
        <UserProfileCard user={user} />
      </div>

      <div className="flex flex-1 bg-gray-50 divide-x divide-gray-200 text-black">
        <div className="w-1/3 p-6">Tabela z ogłoszeniami z opcją CRUD</div>
        <div className="w-1/3 p-6">Tabela z wydarzeniami z opcją CRUD</div>
        <div className="w-1/3 p-6">Tabela z 3 na którą nie ma pomysłu/ Może wydarznia w których bierze się udział</div>
      </div>
    </div>
  );
}