import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = async () => {
  const t = await getTranslations('navbar');
  const session = await auth();
  return (
    <header className="bg-white shadow-md font-work-sans text-gray-900">
      <nav className="w-full flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <Image
              src="/book.svg"
              alt="Logo"
              width={32}
              height={32}
              priority
            />
            <h1 className="hidden sm:block text-2xl font-extrabold tracking-tight">{t('title')}</h1>
          </Link>

          {session && session.user && (
            <>
              <LanguageSwitcher/>
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
                {t('profile')}
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
                  {t('log-out')}
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
                {t('log-in')}
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
