import { Button } from "@mui/material"
import { AlarmAddRounded, ArrowBack, LogoutRounded, SettingsAccessibilityRounded } from "@mui/icons-material"
import { ArrowForwardIosRounded } from "@mui/icons-material"
import { Settings as Seticon } from "@mui/icons-material";
import Head from "next/head"
import Num from "../../../components/Number";
import Link from "next/link"
import router from "next/router";
import Delay from "../../../components/Delay";
import { useState } from "react";
import Footer from "../../../components/Footer";
const Security=()=>{
    const [loading,setLoading]=useState(false)
return(<>
<Head>
    <title>Security</title>
</Head>
<div style={{fontSize:"",height:"100vh"}} className="relative min-h-screen mx-auto bg-white gap-8 text-white flex flex-col  items-start">
<div className="flex w-full sticky mx-auto top-0 items-center gap-4 p-5 border-b border-gray-200">
          <button 
            className="flex items-center justify-center p-1 text-blue-600" 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowBack color="primary" />
          </button>
          <div className="text-xl font-semibold">Security</div>
        </div>

  <Link href={"/forgotPass"}>{<div  onClick={()=>{
        setLoading(true)
    }}  style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%"}}className="flex flex-row bg-blue-600 items-center justify-center" >
    <Seticon sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black ">Password reset</div>
</div>
<ArrowForwardIosRounded sx={{color:""}} className="text-blue-600"/>
   </div>}</Link>

   <Link href={"/dashboard/settings/resetpin"} >{<div  onClick={()=>{
        setLoading(true)
    }}  style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%"}}className="flex flex-row bg-blue-600 items-center justify-center" >
    <Seticon sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black">Pin reset</div>
</div>
<ArrowForwardIosRounded sx={{color:""}} className="text-blue-600"/>
   </div>}</Link>
   <Link href={"https://www.billsly.co/zonapay/logout"}>
    {<div onClick={()=>{
        setLoading(true)
    }} style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%"}}className="flex flex-row bg-blue-600 items-center justify-center" >
    <LogoutRounded sx={{color:"white"}}/></div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black">Log out</div>
</div>
<ArrowForwardIosRounded sx={{color:""}} className="text-blue-600"/>
   </div>}</Link>

   {loading&&<Delay/>}
<Footer/>
     </div>
</>)
}
export default Security