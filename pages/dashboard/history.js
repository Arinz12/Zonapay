import "@fontsource/roboto"
import { Paper } from "@mui/material"
import Head from "next/head"
import { useEffect } from "react"
import Footer from '../../components/Footer';

const History=({userhistory})=>{
useEffect(()=>{
document.getElementById("hiscon").lastChild.style.marginBottom="100px";
},[])
    return(<div className="relative min-h-screen">
<Head>
   <title>History </title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"></link>
  </Head>
   <div style={{fontSize:"30px"}}  className="  mt-0 py-7 w-full mx-auto  text-center bg-blue-600 text-white rounded-b-2xl rubik-h px-4">History</div>
{(userhistory.dataa.length!==0)? <div   id='hiscon' className="p-6 bg-white w-full gap-1 mx-auto rubik-b">
  {userhistory.dataa.map((a, index) => (
   <div style={{backgroundColor:"whitesmoke"}} className="rubik-b  flex  justify-between rounded items-start p-3 border-b mx-auto w-full font-sans">
   
   <div className="text-left">
     <div className="font-medium text-gray-900">{a.Product.slice(0,30)}</div>
     <div className="text-xs text-gray-500 mt-1">{a.Time}</div>
     <div className="text-xs text-gray-500 mt-1">{a.Phoneno}</div>

   </div>
   <div className="text-right">
     <div className="font-medium text-gray-900">{a.Amount}</div>
     <div className={`text-xs px-2 py-0.5 rounded-full ${(a.Status=="failed")? "bg-red-100" :"bg-green-100"}  
     ${(a.Status=="failed")?  "text-red-600":"text-green-800" } inline-block mt-1`}>{a.Status||"success"}</div>
   </div>
 </div>
  ))}
</div>:<div className="p-6 max-w-3xl mx-auto text-center w-full monomaniac-one-regular">There is no history at the moment</div>}
<div className="sticky bottom-0"><Footer/></div>
    </div>)
}
export async function getServerSideProps(context){
  if(!context.req.isAuthenticated()){
    return {
      redirect:{
        destination:"/login",
        permanent:false,
      }
    }
  }
    try{
const data= await fetch("https://zonapay.onrender.com/api/history",{method:"post"})
   if(data.ok){
    const data1= await  data.json()
    const data2a=data1.data.sort((a, b) => new Date(b.Time) - new Date(a.Time));
    const data2=data2a.filter(a=> a.User===context.req.user.Email)
    return{
        props:{userhistory:{dataa:data2}}
    }
   } 
   else{
      return{
        props:{userhistory:{dataa:[]}}
    }
    }   
   }

catch(e){
context.res.send("An error occured")
return{
    props:{}
}
}
}
export default History