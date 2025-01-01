import React from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  const router=useRouter()
const pages=["/dashboard","/dashboard/settings","/dashboard/history"]
  return(<>
   <Component {...pageProps} />
   {pages.includes(router.pathname) && <Footer/>}
  </>)
}

export default MyApp
 