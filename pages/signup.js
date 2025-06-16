import  Box from "@mui/material/Box"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {io} from "socket.io-client"
import Card from "@mui/material/Card"
import { Button } from "@mui/material"
import {Visibility, VisibilityOff} from "@mui/icons-material"
import OTPVerification from "../components/otpverify"
 const Signup=()=>{
    const [visible, setVis]=useState(false)
    const [verified,setVerified]=useState(false)
    const [showVerification,setShowVerification]=useState(false)
    const btn=useRef(null)
function showS(){
document.getElementById("succ").style.display="block";
setTimeout(()=>{
    document.getElementById("succ").style.display="none";
},2000)
}
function showF(){
    document.getElementById("fai").style.display="block";
    setTimeout(()=>{
        document.getElementById("fai").style.display="none";
    },2000)
    }
     async function val() {
        let isValid = true;
    
        // Username Validation
        const username = document.getElementsByName("Username")[0].value.trim();
        const usernameError = document.getElementById("usernameError");
    
        if (username === "") {
          usernameError.textContent = "Name field cannot be empty";
          isValid = false;
        } else if (username.length < 3 || username.length > 10) {
          usernameError.textContent = "Character must be between 3 to 10 characters long";
          isValid = false;
        } else {
          usernameError.textContent = "";
        }
    
        // Email Validation
        const email = document.getElementsByName("Email")[0].value.trim().toLowerCase() ;
        const emailError = document.getElementById("emailError");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (email === "") {
          emailError.textContent = "Email cannot be empty";
          isValid = false;
        } else if (!emailRegex.test(email)) {
          emailError.textContent = "Please enter a valid email";
          isValid = false;
        }
        else if(email){
          try{
const already= await fetch("https://www.billsly.co/zonapay/ValEmail",{method:"post",body:JSON.stringify({val:email}),headers:{"Content-Type":"application/json"}});
if(!already.ok){
  isValid=false;
  document.getElementById("fai").style.display="block";
  setTimeout(()=>{  document.getElementById("fai").style.display="none";
},3000)
}
        }
        catch(e){
          console.log("internet connection error"+e)
        }
      }
        
        else {
          emailError.textContent = "";
        }
    
        // Password Validation
        const password = document.getElementsByName("Password")[0].value.trim();
        const passwordError = document.getElementById("passwordError");
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    
        if (password.length < 8) {
          passwordError.textContent = "Password must be at least 8 characters long";
          isValid = false;
        } else if (!password.match(/[A-Z]/)) {
          passwordError.textContent = "Password must contain at least one uppercase letter";
          isValid = false;
        } else if (!password.match(/[a-z]/)) {
          passwordError.textContent = "Password must contain at least one lowercase letter";
          isValid = false;
        } else if (!password.match(/\d/)) {
          passwordError.textContent = "Password must contain at least one number";
          isValid = false;
        } else if (!password.match(/[@$!%*?&.,;+-:#=><~"'^_|{}`]/)) {
          passwordError.textContent = "Password must contain at least one special character ";
          isValid = false;
        } else {
          passwordError.textContent = "";
        }
    
        // after validations 
        return isValid;
      } 
    const   handle= async(e)=>{
      e.preventDefault()
        if(await val()){
          if(!verified){
           const res= await fetch("https://www.billsly.co/change",{method:"POST",body:JSON.stringify({email:document.getElementsByName("Email")[0].value.trim()}),headers:{"Content-Type":"application/json"}})
           if(res.ok){
           setShowVerification(true);
            return}
            else{
              return
            }
          }
          e.target.submit()
        }
    }

    function valN(){
        const username = document.getElementsByName("Username")[0].value.trim();
    const usernameError = document.getElementById("usernameError");

    if (username === "") {
      usernameError.textContent = "Name field cannot be empty";
      
    } else if (username.length < 3 || username.length > 10) {
      usernameError.textContent = "Character must be between 3 to 10 characters long";
      
    } else {
      usernameError.textContent = "";
    }

    }
    function valE(){
        const email = document.getElementsByName("Email")[0].value.trim();
        const emailError = document.getElementById("emailError");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (email === "") {
          emailError.textContent = "Email cannot be empty";
        } else if (!emailRegex.test(email)) {
          emailError.textContent = "Please enter a valid email";
        } else {
          emailError.textContent = "";
        }
    }
    function valP(){
        const password = document.getElementsByName("Password")[0].value;
    const passwordError = document.getElementById("passwordError");
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;

    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters long";
    } else if (!password.match(/[A-Z]/)) {
      passwordError.textContent = "Password must contain at least one uppercase letter";
    } else if (!password.match(/[a-z]/)) {
      passwordError.textContent = "Password must contain at least one lowercase letter";
    } else if (!password.match(/\d/)) {
      passwordError.textContent = "Password must contain at least one number";
    } else if (!password.match(/[@$!%*?&.,;+-:#=><~"'^_|{}`]/)) {
      passwordError.textContent = "Password must contain at least one special character";
    } else {
      passwordError.textContent = "";
    }

    }
    
    useEffect(()=>{
        // const socket = io('https://www.billsly.co', {
        //     query: { userId: "123" } // Send user ID on connection
        // });
        //         socket.on("createdS",showS)
        // socket.on("createdF",showF)
        if(visible){
            document.getElementsByName("Password")[0].type="text"
        }
        else{
            document.getElementsByName("Password")[0].type="password"

        }
    

    })
   useEffect(()=>{
      if(verified){
       btn.current.innerHTML="proceed"
      setShowVerification(false)}
    },[verified])
    return(<>
    <Head>
        <title>Signup</title>
        <meta name="description" content=" signup on Billsly to experience seamless bill payments "/>
        <meta name="keywords" content="signup,Airtime, data purchase, Electricity, Cabletv,Bill payment, Billsly"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta property="og:title" content="Bill payment"/>
<meta property="og:description" content="Experience seamless bill payment"/>
<meta property="og:image" content="https://billsly.co/cicon192.png"/>
<meta property="og:url" content="https://billsly.co"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"></link>
    </Head>
    <form action="https://www.billsly.co/signup" method="post" autoComplete="off" onSubmit={handle}>
        <Card id="succ" className="hidden ml-1 mr-1 p-3 absolute top-0" sx={{maxWidth:"400px"}}> <Button color="success">Account successfully created</Button> </Card>
        <Card id="fai" className="z-10 hidden ml-1 mr-1 p-3 absolute top-1 left-1 font-bold" sx={{maxWidth:"400px"}}> <Button color="error">Email already exist !!!</Button> </Card>
<Box sx={{height:"100svh",backgroundColor:"white",backgroundSize:"cover",backgroundRepeat:"no-repeat"}} className="flex flex-col items-center justify-center">

    <div style={{backgroundColor:"white",backdropFilter:"blur(9px)",fontSize:"35px"}} className="  gap-2 flex flex-col h-5/6 mx-auto  md:w-6/12 w-11/12 border-0   border-blue-600 rounded-3xl  items-center">
    <div className="mx-auto flex justify-center w-full my-2">
  <img src="cicon192.png" height="40px" width="40px"/></div>
<div className=" monomaniac-one-regular text-black">Signup</div>
<div className="form-control monomaniac-one-regular py-2 ">
    <input className="ac" onKeyUp={valN} type="text" name="Username" required/>
    <label>
<span className="monomaniac-one-regular" style={{transitionDelay:"0ms"}}>N</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"50ms"}}>a</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"100ms"}}>m</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"150ms"}}>e</span>
    </label>
        <span style={{fontSize:"12px"}} id="usernameError" className="text-yellow-700 absolute rubik-b" ></span>
</div>


<div className="form-control py-2 monomaniac-one-regular ">
    <input onKeyUp={valE} type="text" name="Email" required className="ac"/>
    <label>
<span className="monomaniac-one-regular" style={{transitionDelay:"0ms"}}>E</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"50ms"}}>m</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"100ms"}}>a</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"150ms"}}>i</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"200ms"}}>l</span>

    </label>
    <span id="emailError" className="text-yellow-700 absolute rubik-b" style={{fontSize:"12px"}}></span>

</div>

<div className="form-control py-2 monomaniac-one-regular relative">
    <input onKeyUp={valP} type="password" name="Password" className="ac" required/>
    <label>
<span className="monomaniac-one-regular" style={{transitionDelay:"0ms"}}>P</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"50ms"}}>a</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"100ms"}}>s</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"150ms"}}>s</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"200ms"}}>w</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"250ms"}}>o</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"300ms"}}>r</span>
<span className="monomaniac-one-regular" style={{transitionDelay:"350ms"}}>d</span>
    </label>
    <span className="absolute right-0 top-2/4" >{visible? <Visibility className="text-black" onClick={()=>{setVis(false)}} sx={{height:"24px"}} style={{height:"24px"}}/>:<VisibilityOff className="text-black" onClick={()=>{setVis(true)}} sx={{height:"24px"}} style={{height:"24px"}} />}</span>

    <span id="passwordError" className="text-yellow-700 absolute rubik-b " style={{fontSize:"12px"}}></span>

</div>


<button className="mt-4 bg-blue-600" type="submit">
            <span ref={btn} className="text-white">Sign up</span> 
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

        <div className="text-black rubik-h monomaniac-one-regular" style={{fontSize:"16px"}}>
            Already have an account ? then <span className="text-blue-600 underline" > <Link href="https://www.billsly.co/login">Login</Link></span>
        </div>
{showVerification&&
<OTPVerification email={document.getElementsByName("Email")[0].value.trim().toLowerCase()} hideOtp={()=>{
setVerified(true);
}}/> }
    </div>
    </Box> </form>   
    </>)
}
export default Signup
