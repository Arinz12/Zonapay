import  Box from "@mui/material/Box"
import Head from "next/head"
import Link from "next/link"
import { useEffect } from "react"
import {io} from "socket.io-client"
 const Signup=()=>{
const val= async (e)=>{
    e.preventDefault();
    console.log("entered")
       try{
        const exist= await fetch("http://localhost:3000/zonapay/valUser",
        {method:"post",body:JSON.stringify({email:document.getElementsByName("email")[0].value.trim(),password:document.getElementsByName("password")[0].value.trim()}),headers:{"Content-Type":"application/json"}});
      if(!exist.ok){
      document.getElementById("note").style.display="flex"
      setTimeout(()=>{document.getElementById("note").style.display="none"
    },5000)
      console.log("You are not in")
      return
      }
      e.target.submit();
      console.log("you are in...")
      return
      }

    catch(er){
        er.preventDefault()
        console.log("connect to the internet")
    }}
    useEffect(()=>{
        const socket=io()
    })
    return(<>
    <Head>
        <title>Login</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"></link>
    </Head>
    <div style={{fontSize:"30px"}} className=" absolute top-1 w-full monomaniac-one-regular text-center text-black">WELCOME BACK</div>

    <form action="http://localhost:3000/login" method="post" autoComplete="off" onSubmit={val}>
    <div
  id="note"
  className="fixed top-2 right-2 flex-col gap-4 w-60 sm:w-72 text-xs sm:text-sm z-50 hidden"
>
  <div className="error-alert cursor-default flex items-center justify-between w-full h-20 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-lg px-4">
    <div className="flex gap-3 items-center">
      <div className="text-red-800 bg-red-100 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <p className="text-white font-bold">Error</p>
        <p className="text-white/80" id="mnote">
          Invalid username or password.
        </p>
      </div>
    </div>
    <button className="text-white hover:text-red-800 bg-red-600 hover:bg-red-100 p-2 rounded-md transition ease-in-out">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</div>

<Box sx={{height:"100svh",backgroundColor:"white",backgroundSize:"cover",backgroundRepeat:"no-repeat"}} className="flex flex-col items-center justify-center">
    <div style={{backgroundColor:"white",backdropFilter:"blur(9px)",fontSize:"35px"}} className=" pt-16 gap-4 flex flex-col h-5/6 mx-auto md:w-6/12 w-11/12  md:border-4 border-0 border-blue-600 rounded-3xl  items-center">
<div className=" monomaniac-one-regular text-black">Login</div>

<div className="form-control  rubik-b">
    <input type="text" name="email"  required/>
    <label>
<span className="monomaniac-one-regular" style={{transitionDelay:"0ms"}}>E</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"50ms"}}>m</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"100ms"}}>a</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"150ms"}}>i</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"200ms"}}>l</span>

    </label>
</div>
<div className="form-control rubik-b">
    <input type="password" name="password" required/>
    <label>
<span  className="monomaniac-one-regular" style={{transitionDelay:"0ms"}}>P</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"50ms"}}>a</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"100ms"}}>s</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"150ms"}}>s</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"200ms"}}>w</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"250ms"}}>o</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"300ms"}}>r</span>
<span  className="monomaniac-one-regular" style={{transitionDelay:"350ms"}}>d</span>

    </label>
</div>


<button className="mt-4 bg-blue-600" type="submit"> 
            <span className="text-white">Log in</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 74 74"
                height="34"
                width="34"
            >
                <circle strokeWidth="3" stroke="white" r="35.5" cy="37" cx="37"></circle>
                <path
                    fill="white"
                    d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                ></path>
            </svg>
        </button>

        <div className="text-black rubik-h " style={{fontSize:"16px"}}>
            Don't have an account yet? then <span className="text-blue-600 underline" > <Link href="http://localhost:3000/signup">Signup</Link></span>
        </div>

    </div>
    </Box>  
    </form>  
    </>)
}
export default Signup