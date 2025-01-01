import React, { useState } from 'react';
import Head from 'next/head';
import Link from "next/link";
//import styles from 'Home.module.css'
import Carousel from 'react-material-ui-carousel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ConnectWithoutContactIcon} from '@mui/icons-material';
import { LocalAirportRounded,LanguageRounded,CardGiftcard, TvRounded, Tungsten, School, History, Visibility, VisibilityOff, PhoneOutlined } from '@mui/icons-material';
import { Paper } from '@mui/material';

const Dashboard = ({obj}) => {
    const [visible,setVisible]=useState(true)
     return (<>
    <Head>
        <title>Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
    </Head>
    <div style={{backgroundColor:"whitesmoke",height:"100vh"}} >
        <div className='flex pb-5 pt-1 flex-row justify-between items-center ml-2 mr-2'>
        <div className='flex flex-row gap-2 items-center '>
            <AccountCircleIcon className="text-blue-600" sx={{height:"36px",width:"36px",color:"white"}}/>
            <div style={{}} className='rubik-h font-bold text-black'>Hi, {obj.Username}</div>
            </div>
            {/* <div className='flex flex-row items-center'>
                <ConnectWithoutContactIcon sx={{backgroundColor:"",padding:"10px"}} />
            </div> */}
        </div>
        <div className=''>
            <Carousel animation='slide' autoPlay={false} navButtonsAlwaysVisible={false} activeIndicatorIconButtonProps={{
                style:{
                    color:"blue"
                }
            }}>
                <div className='h-36 ml-2 mr-2 rounded-3xl p-4 bg-blue-600 flex flex-row items-center justify-between'>

                    <div className='flex flex-col items-start '>
                    <div className='text-white rubik-h'>Account Balance <span>{visible? <VisibilityOff onClick={()=>{setVisible(false)}} sx={{}}/> :<Visibility onClick={()=>{setVisible(true)}} sx={{}}/> }</span> </div>
                    <div className='text-white rubik-b' style={{fontSize:"25px"}} >{visible? obj.Balance.toLocaleString() :"****"}</div>
                    </div>
                    <div className='flex flex-col justify-center items-center '>
                    <Link href={"https://zonapay.onrender.com/dashboard/history"}>{<div className='rubik-b text-white'>Txn History</div>}</Link>
 <Link href={"https://zonapay.onrender.com/dashboard/history"}>{<History begin={"txn"} sx={{color:"white",fontSize:"30px"}}/>}</Link></div>
                </div>
                <div className='h-36 ml-2 mr-2 rounded-3xl bg-blue-600'></div>

            </Carousel>
        </div>
        <div className='ml-1 mr-1 p-3 mt-4'>
            <div className='grid grid-cols-3 mx-auto gap-5 justify-center items-center justify-items-center'>

               <Link href={"/dashboard/airtime"}>{<Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><PhoneOutlined className='text-blue-600'/>
                <div className="text-black text-center rubik-h">Buy Airtime</div>
                 </Paper> }</Link>

           <Link href={"/dashboard/data"}>{ <Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><LanguageRounded className='text-blue-600'  />
                <div className="text-black text-center rubik-h">Buy <br/>Data</div>
                 </Paper>}</Link>
 
            <Link href={"dashboard/ctv"}>{<Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><TvRounded className='text-blue-600' />
                <div className="text-black text-center rubik-h">Cable Tv</div>
                 </Paper>}</Link>

                 <Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><CardGiftcard className='text-blue-600' />
                <div className="text-black text-center rubik-h">Gift Card</div>
                 </Paper>

                 <Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><Tungsten className='text-blue-600'  />
                <div className="text-black text-center rubik-h">Electricity</div>
                 </Paper>

                 <Paper elevation={10} className='flex flex-col justify-center items-center ' style={{width:"80px",height:"80px",backgroundColor:"white",borderRadius:"12px"}}><School className='text-blue-600'  />
                <div className="text-black text-center rubik-h">Education</div>
                 </Paper>
                

            </div>
        </div>

        <div>
            <Carousel animation="slide" className='mt-4' autoplay={true} fullHeightHover={false} indicators={false} navButtonsAlwaysVisible={false} >
<Paper className="rounded-2xl mx-auto rubik-b p-4 text-center " elevation={1} sx={{height:"100px",width:"90%"}}>Enjoy seamless transparent transactions where everything happening is clear</Paper>
<Paper className="rounded-2xl mx-auto rubik-b p-4 text-center" elevation={1} sx={{height:"100px",width:"90%"}}>Schedule bill payments so you worry not about forgetting</Paper>
            </Carousel>
        </div>
    </div>
    </>
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
    const obj = {Username:ob.Username,Balance:ob.Balance,Email:ob.Email}; // Shallow copy of the object
    
return {
    props:{obj}
}}
}

export default Dashboard;
