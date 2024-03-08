import Head from 'next/head';
import NavBar from './NavBar';
import Title from './Title';
import PrelineScript from "./PrelineScript";

function Page({ title, children }) {
  return (
    <>
      <Head>
        <title>{`${title} - Datecs Test Case`}</title>
      </Head>
      <div className="py-4 px-6 min-h-dvh relative">
        <header>
          <NavBar />
        </header>
        <main className="px-6 py-4">
          <Title>{title}</Title>
          {children}
        </main>
        <footer className="px-6 py-4 absolute bottom-0 left-0 right-0 place-items-center text-center">
          2024 © Danubius Exim SRL All rights reserved.
        </footer>
        <PrelineScript />
      </div>
    </>
  );
}

export default Page;
