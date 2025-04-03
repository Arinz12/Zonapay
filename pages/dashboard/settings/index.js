import { Button } from "@mui/material"
import { AlarmAddRounded, SettingsAccessibilityRounded } from "@mui/icons-material"
import { ArrowForwardIosRounded } from "@mui/icons-material"
import { Settings as Seticon } from "@mui/icons-material";
import Head from "next/head"
import Num from "../../../components/Number";
import Link from "next/link"
import router from "next/router";

const Settings=()=>{
return(<>
<Head>
    <title>Settings</title>
</Head>
<div style={{fontSize:"",height:"100vh"}} className="mx-auto bg-white gap-8 text-white flex flex-col  items-start">
   <div style={{fontSize:"30px"}} className="mt-0 mb-8 text-center bg-blue-600 w-full rounded-b-2xl px-4 py-8 rubik-h ">Settings</div>
   
<div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"black"}}className="flex flex-row items-center justify-center" >
    <AlarmAddRounded sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black ">Notifications</div>
</div>
    <ArrowForwardIosRounded sx={{color:""}} className="bg-blue-600"/>
   </div>

   <div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"black"}}className="flex flex-row items-center justify-center" >
    <Seticon sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black ">Password reset</div>
</div>
<ArrowForwardIosRounded sx={{color:""}} className="bg-blue-600"/>
   </div>

   <Link href={"/dashboard/settings/pin"} >{<div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"black"}}className="flex flex-row items-center justify-center" >
    <Seticon sx={{color:"white"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b text-black">Pin reset</div>
</div>
<ArrowForwardIosRounded sx={{color:""}} className="bg-blue-600"/>
   </div>}</Link>
     </div>
</>)
}
export default Settings