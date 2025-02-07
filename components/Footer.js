import { AddCard, Home, Settings, Wallet } from "@mui/icons-material";
import React from "react"
import  Link  from 'next/link';

import {useRouter} from "next/router"
import { Paper } from "@mui/material";

const Footer=()=>{
    const router=useRouter()
    return (<>
    <div className="fixed w-full flex flex-row bg-white justify-between items-center rounded-t-2xl p-4  rounded-md bottom-0">
        {(router.pathname=="/dashboard")?   <div className="flex flex-col justify-center items-center" ><Home className="text-blue-600 bg-none"  sx={{fontSize:"30px"}}/><div className="rubik-h text-blue-600">Home</div> </div> : <Link href={"/dashboard"}>{<div className="flex flex-col justify-center items-center" > <Home  sx={{fontSize:"30px",color:"#36454F"}}/>
        <div className="rubik-b">Home</div></div>}</Link>}
    
        {(router.pathname=="/a")?   <div className="flex flex-col justify-center items-center"  ><AddCard className="text-blue-600 bg-none"  sx={{fontSize:"30px"}}/><div className="rubik-h text-blue-600">Wallet</div>  </div> :<div className="flex flex-col justify-center items-center" ><Wallet  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b" >Wallet</div></div>}

        {(router.pathname=="/b")?   <div className="flex flex-col justify-center items-center" ><Wallet className="text-blue-600 bg-none" sx={{fontSize:"30px"}}/><div className="rubik-h text-blue-600">Fund</div> </div> :<Link href={"http://localhost:3000/dashboard/fund"}>{<div className="flex flex-col justify-center items-center" ><AddCard  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b">Fund</div></div>}</Link>}
        
        {(router.pathname=="/dashboard/settings")?   <div className="flex flex-col justify-center items-center" ><Settings className="text-blue-600 bg-none"  sx={{fontSize:"30px"}}/><div className="rubik-h text-blue-600">Settings</div> </div> : <Link href="dashboard/settings">{<div className="flex flex-col justify-center items-center" >  <Settings  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b">Settings</div></div>}</Link> } 
    </div>
    </>)
}
export default Footer