import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from "next/link";
//import styles from 'Home.module.css'
import Carousel from 'react-material-ui-carousel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { CardGiftcardRounded, ConnectWithoutContactIcon, Diversity1Rounded, LogoutRounded, PhoneRounded, SchoolRounded} from '@mui/icons-material';
import { LocalAirportRounded,LanguageRounded,CardGiftcard, TvRounded, Tungsten, School, History, Visibility, VisibilityOff, PhoneOutlined } from '@mui/icons-material';
import { Paper,Button } from '@mui/material';
import router from "next/router";
import {DateTime} from "luxon";
import Carousel2 from '../../components/Carousel';
import Ripples from "react-ripples"
import Footer from '../../components/Footer';


const Dashboard = ({obj}) => {
    const [visible,setVisible]=useState(true);
    useEffect(()=>{
        if(!obj.isPinset){
        setTimeout(()=>{document.getElementById("createpin").style.display="flex"},3000)}
    })
    const timinit=DateTime.now().setZone("Africa/Lagos")
    const timer=timinit.toFormat("a").toLowerCase();
    let greet;
    if(timer=="am"){
        greet="Good morning, "
    }
    else if(timer=="pm" && (parseInt(timinit.toFormat("h"))<4||parseInt(timinit.toFormat("h"))==12)){
        greet="Good afternoon, ";
    }
   
    else{
        greet="Good evening, ";
    }

     return (<div className="relative min-h-screen">
    <Head>
        <title>Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
    </Head>
    <div style={{backgroundColor:"whitesmoke",height:"100%"}}>
     <div
         id="createpin" className='hidden  h-full justify-center z-10 items-center fixed top-0 w-full '><Paper elevated={12}   className="relative w-2/3  mx-auto p-7  flex flex-col justify-center items-center gap-2" ><div className="rubik-b">Pin is required </div>
        <Button onClick={()=>{router.push("/dashboard/settings/pin")}} variant={"contained"}>Create pin</Button>
        <span onClick={()=>{document.getElementById("createpin").style.display="none"}}className='absolute top-1 text-3xl right-1'>&times;</span>
         </Paper></div>
        <div className='flex pb-5 pt-1 flex-row justify-between items-center ml-2 mr-2'>
        <div className='flex flex-row gap-2 items-center '>
            <AccountCircleIcon className="text-blue-600" sx={{height:"36px",width:"36px",color:"white"}}/>
            <div style={{}} className='rubik-h font-bold text-black'>{greet+obj.Username}</div>
            </div>
          
        </div>
        <div className=''>
            
                <div className='h-36 ml-2 mr-2 rounded-3xl p-4 bg-blue-600 flex flex-row items-center justify-between'>
                    <div className='flex flex-col items-start '>
                    <div className='text-white rubik-h'>Account Balance <span>{visible? <VisibilityOff onClick={()=>{setVisible(false)}} sx={{height:"24px"}}/> :<Visibility onClick={()=>{setVisible(true)}} sx={{height:"24px"}}/>}</span></div>
                    <div className=' flex items-center text-white rubik-b' style={{fontSize:"25px"}} >
                    <svg width="20" height="20" className='inline-block' id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.09 122.88"><title>nigeria-naira</title><path fill="white" d="M13.42,0H32.1a1.25,1.25,0,0,1,1,.6L58,42.26H83.17v-41A1.23,1.23,0,0,1,84.39,0h17.28a1.23,1.23,0,0,1,1.23,1.23v41h11a1.23,1.23,0,0,1,1.23,1.23V54.55a1.23,1.23,0,0,1-1.23,1.23h-11v9.41h11a1.23,1.23,0,0,1,1.23,1.22V77.48a1.23,1.23,0,0,1-1.23,1.22h-11v43a1.23,1.23,0,0,1-1.23,1.23H84.39a1.25,1.25,0,0,1-1-.6L58,78.7H33.26v43A1.23,1.23,0,0,1,32,122.88H13.42a1.23,1.23,0,0,1-1.23-1.23V78.7h-11A1.23,1.23,0,0,1,0,77.48V66.41a1.23,1.23,0,0,1,1.23-1.22h11V55.78h-11A1.23,1.23,0,0,1,0,54.55V43.49a1.23,1.23,0,0,1,1.23-1.23h11v-41A1.23,1.23,0,0,1,13.42,0ZM33.26,55.78v9.41h17l-4.4-9.41ZM70,65.19H83.17V55.78H65.68L70,65.19ZM83.17,78.7H77.88l5.29,11v-11ZM33.26,32.76v9.5h4.57l-4.57-9.5Z"/></svg>
                        {visible? obj.Balance.toLocaleString() :"****"}</div>
                    </div>
                    <div className='flex flex-col justify-center items-center '>
                    <Link href={"https://zonapay.onrender.com/dashboard/history"}>{<div className='rubik-b text-white z-10'>Txn History</div>}</Link>
 <Link href={"https://zonapay.onrender.com/dashboard/history"}>{<History begin={"txn"} sx={{color:"white",fontSize:"30px",zIndex:10}}/>}</Link></div>
                </div>
             
        </div>
        <div className='text-center w-full  mt-5 mb-1 rubik-h'>Quick actions</div>
        <div  className='ml-2 mr-2 px-4 py-7 bg-white rounded-2xl '>
            <div className='grid grid-cols-3  mx-auto gap-4 justify-center items-center justify-items-center'>
               <Link href="/dashboard/airtime">
                { <div className="flex items-center flex-col gap-1">
                <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <PhoneRounded className='text-blue-600'sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b"> Airtime</div></div>
                  }</Link>
           <Link href="/dashboard/data">{<div className="flex items-center flex-col gap-1">
                <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <LanguageRounded className='text-blue-600' sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b"> Data</div></div>}</Link>
 
            <Link href="/dashboard/ctv">{<div className="flex items-center flex-col gap-1">
                <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <TvRounded className='text-blue-600' sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b">Cable tv</div></div>}</Link>

                 <div className="flex items-center flex-col gap-1 relative">
                <span style={{fontSize:"8px"}} className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
               Coming Soon
              </span>
                  <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <CardGiftcardRounded className='text-blue-600' sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b">Giftcard</div></div>

            <Link href="/dashboard/elect">{ <div className="flex items-center flex-col gap-1">
                <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <BoltRoundedIcon className='text-blue-600' sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b">Electricity</div></div>}</Link>

                 <div className="flex items-center flex-col gap-1 relative">
                <span style={{fontSize:"8px"}} className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Coming Soon
                 </span>
                <div style={{borderRadius:"50%",height:"30px",width:"30px",backgroundColor:"lavender"}} className="flex p-6    flex-col justify-center items-center">
                <SchoolRounded className='text-blue-600' sx={{height:"24px"}}/> </div>
                <div className="text-black text-center font-bold rubik-b">Education</div></div>
            </div>
        </div>
        <div className='mt-5 mb-9 w-full'>
            <Carousel2 autoRotate={true} interval={4000} showIndicators={true} slideHeight={95}
        bgColor="white"
        activeIndicatorColor="#1976d2">
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Enjoy seamless transparent transactions where everything happening is clear</div>
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Schedule bill payments so you worry not about forgetting</div>
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Map out funds specifically for bills</div>
      </Carousel2>
        </div>
        <Footer/>
    </div>
    </div>
    )
};
export async function getServerSideProps(context){
if(!context.req.isAuthenticated()){
    return {
        redirect: {
          destination: '/login',  // URL to redirect to
          permanent: false,       // Set to true for 301 redirect, false for 302 (default)
        },
      };
}
else{
    
    const ob = context.req.user;
    const obj = {Username:ob.Username,Balance:ob.Balance,Email:ob.Email,isPinset:ob.Pin}; // Shallow copy of the object
    
return {
    props:{obj}
}}
}

export default Dashboard;
