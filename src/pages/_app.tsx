import '@/styles/globals.css';

import { type AppProps } from 'next/app';
import Head from 'next/head';

import { Layout } from '@/components/layout/layout';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/toaster';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function App({ Component, pageProps }: AppProps) {
  const { mobile } = useBreakpoint();

  return (
    <Providers>
      <Head>
        <title>Blub NFT Image Fixer</title>
      </Head>
      <div className="relative z-0 bg-white text-foreground antialiased transition-background dark:bg-black">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
      <Toaster defaultPosition={mobile ? 'top-center' : 'bottom-right'} />
    </Providers>
  );
}
