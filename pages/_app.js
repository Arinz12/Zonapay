import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Head from "next/head";
import Analytics from '../components/Analytics';
import "../styles/transition.css"
import Delay from '../components/Delay';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false);
  const [showCustomLoader, setShowCustomLoader] = useState(false);

  // Define paths that should show the custom loader
  const LOADER_PATHS = ['/dashboard/history', '/dashboard/wallethistory','/dashboard/viewSchedules'];

  useEffect(() => {
    const handleStart = (url) => {
      setTransitioning(true);
      const path = url.split('?')[0]; // Remove query parameters
      if (LOADER_PATHS.includes(path)) {
        setShowCustomLoader(true);
      }
    };

    const handleComplete = () => {
      setTransitioning(false);
      setShowCustomLoader(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

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

      {/* Custom loader for specific paths */}
      {showCustomLoader && <Delay/>}

      <div className={`page-container ${shouldAnimate ? (transitioning && (router.pathname=="/dashboard") ? "fade-out2" : transitioning ? 'fade-out1' : 'fade-in') : ''}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp