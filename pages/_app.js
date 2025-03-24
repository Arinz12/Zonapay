import React, { useEffect } from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Head from "next/head";
import Link from "next/link";
function MyApp({ Component, pageProps }) {

  const router=useRouter()
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
  { /* <Script src="js/pwa.js" strategy="beforeInteractive" /> */}
   <Component {...pageProps} />
   {pages.includes(router.pathname) && <Footer/>}
  </>)
}
export default MyApp
 