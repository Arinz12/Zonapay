import { Button } from "@mui/material"
import { AlarmAddRounded, LogoutRounded, SettingsAccessibilityRounded } from "@mui/icons-material"
import { ArrowForwardIosRounded } from "@mui/icons-material"
import { Settings as Seticon } from "@mui/icons-material";
import Head from "next/head"
import Num from "../../../components/Number";
import Link from "next/link"
import router from "next/router";
import Delay from "../../../components/Delay";
import { useState } from "react";
import Footer from "../../../components/Footer";

const Settings=()=>{
    const [loading,setLoading]=useState(false)
return(<>
<Head>
    <title>Settings</title>
</Head>
<div style={{fontSize:"",height:"100vh"}} className="relative min-h-screen mx-auto bg-white gap-8 text-white flex flex-col  items-start">
   <div style={{fontSize:"30px"}} className="mt-0 mb-8 text-center bg-white border-b-2 border-blue-500 text-blue-600 w-full rounded-b-2xl px-4 py-8 rubik-h ">Settings</div>
   
<div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%"}}className="flex flex-row bg-blue-600 items-center justify-center" >
    <AlarmAddRounded sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black ">Notifications</div>
</div>
    <ArrowForwardIosRounded sx={{color:""}} className="text-blue-600"/>
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
   <Link href={"https://zonapay.onrender.com/zonapay/logout"}>
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
export default Settings