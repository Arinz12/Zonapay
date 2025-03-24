import React from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import Script from "/next/script"

function MyApp({ Component, pageProps }) {
  const router=useRouter()
const pages=["/dashboard","/dashboard/settings","/dashboard/history"]
  return(<>
  <Script src="js/pwa.js" strategy="beforeInteractive" />
   <Component {...pageProps} />
   {pages.includes(router.pathname) && <Footer/>}
  </>)
}

export default MyApp
 