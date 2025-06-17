import React, { useEffect, useState } from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Head from "next/head";
import Link from "next/link";
import "../styles/transition.css"
import Analytics from '../components/Analytics';
import ChangingWordsComponent from '../components/Side';
import Delay from '../components/Delay';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [transitioning, setTransitioning] = useState(false);
  const [waitingForProps, setWaitingForProps] = useState(false);

  // Track when getServerSideProps starts/ends
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setTransitioning(true);
      setWaitingForProps(true); // Start waiting for props
    };

    const handleRouteChangeComplete = () => {
      setTransitioning(false);
      setWaitingForProps(false); // Props received
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', () => {
      setTransitioning(false);
      setWaitingForProps(false);
    });

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  // Service Worker registration (unchanged)
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
      
      {/* Show loader while waiting for getServerSideProps */}
      {waitingForProps && <Delay/>}
      
      <div className={`page-container ${shouldAnimate ? (transitioning && (router.pathname=="/dashboard") ? "fade-out2" : transitioning ? 'fade-out1' : 'fade-in') : ''}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp