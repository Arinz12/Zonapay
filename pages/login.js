import  Box from "@mui/material/Box"
import Head from "next/head"
import Link from "next/link"
import { useEffect } from "react"
import {io} from "socket.io-client"
 const Signup=()=>{
    useEffect(()=>{
        const socket=io()
    })
    return(<>
    <Head>
        <title>Login</title>
    </Head>
    <form action="https://zonapay.onrender.com/login" method="post" autoComplete="off">

<Box sx={{height:"100svh",backgroundImage:"url('img.jpg')",backgroundSize:"cover",backgroundRepeat:"no-repeat"}} className="flex flex-col items-center justify-center">
    <div style={{backgroundColor:"rgba(0, 0, 0, 0.253)",backdropFilter:"blur(9px)",fontSize:"35px"}} className=" pt-7 gap-4 flex flex-col h-5/6 mx-auto md:w-6/12 w-11/12  border-2 rounded-3xl  items-center">
<div className=" rubik-h text-white">Login</div>

<div className="form-control rubik-b">
    <input type="text" name="email" required/>
    <label>
<span style={{transitionDelay:"0ms"}}>E</span>
<span style={{transitionDelay:"50ms"}}>m</span>
<span style={{transitionDelay:"100ms"}}>a</span>
<span style={{transitionDelay:"150ms"}}>i</span>
<span style={{transitionDelay:"200ms"}}>l</span>

    </label>
</div>
<div className="form-control rubik-b">
    <input type="password" name="password" required/>
    <label>
    <span style={{transitionDelay:"0ms"}}>P</span>
<span style={{transitionDelay:"50ms"}}>a</span>
<span style={{transitionDelay:"100ms"}}>s</span>
<span style={{transitionDelay:"150ms"}}>s</span>
<span style={{transitionDelay:"200ms"}}>w</span>
<span style={{transitionDelay:"250ms"}}>o</span>
<span style={{transitionDelay:"300ms"}}>r</span>
<span style={{transitionDelay:"350ms"}}>d</span>

    </label>
</div>


<button className="mt-4" type="submit">
            <span>Continue</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 74 74"
                height="34"
                width="34"
            >
                <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                <path
                    fill="black"
                    d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                ></path>
            </svg>
        </button>

        <div className="text-white" style={{fontSize:"16px"}}>
            Don't have an account yet? then <span className="text-blue-200 underline" > <Link href="https://zonapay.onrender.com/signup">Signup</Link></span>
        </div>

    </div>
    </Box>  
    </form>  
    </>)
}
export default Signup