import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Head from "next/head";
import Analytics from '../components/Analytics';
import Delay from '../components/Delay';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [waitingForProps, setWaitingForProps] = useState(false);

  // Pages that should show the loader during getServerSideProps
  const LOADER_PAGES = ['/dashboard/history', '/dashboard/wallethistory'];

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setTransitioning(true);
      if (LOADER_PAGES.includes(url.split('?')[0])) {
        setWaitingForProps(true);
      }
    };

    const handleRouteChangeComplete = (url) => {
      setTransitioning(false);
      setWaitingForProps(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  // Your existing service worker code
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Registration failed:', error));
    }
  }, []);

  const pages = ["/dashboard","/dashboard/settings","/dashboard/history"];
  const pages2 = ["/dashboard/settings","/dashboard/history"];
  const shouldAnimate = !pages2.includes(router.pathname);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json"/> 
        <link rel='icon' href='/cicon16.png' type="image/png"/>
      </Head>
      <Analytics/>
      
      {/* Show loader only for specific pages */}
      {waitingForProps && <Delay/>}
      
      <div className={`page-container ${shouldAnimate ? (transitioning && (router.pathname=="/dashboard") ? "fade-out2" : transitioning ? 'fade-out1' : 'fade-in') : ''}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;