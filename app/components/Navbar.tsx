import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import Image from 'next/image';

const Navbar = async () => {
  const session = await auth();
  console.log(session);

  return (
    <header className="bg-white shadow-md font-work-sans text-gray-900">
      <nav className="container mx-auto flex justify-between items-center p-2 px-2">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <Image
              src="/book.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
            <p className="text-2xl font-extrabold tracking-tight">Nazwa</p>
          </Link>

          {session && session.user && (
            <>
              {/*  dodać dodatkowe linki, np. dashboard itp. */}
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          {session && session.user ? (
            <>
              <Link
                href={`/user/${session.user.id}`}
                className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profil
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-lg font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  Wyloguj
                </button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <button
                type="submit"
                className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Zaloguj
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
