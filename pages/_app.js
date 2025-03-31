import React, { useEffect } from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Head from "next/head";
import Link from "next/link";
import "../styles/transition.css"
function MyApp({ Component, pageProps }) {
const router=useRouter()
const [transitioning, setTransitioning] = useState(false);

useEffect(() => {
  const handleStart = () => setTransitioning(true);
  const handleComplete = () => setTransitioning(false);

  router.events.on('routeChangeStart', handleStart);
  router.events.on('routeChangeComplete', handleComplete);
  router.events.on('routeChangeError', handleComplete);

  return () => {
    router.events.off('routeChangeStart', handleStart);
    router.events.off('routeChangeComplete', handleComplete);
    router.events.off('routeChangeError', handleComplete);
  };
}, []);


  useEffect(()=>{
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Registration failed:', error));
  }
  })
const pages=["/dashboard","/dashboard/settings","/dashboard/history"]
  return(<>
  <Head>
  <link rel="manifest" href="/manifest.json"/> 
  </Head>
  <div className={`page-container ${transitioning ? 'fade-out' : 'fade-in'}`}> <Component {...pageProps} />
   {pages.includes(router.pathname) && <Footer/>}
 </div> </>
  )
}
export default MyApp
 