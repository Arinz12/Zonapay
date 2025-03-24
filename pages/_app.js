import React, { useEffect } from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';


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
  <Script src="js/pwa.js" strategy="beforeInteractive" />
   <Component {...pageProps} />
   {pages.includes(router.pathname) && <Footer/>}
  </>)
}

export default MyApp
 