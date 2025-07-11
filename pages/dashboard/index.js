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
import Delay from '../../components/Delay';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import EnhancedCarousel from '../../components/caro';


const Dashboard = ({obj}) => {
    const [visible,setVisible]=useState(true);
    const [loading,setloading]=useState(false)
    const [showModal,setShowModal]=useState(false)
    //initailizations including saving user's email to local storage
    useEffect(()=>{
        if(!obj.isPinset){
        setTimeout(()=>{setShowModal(true)},3000)}
        localStorage.setItem("email",obj.Email);
    },[])

    useEffect(()=>{
      if(localStorage.getItem("vis")=="true"){
        setVisible(true)
      }
      else{
        setVisible(false)
      }
    })
    function capitalizeFirstLetter(str) {
        if (!str) return str; // handle empty string
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
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

     return (<div className="relative min-h-screen h-full">
    <Head>
        <title>Dashboard | Billsly</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
    </Head>
    <div style={{backgroundColor:"whitesmoke",height:"100vh"}}>
    {showModal && (
  <div
    className="h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn"
  >
    <div className="relative w-full max-w-md mx-4 p-8 bg-white rounded-xl shadow-2xl flex flex-col items-center gap-6 border border-gray-100">
      {/* Close button */}
      <button
        onClick={() => {setShowModal(false)}}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transitionColors p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
        ariaLabel="Close"
      >
        &times;
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Text content */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Security PIN Required</h2>
        <p className="text-gray-600">To access this feature, please set up a secure 4-digit PIN</p>
      </div>

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => window.location.href = '/dashboard/settings/pin'}
          className=" block w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transitionAll transform hover:-translate-y-0.5"
        >
          Create PIN Now
        </button>
        <button
          onClick={() =>{setShowModal(false)}}
          className="block w-full py-3 px-6 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transitionColors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
)}
        <div className='flex pb-5 pt-1 flex-row justify-between items-center ml-2 mr-2'>
        <div className='flex flex-row gap-2 items-center '>
            <Link href="/dashboard/info">{<AccountCircleIcon  className="text-blue-600" sx={{height:"36px",width:"36px",color:"#2563EB"}}/>}</Link>
            <div style={{}} className='rubik-h font-bold text-black'>{greet+ capitalizeFirstLetter(obj.Username)}</div>
            </div>
          <Link href="dashboard/notifications">{<div><CircleNotificationsRoundedIcon className="text-blue-600" sx={{height:"36px",width:"36px",color:"#2536EB"}}/>
     </div>}</Link>
        </div>
        <div className=''>
            
                <div className='h-32 mb-3 ml-2 mr-2 rounded-3xl p-4 bg-blue-600 flex flex-row items-center justify-between'>
                    <div className='flex flex-col items-start '>
                    <div className='text-white rubik-h'>Account Balance <span>{visible? <VisibilityOff onClick={()=>{
                      localStorage.setItem("vis",false)
                      setVisible(false)}} 
                    sx={{height:"24px"}}/> :<Visibility onClick={()=>{localStorage.setItem("vis",true)
                    ;
                    setVisible(true)}} sx={{height:"24px"}}/>}</span></div>
                    <div className=' flex items-center text-white rubik-b' style={{fontSize:"25px"}} >
                    <svg width="20" height="20" className='inline-block' id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115.09 122.88"><title>nigeria-naira</title><path fill="white" d="M13.42,0H32.1a1.25,1.25,0,0,1,1,.6L58,42.26H83.17v-41A1.23,1.23,0,0,1,84.39,0h17.28a1.23,1.23,0,0,1,1.23,1.23v41h11a1.23,1.23,0,0,1,1.23,1.23V54.55a1.23,1.23,0,0,1-1.23,1.23h-11v9.41h11a1.23,1.23,0,0,1,1.23,1.22V77.48a1.23,1.23,0,0,1-1.23,1.22h-11v43a1.23,1.23,0,0,1-1.23,1.23H84.39a1.25,1.25,0,0,1-1-.6L58,78.7H33.26v43A1.23,1.23,0,0,1,32,122.88H13.42a1.23,1.23,0,0,1-1.23-1.23V78.7h-11A1.23,1.23,0,0,1,0,77.48V66.41a1.23,1.23,0,0,1,1.23-1.22h11V55.78h-11A1.23,1.23,0,0,1,0,54.55V43.49a1.23,1.23,0,0,1,1.23-1.23h11v-41A1.23,1.23,0,0,1,13.42,0ZM33.26,55.78v9.41h17l-4.4-9.41ZM70,65.19H83.17V55.78H65.68L70,65.19ZM83.17,78.7H77.88l5.29,11v-11ZM33.26,32.76v9.5h4.57l-4.57-9.5Z"/></svg>
                        {visible? obj.Balance.toLocaleString() :"****"}</div>
                    </div>
                    <div onClick={
                        ()=>{setloading(true)}
                    } className='flex flex-col justify-center items-center '>
                    <Link href={"https://www.billsly.co/dashboard/history"}>{<div className='rubik-b text-white z-10'>Txn History</div>}</Link>
 <Link href={"https://www.billsly.co/dashboard/history"}>{<History begin={"txn"} sx={{color:"white",fontSize:"30px",zIndex:10}}/>}</Link></div>
                </div>
             
        </div>
        <div className='text-center w-full  mt-1 mb-1 rubik-b flex flex-row justify-center gap-8'>
            <div>Quick actions</div>
            <Link href="/dashboard/viewSchedules"><span className="text-blue-600">View schedules</span></Link>
            {(obj.isAdmin)&&<Link href="/dashboard/admin"><span className="text-blue-600">Admin</span></Link>}
        </div>
        <div  className='ml-2 mr-2 px-4 py-8 bg-white rounded-2xl '>
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
        {/* <div className='mt-5 mb-9 w-full'>
            <Carousel2 autoRotate={true} interval={4000} showIndicators={true} slideHeight={95}
        bgColor="white"
        activeIndicatorColor="#1976d2">
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Enjoy seamless transparent transactions where everything happening is clear</div>
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Schedule bill payments so you worry not about forgetting</div>
        <div style={{textAlignLast:"center"}} className="p-2 rubik-b text-center">Map out funds specifically for bills</div>
      </Carousel2>
        </div> */}
        <EnhancedCarousel/>
        <Footer/>
    </div>
    {loading&&<Delay/>}
    </div>
    )
};
export async function getServerSideProps(context){
    try{
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
    const obj = {Username:ob.Username,Balance:ob.Balance,Email:ob.Email,isPinset:ob.Pin,isAdmin:ob.Admin}; // Shallow copy of the object
    
return {
    props:{obj}
}}
    }
    catch(error) {
        return {
          redirect: {
            destination: '/offline.html',
            permanent: false,
          }
        }
      }
      finally{
        console.log("/dashboard has been resolved")
      }

}

export default Dashboard;
