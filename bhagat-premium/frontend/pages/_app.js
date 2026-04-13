import '../src/styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import { ThemeProvider } from '../src/context/ThemeContext';
import WhatsAppFloat from '../src/components/common/WhatsAppFloat';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Scroll reveal
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [pageProps]);

  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0F172A" />
      </Head>
      <WhatsAppFloat />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
