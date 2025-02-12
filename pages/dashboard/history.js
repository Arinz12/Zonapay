import "@fontsource/roboto"
import { Paper } from "@mui/material"
import Head from "next/head"
const History=({userhistory})=>{


    return(<>
<Head>
   <title>History </title></Head>
   <Paper sx={{fontSize:"30px"}} elevation={12} className="mt-4 w-11/12 mx-auto rounded-2xl text-center rubik-h p-4">History</Paper>
{(userhistory.dataa.length!==0)? <div className="p-6 max-w-3xl mx-auto rubik-b">
  {userhistory.dataa.map((a, index) => (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md mb-6 sm:mb-4 lg:mb-8" key={index}>
      <div className="mb-2 monomaniac-one-regular">
        <span className=" text-gray-700 ">Transaction ID:</span> {a.TransactionId}
      </div>
      <div className="mb-2 monomaniac-one-regular">
        <span className=" text-gray-700 ">Product:</span> {a.Product}
      </div>
      <div className="mb-2 monomaniac-one-regular">
        <span className=" text-gray-700">Recipient:</span> {a.Phoneno}
      </div>
      <div className="mb-2 text-green-700 monomaniac-one-regular">
        <span className=" text-gray-800 ">Amount:</span> {a.Amount}
      </div>
      <div className="mb-2 monomaniac-one-regular">
        <span className=" text-gray-700">Time:</span> {a.Time}
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