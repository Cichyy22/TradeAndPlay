import { PrismaClient } from '@/app/generated/prisma';
import UserProfileCard from '@/app/components/UserProfileCard';
import ListingsTable from '@/app/components/ListingsTable';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = params.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !session || session.userId !== userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow z-10">
        <UserProfileCard user={user} />
      </div>

      {session.user?.acceptedTerms === true ? (
        <div className="flex flex-col md:flex-row flex-1 bg-gray-50 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-black">
          <div className="w-full md:w-2/3 p-4 md:p-6">
            <ListingsTable userId={user.id} />
          </div>

          <div className="w-full md:w-1/3 p-4 md:p-6">
            <div className="text-sm text-gray-600">
              <p className="mb-2 font-semibold">Wydarzenia</p>
              <p className="text-gray-500">wydarzenia</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-6">Aby zobaczyć swoje ogłoszenia, zaakceptuj regulamin.</div>
      )}
    </div>
  );
}
