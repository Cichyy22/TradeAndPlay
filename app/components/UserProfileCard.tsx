'use client';

import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
}

export default function UserProfileCard({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto text-black">
      <div className="flex items-center gap-4">
        <Image
          src={user.image}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400">Dołączył: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}