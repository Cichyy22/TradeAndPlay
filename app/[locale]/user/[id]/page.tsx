import { PrismaClient } from '@/app/generated/prisma';
import UserProfileCard from '@/app/components/UserProfileCard';
import { notFound } from 'next/navigation';
import ListingsTable from '@/app/components/ListingsTable';

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

  
      <div className="flex flex-col md:flex-row flex-1 bg-gray-50 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-black">
        
       
        <div className="w-full md:w-2/3 p-4 md:p-6">
          <ListingsTable userId={id} />
        </div>

        <div className="w-full md:w-1/3 p-4 md:p-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2 font-semibold">Wydarzenia</p>
            <p className="text-gray-500">
              wydarzenia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}