import Head from 'next/head';
import Link from 'next/link';

function HomePage({ title, children }) {
  return (
    <>
      <Head>
        <title>{`${title} - Datecs Test Case`}</title>
      </Head>
      <div className="py-4 px-6 flex h-dvh">
        <nav className="px-2 py-1 text-sm">
          <ul className="flex gap-2">
            <li className="text-lg font-extrabold">
              <Link href="/">
                Datecs Test Case
              </Link>
            </li>
          </ul>
        </nav>
        <main className="px-6 py-4 absolute inset-0 flex items-center justify-center">
            {children}
        </main>
        <footer className="px-6 py-4 absolute left-0 right-0 bottom-0 grid place-items-center">
            2024 © Danubius Exim SRL All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default HomePage;
