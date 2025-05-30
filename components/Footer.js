import { AddCard, AddCardRounded, Home, HomeRounded, Settings, SettingsRounded, Wallet, WalletRounded } from "@mui/icons-material";
import React from "react"
import  Link  from 'next/link';

import {useRouter} from "next/router"
import { Paper } from "@mui/material";

const Footer=()=>{
    const router=useRouter()
    return (<>
    <div className="shp z-10 w-full flex flex-row bg-white justify-between items-center rounded-t-2xl p-4  rounded-md bottom-0">
        {(router.pathname=="/dashboard")?   <div className="flex flex-col justify-center items-center" ><HomeRounded className="text-blue-600 bg-none"  sx={{fontSize:"26px"}}/><div className="rubik-b text-blue-600">Home</div> </div> : <Link href={"/dashboard"}>{<div className="flex flex-col justify-center items-center" > <HomeRounded  sx={{fontSize:"30px",color:"#36454F"}}/>
        <div className="rubik-b">Home</div></div>}</Link>}
    
        {(router.pathname=="/a")?   <div className="flex flex-col justify-center items-center"  ><WalletRounded className="text-blue-600 bg-none"  sx={{fontSize:"26px"}}/><div className="rubik-b text-blue-600">Wallet</div>  </div> :<div className="flex flex-col justify-center items-center" ><WalletRounded  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b" >Wallet</div></div>}

        {(router.pathname=="/b")?   <div className="flex flex-col justify-center items-center" ><AddCardRounded className="text-blue-600 bg-none" sx={{fontSize:"26px"}}/><div className="rubik-b text-blue-600">Fund</div> </div> :<Link href={"https://zonapay.onrender.com/dashboard/fund"}>{<div className="flex flex-col justify-center items-center" ><AddCardRounded  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b">Fund</div></div>}</Link>}
        
        {(router.pathname=="/dashboard/settings")?   <div className="flex flex-col justify-center items-center" ><SettingsRounded className="text-blue-600 bg-none"  sx={{fontSize:"26px"}}/><div className="rubik-b text-blue-600">Settings</div> </div> : <Link href="/dashboard/settings">{<div className="flex flex-col justify-center items-center" >  <SettingsRounded  sx={{fontSize:"30px",color:"#36454F"}}/><div className="rubik-b">Settings</div></div>}</Link> } 
    </div>
    </>)
}
export default Footer