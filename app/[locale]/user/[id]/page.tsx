import UserProfileCard from '@/app/components/UserProfileCard';
import ListingsTable from '@/app/components/ListingsTable';
import { auth } from '@/auth';
import EventsTable from '@/app/components/EventTable';
import { prisma } from '@/prisma';

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await auth();
  const userId = id;

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
          <div className="w-full md:w-1/2 p-4 md:p-6">
            <ListingsTable userId={user.id} />
          </div>

          <div className="w-full md:w-1/2 p-4 md:p-6">
              <EventsTable userId={user.id} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-6">Aby zobaczyć swoje ogłoszenia, zaakceptuj regulamin.</div>
      )}
    </div>
  );
}
