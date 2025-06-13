import { ArrowBack } from "@mui/icons-material"
import {Button,Paper} from "@mui/material"
import { useEffect, useRef, useState } from "react"
const Admin =({result})=>{
  const [data,setData]= useState("Default text")
  const btn=useRef(null)
  useEffect(()=>{
const send= async(e)=>{
  if(data.current.value=""){
    return;
  }
  btn.current.textContent="sending..."
const res=await fetch("https://www.billsly.co/sendNote",{method:"Post",body:JSON.stringify({val:data}),headers:{
  "Content-Type":'application/json'
}})
if(res.ok){
  btn.current.textContent="sent"
  console.log("send success")
}
else{
  btn.current.textContent="not sent"
  console.log("send failure")
}

}
if (btn.current) {
  btn.current.addEventListener('click', send);
}return ()=>{
  if(btn.current){
    btn.current.removeEventListener("click",send)
  }
}
  },[data])
return(<>
<div style={{backgroundColor:"whitesmoke",height:"100vh"}} className="h-full w-full flex flex-col justify-center">

<div className="flex sticky top-0 items-center gap-4 p-5 border-b border-gray-200">
          <button 
            className="flex items-center justify-center p-1 text-blue-600" 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowBack color="primary" />
          </button>
          <div className="text-xl font-semibold">Admin</div>
        </div> 

<div className="bg-white p-5 rounded-lg w-w-full mx-auto h-3/6 flex flex-row justify-between items-center gap-1">
<div className="rubik-h ml-1">
    <span className="mb-3">ClientBalance</span><br/>
    <span>{result.client_total}</span>
</div>
<div className="rubik-h ml-1">
    <span className="mb-3">MYBalance</span><br/>
    <span>{result.my_total}</span>
</div>
<div className="rubik-h ml-1">
    <span className="mb-3">Notsettled</span><br/>
    <span>{result.Notsettled}</span>
</div>
</div>
{/* Notify users through email and update their notifications*/}
<div className=" flex-col items-center w-full justify-center gap-3 bg-white border-r-2 border-l-2 border-blue-600 rounded p-5">
<div className="text-center"><textarea onKeyUp={(e)=>{setData(e.target.value)}}   className="border-2 border-blue-600"  rows={5} placeholder="write notification here"/></div>
<div className="text-center"><button ref={btn} typeof="button" className="rounded-md bg-blue-600">send</button></div>
</div>
</div>
</>)
}
export async function getServerSideProps(context){
  try{
if(!context.req.isAuthenticated){
    return {
        redirect: {
          destination: '/login',  // URL to redirect to
          permanent: false,       // Set to true for 301 redirect, false for 302 (default)
        },
      };
}
else if(!context.req.user.Admin){
    return {
        redirect: {
          destination: '/dashboard',  // URL to redirect to
          permanent: false,       // Set to true for 301 redirect, false for 302 (default)
        },
      };
}
else{
    const resp= await fetch("https://www.billsly.co/api/balances",{method:"POST",headers:{"Content-Type":"application/json"}})
    if(resp.ok){
const result= await resp.json();
return {
    props:{result}
}
    }
    else{
        return {
            redirect: {
              destination: '/error',  // URL to redirect to
              permanent: false,       // Set to true for 301 redirect, false for 302 (default)
            },
          };
    }
}}
catch(e){
  console.log("This is wrong",e)
}
finally{
  console.log("Admin page has been settled")
}
}


export default Admin