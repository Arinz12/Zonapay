import "@fontsource/roboto"
import { Paper } from "@mui/material"
import Head from "next/head"
import { useEffect } from "react"
const History=({userhistory})=>{

useEffect(()=>{
document.getElementById("hiscon").lastChild.style.marginBottom="100px";
},[])
    return(<>
<Head>
   <title>History </title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"></link>
  </Head>
   <Paper sx={{fontSize:"30px"}} elevation={12} className="mt-0 pt-7 w-full mx-auto rounded-2xl text-center bg-blue-600 text-white rounded-b-2xl rubik-h px-4">History</Paper>
{(userhistory.dataa.length!==0)? <div id='hiscon' className="p-6 bg-white max-w-3xl mx-auto rubik-b">
  {userhistory.dataa.map((a, index) => (
   <div className="flex justify-between items-start p-3 border-b border-gray-200 mx-auto w-11/12 font-sans">
   
   <div className="text-left">
     <div className="font-medium text-gray-900">{a.Product.slice(0,10)}</div>
     <div className="text-xs text-gray-500 mt-1">{a.Time}</div>
   </div>
   
   
   <div className="text-right">
     <div className="font-medium text-gray-900">{a.Amount}</div>
     <div className={`text-xs px-2 py-0.5 rounded-full ${(a.Status!==success)? "bg-red-100" :"bg-green-100"}  
     ${(a.Status=="success")? "text-green-800": "text-red-600"} inline-block mt-1`}>{a.Status}</div>
   </div>
 </div>
  ))}
</div>:<div className="p-6 max-w-3xl mx-auto text-center w-full monomaniac-one-regular">There is no history at the moment</div>}
    </>)
}
export async function getServerSideProps(context){
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