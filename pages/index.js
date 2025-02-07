import React, { useEffect } from 'react';
import Head from 'next/head';
import "@fontsource/roboto/500.css";
import Link from "next/link";
import Script from "next/script"

// Material UI components
import { Box,Container,Card, CardContent,CardMedia,Typography,Paper,Button,Stack} from '@mui/material';

// System utilities
import { bgcolor } from '@mui/system';

// Icons
import SchoolIcon from '@mui/icons-material/School'; 
import TungstenIcon from '@mui/icons-material/Tungsten';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LanguageIcon from '@mui/icons-material/Language';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import Fingerprint from '@mui/icons-material/Fingerprint';
import SpeakerPhoneTwoToneIcon from '@mui/icons-material/SpeakerPhoneTwoTone';
import FacebookRounded from '@mui/icons-material/FacebookRounded';
import GoogleIcon from '@mui/icons-material/Google';
import SkipNext from '@mui/icons-material/SkipNext';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import dynamic from "next/dynamic";

// Carousel
import Carousel from 'react-material-ui-carousel';
// Animation
import Slide from 'react-reveal/Slide';
import FadeOutComponent from '../components/Fadeout';
import SplitText from '../components/SplitText';

 const Dash=(props)=>{
  const handleAnimationComplete=()=>{console.log("Animation is completed")}
useEffect(()=>{
const source= new EventSource("http://localhost:3000/stream");
source.onmessage= function(e){console.log(e.data)}
source.onerror= ()=>{console.log("An error occured")}
},[])

    return (<>
    <Head>
        <title>Zona</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet"/>
{/* <script src="https://unpkg.com/@tailwindcss/browser@4"></script> */}

</Head>
<Stack className='focus:outline-none absolute bg-transparent top-2 z-10  w-full p-2 pt-1 pr-1 right-1 items-center' direction={"row"} justifyContent="space-between" sx={{bgcolor:"none"}} >
    <Button  variant="text" sx={{fontSize:"25px",textTransform: 'none' }} className='rubik-h mr-2 text-white '>Zonapay</Button>
    {/* <div><SplitText
  text="Zonapay"
  className="text-2xl font-semibold text-center"
  delay={100}
  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
  easing="easeOutCubic"
  threshold={0.2}
  rootMargin="-50px"
  onLetterAnimationComplete={handleAnimationComplete}
/></div> */}
    
<Button href="http://localhost:3000/signup"  variant="contained" className="mr-2 sticky top-1">Get started</Button>
</Stack>
       <div className='relative w-full focus:outline-none'> <Carousel className='w-full focus:outline-none'  animation='fade' interval={6000}>
            <Box className="flex flex-col gap-2 justify-center items-center" sx={{height:"80vh",width:"100%", textAlign:"center",backgroundImage:"url('https://www.shutterstock.com/shutterstock/photos/1932042689/display_1500/stock-photo-businessman-using-mobile-smart-phone-business-global-internet-connection-application-technology-1932042689.jpg')",backgroundSize:"cover"}}>
                <div style={ {backgroundColor: "rgba(0, 0, 0, 0.553)",cursor: 'pointer'}} className="h-full  flex flex-row justify-center p-1 md:justify-end items-center w-full font-semibold text-white md:pr-8">
                    <Box className="max-w-sm md:max-w-md sli" sx={{ textAlignLast:"center"}}><Typography className="rubik-h" sx={{fontSize:"40px"}}>Simplify Your Payments</Typography>
                    <Typography className="rubik-b" variant="body" sx={{fontSize:" 22px"}}>Easily manage and pay all your bills in one place. Enjoy a seamless experience with secure transactions and timely reminders.</Typography></Box>
                </div>
            </Box>
            <Box className="flex flex-col gap-2 justify-center items-center" sx={{ height:"80vh",bgcolor:"green",textAlign:"center"  ,backgroundImage:"url('https://executiveacademy.at/fileadmin_synced_assets/_processed_/9/f/csm_filler-news-why-people-with-a-non-business-03_fd8b48b3e5.jpg')",backgroundSize:"cover"}}>
                <div style={ {backgroundColor: "rgba(0, 0, 0, 0.553)",cursor: 'pointer'}} className=" flex flex-row md:justify-end p-1 h-full justify-center items-center w-full font-semibold text-white md:pr-8">
                    <Box className="max-w-sm md:max-w-md sli"  sx={{ textAlignLast:"center"}}><Typography className="rubik-h" sx={{fontSize:"40px"}}>Stay Organized with Our Dashboard</Typography>
                    <Typography className="rubik-b" variant="body" sx={{fontSize:" 22px"}}>Track due dates, view payment history, and set up automatic payments to never miss a deadline again</Typography></Box>
                </div></Box>
            
            <Box className="flex flex-col gap-2 justify-center items-center" sx={{ height:"80vh",bgcolor:"yellow",textAlign:"center" ,backgroundImage:"url('https://www.shutterstock.com/image-photo/businesswoman-giving-high-five-male-600nw-2226244055.jpg')",backgroundSize:"cover" }}>
                <div style={ {backgroundColor: "rgba(0, 0, 0, 0.553)",cursor: 'pointer'}} className=" h-full flex flex-row md:justify-start p-1 justify-center items-center w-full font-semibold text-white md:pl-8">
                    <Box className="max-w-sm md:max-w-md sli" sx={{ textAlignLast:"center"}}><Typography className="rubik-h" sx={{fontSize:"40px"}}>Save Time and Avoid Late Fees</Typography>
                    <Typography className="rubik-b" variant="body" sx={{fontSize:" 22px"}}>With our intuitive app, schedule payments ahead of time and receive notifications to keep your finances on track.</Typography></Box>
                </div></Box>
                <Box className="flex flex-col gap-2 justify-center items-center" sx={{ height:"80vh",bgcolor:"blue",textAlign:"center"   ,backgroundImage:"url('https://i.pinimg.com/originals/3c/2e/31/3c2e3183d421e5b5d656b4db567bec31.jpg')",backgroundSize:"cover"}}>
                <div style={ {backgroundColor: "rgba(0, 0, 0, 0.553)",cursor: 'pointer'}}className="h-full flex flex-row p-1 md:justify-end justify-center items-center w-full font-semibold text-white md:pr-8">
                    <Box className="max-w-sm md:max-w-md sli" sx={{ textAlignLast:"center"}}><Typography className="rubik-h" sx={{fontSize:"40px"}}>Get Started Today!</Typography>
                    <Typography className="rubik-b" variant="body" sx={{fontSize:" 22px"}}>Sign up now for free and take control of your bills. Experience hassle-free payments and manage your expenses effortlessly!</Typography></Box>
                </div></Box>
        </Carousel>
        <div className="absolute w-full flex justify-center mx-auto bottom-16 z-10">
        <Button sx={{fontSize:"20px",textTransform: 'none'}} endIcon={<ArrowForwardTwoToneIcon/>} className="mx-auto" variant='contained' href="http://localhost:3000/signup">Sign up</Button></div>
        </div>
        <div className='flex flex-col'>

        <h1 className='mx-auto rubik-h mb-6' style={{fontSize:"30px"}}>OUR SERVICES</h1>

        {/* list of  our services */}
 <Stack direction={"column"}  justifyContent={"center"} alignItems={"center"} className='md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-x-8 gap-y-9' >


 <FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
    <SpeakerPhoneTwoToneIcon sx={{height:"40px",width:"40px"}} />
    <div><h2 className='rubik-h text-center' style={{fontSize:"25px"}}>Buy Airtime</h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Recharge your mobile phone effortlessly with our quick airtime purchase feature. Enjoy instant top-ups and special promotions for frequent users!</p> </div>
</div></FadeOutComponent> 

<FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
    
<CardGiftcardIcon sx={{height:"40px",width:"40px"}} />
<h2 className='rubik-h text-center' style={{fontSize:"25px"}}>Purchase Gift cards</h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Effortlessly gift your loved ones with our Gift Card Purchase  service! Choose from a wide selection of popular retailers and brands.</p> 
</div></FadeOutComponent> 


<FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
    
<LanguageIcon sx={{height:"40px",width:"40px"}} />
<h2 className='rubik-h text-center' style={{fontSize:"25px"}}> Purchase data</h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Stay connected without interruption by paying your internet bill easily. Experience hassle-free payments and keep your service active!</p> 
</div>
</FadeOutComponent>

<FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
    
<TungstenIcon sx={{height:"40px",width:"40px"}} />
<h2 className='rubik-h text-center' style={{fontSize:"25px"}}>Pay Electricity Bills</h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Quickly settle your electricity bills online with secure transactions and instant confirmations. Stay on top of your payments and avoid late fees!</p> 
</div>
</FadeOutComponent> 

<FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
    
<ConnectedTvIcon sx={{height:"40px",width:"40px"}} />
<h2 className='rubik-h text-center' style={{fontSize:"25px"}}>Pay for Cable Tv  </h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Enjoy uninterrupted entertainment by paying your cable TV bill with ease. Set up reminders for due dates and manage your subscriptions seamlessly!
</p> 
</div>
</FadeOutComponent> 

<FadeOutComponent><div className='flex justify-center justify-self-center  items-center flex-col mx-auto rubik-h  border-1 p-3 rounded-lg ml-2 mr-2 ' style={{fontSize:"25px",backgroundColor:"whitesmoke"}}>
<SchoolIcon sx={{height:"40px",width:"40px"}} />
<h2 className='rubik-h text-center' style={{fontSize:"25px"}}>Pay School fees  </h2>
  <p className=' rubik-l p-2 text-center' style={{fontSize:"17px",textAlignLast:"center"}}>Enjoy uninterrupted entertainment by paying your school fees with ease. Set up reminders for due dates and manage your subscriptions seamlessly!
</p> 
</div></FadeOutComponent> 
</Stack>
        </div>

<h1 className='mx-auto rubik-h mb-6 text-center border-t-2 p-3 mt-4' style={{fontSize:"30px"}}>How it works</h1>
<div className="flex flex-col md:grid md:grid-cols-2 gap-12  justify-center items-center">
    <div style={{maxWidth:"390px"}} className=' flex flex-col md:justify-self-center mx-auto justify-center items-center ml-2 mr-2 p-2 '>
      <WalletOutlinedIcon color={""} sx={{height:"40px",width:"40px"}} />
        <h2 className="rubik-h  text-black  text-center" style={{fontSize:'25px'}}>Fund & Enjoy</h2>
    <p className=' rubik-l p-2 text-center' style={{fontSize:"20px",textAlignLast:"center"}}>Add money through our various channels provided for you and start enjoying </p></div>
    <div style={{maxWidth:"390px"}} className=' md:justify-self-center flex flex-col justify-center mx-auto items-center ml-2 mr-2 p-2 '>
      <TipsAndUpdatesOutlinedIcon sx={{height:"40px",width:"40px"}}/>
        <h2 className="rubik-h text-black text-center" style={{fontSize:'25px'}}>Stay put</h2>
    <p className=' rubik-l p-2 text-center' style={{fontSize:"20px",textAlignLast:"center"}}>Watch out for incredible offers from time to time </p></div>
</div>


<div className='p-5 pt-8 ml-1 mr-1 md:grid md:grid-cols-4 flex justify-center justify-self-start items-center gap-12 flex-col text-white bg-black mt-9  rounded-t-lg'>
    <div className="rubik-b text-center" style={{textAlignLast:"center",maxWidth:"400px"}}>ZonaPay is a leading bill payment solution in nigeria for quick and clear bill  payments just try us and confirm the seamless nature of our solution</div>
    <div className='flex flex-col'>
      <h3 className='rubik-h text-center'style={{fontSize:"17px"}}>Company</h3>
      <Button className="text-center">About us</Button>
      < Button className="text-center"> privacy policy</ Button>
      < Button className="text-center">Terms of use</ Button>
      < Button className="text-center">Contact us</ Button>
    </div>
    <div className='flex flex-col'>
      <h3 className='rubik-h text-center 'style={{fontSize:"17px"}}>Get in touch</h3>
      < Button className="text-center" sx={{textTransform:"none"}}>+2348166041953</ Button>
      < Button href="mailto:arize1524@gmail.com" className="text-center" sx={{textTransform:"none"}}>Email us</ Button>
    </div>
    <div className='flex flex-col '>
      <h3 className='rubik-h text-center'style={{fontSize:"17px"}}>Social media</h3>
 <a href={"https://www.instagram.com/gift.igwebuike.37?igsh=MWt4bW93Zm15eTg3OA=="}>
   {<Button  startIcon={<InstagramIcon />} variant="text" sx={{textTransform:"none"}}className="text-center">Instagram</Button>}
   </a>

     <a href={"https://x.com/Zona_it_is?t=HDE0ckMLkV-DJgGBrfQJQA&s=09"}> 
     {<Button startIcon={<XIcon />} sx={{textTransform:"none"}} variant="text" className="text-center">Twitter</Button>}
     </a>
      </div>
      <div className="mx-auto font-bold md:col-span-4">&copy;2024 Zona enterprise</div>
</div>

   </> )
}
export default Dash