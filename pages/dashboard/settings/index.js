import { Button } from "@mui/material"
import { AlarmAddRounded, SettingsAccessibilityRounded } from "@mui/icons-material"
import { ArrowForwardIosRounded } from "@mui/icons-material"
import { Settings as Seticon } from "@mui/icons-material";
import Head from "next/head"
import Num from "../../../components/Number";
import Link from "next/link"

const Settings=()=>{
return(<>
<Head>
    <title>Settings</title>
</Head>
<div style={{fontSize:"",height:"100vh"}} className="mx-auto bg-black gap-8 text-white flex flex-col  items-start">
   <div style={{fontSize:"30px"}} className=" rubik-h pb-4">Settings</div>
   
<div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"white"}}className="flex flex-row items-center justify-center" >
    <AlarmAddRounded sx={{color:"black"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b  ">Notifications</div>
</div>
    <ArrowForwardIosRounded />
   </div>

   <div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"white"}}className="flex flex-row items-center justify-center" >
    <Seticon sx={{color:"black"}}/>  </div>
<div style={{fontSize:"20px"}} className="ml-3 rubik-b  ">Password reset</div>
</div>
    <ArrowForwardIosRounded />
   </div>

   <div style={{backgroundColor:""}} className="flex flex-row justify-between items-center p-2 w-full">
   <div className="flex flex-row justify-start items-center">
    <div style={{height:"40px",width:"40px", borderRadius:"50%",backgroundColor:"white"}}className="flex flex-row items-center justify-center" >
    <Seticon sx={{color:"black"}}/>  </div>
<Link href="dashboard/settings/pin">{<div style={{fontSize:"20px"}} className="ml-3 rubik-b  ">Pin reset</div>}</Link>
</div>
    <ArrowForwardIosRounded />
   </div>
     </div>
</>)
}
export default Settings