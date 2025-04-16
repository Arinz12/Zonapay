import Box from "@mui/material/Box"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import {io} from "socket.io-client"
import Card from "@mui/material/Card"
import { Button } from "@mui/material"
import {Visibility, VisibilityOff} from "@mui/icons-material"

const Signin = () => {
    const [visible, setVis] = useState(false)

    function showS(){
        document.getElementById("succ").style.display="block";
        setTimeout(() => {
            document.getElementById("succ").style.display="none";
        },2000)
    }

    function showF(){
        document.getElementById("fai").style.display="block";
        setTimeout(() => {
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
        const email = document.getElementsByName("Email")[0].value.trim().toLowerCase();
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
            try {
                const already = await fetch("https://zonapay.onrender.com/zonapay/ValEmail", {
                    method: "post",
                    body: JSON.stringify({val: email}),
                    headers: {"Content-Type": "application/json"}
                });
                if(!already.ok) {
                    isValid = false;
                    document.getElementById("fai").style.display = "block";
                    setTimeout(() => {  
                        document.getElementById("fai").style.display = "none";
                    }, 3000)
                }
            } catch(e) {
                console.log("internet connection error" + e)
            }
        } else {
            emailError.textContent = "";
        }
    
        // Password Validation
        const password = document.getElementsByName("Password")[0].value.trim();
        const passwordError = document.getElementById("passwordError");
    
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
    
        return isValid;
    }

    const handle = async(e) => {
        e.preventDefault()
        if(await val()) {
            e.target.submit()
        }
    }

    function valN() {
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

    function valE() {
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

    function valP() {
        const password = document.getElementsByName("Password")[0].value;
        const passwordError = document.getElementById("passwordError");

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
    
    useEffect(() => {
        if(visible) {
            document.getElementsByName("Password")[0].type = "text"
        } else {
            document.getElementsByName("Password")[0].type = "password"
        }
    })

    return (
        <>
            <Head>
                <title>SignIn</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"/>
                <style jsx global>{`
                    body {
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(135deg, #1a2a6c, #3a7bd5, #000000);
                        background-size: 400% 400%;
                        animation: gradientBG 15s ease infinite;
                        min-height: 100vh;
                    }
                    @keyframes gradientBG {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
            </Head>
            
            <form action="https://zonapay.onrender.com/signup" method="post" autoComplete="off" onSubmit={handle}>
                <Card id="succ" className="hidden ml-1 mr-1 p-3 absolute top-4 left-1/2 transform -translate-x-1/2" sx={{maxWidth:"400px", zIndex: 10}}> 
                    <Button color="success">Account successfully created</Button> 
                </Card>
                <Card id="fai" className="hidden ml-1 mr-1 p-3 absolute top-4 left-1/2 transform -translate-x-1/2" sx={{maxWidth:"400px", zIndex: 10}}> 
                    <Button color="error">Email already exist!</Button> 
                </Card>
                
                <Box className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-8">
                        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
                        
                        <div className="space-y-6">
                            {/* Username Field */}
                            <div className="relative">
                                <input 
                                    onKeyUp={valN} 
                                    type="text" 
                                    name="Username" 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Name"
                                />
                                <span id="usernameError" className="text-red-500 text-xs absolute -bottom-5 left-0"></span>
                            </div>
                            
                            {/* Email Field */}
                            <div className="relative">
                                <input 
                                    onKeyUp={valE} 
                                    type="text" 
                                    name="Email" 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Email"
                                />
                                <span id="emailError" className="text-red-500 text-xs absolute -bottom-5 left-0"></span>
                            </div>
                            
                            {/* Password Field */}
                            <div className="relative">
                                <div className="flex items-center">
                                    <input 
                                        onKeyUp={valP} 
                                        type="password" 
                                        name="Password" 
                                        required 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder="Password"
                                    />
                                    <button 
                                        type="button" 
                                        className="absolute right-3 text-gray-500"
                                        onClick={() => setVis(!visible)}
                                    >
                                        {visible ? <Visibility /> : <VisibilityOff />}
                                    </button>
                                </div>
                                <span id="passwordError" className="text-red-500 text-xs absolute -bottom-5 left-0"></span>
                            </div>
                            
                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                <span>Sign up</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                            
                            <div className="text-center text-gray-600">
                                Already have an account? <Link href="https://zonapay.onrender.com/login" className="text-blue-600 hover:underline">Login</Link>
                            </div>
                        </div>
                    </div>
                </Box>
            </form>
        </>
    )
}

export default Signin