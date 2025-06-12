import {Button,Paper} from "@mui/material"
import { useEffect, useRef } from "react"
const Admin =({result})=>{
  const data=useRef("")
  const btn=useRef("")

  useEffect(()=>{
btn.current.onclick= async(e)=>{
  if(data.current.value=""){
    return;
  }
const res=await fetch("https://www.billsly.co/sendNote",{method:"Post",body:JSON.stringify({val:data.current.value}),headers:{
  "Content-Type":'application/json'
}})
if(res.ok){
  btn.current.value="sent"
  console.log("send success")
}
else{
  btn.current.value="not sent"
  console.log("send failure")
}
}
  })
return(<>
<div style={{backgroundColor:"whitesmoke",height:"100vh"}} className="h-full w-full flex flex-col justify-center">
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
<div className="bg-white border-r-2 border-l-2 rounded p-5">
<input ref={data}  typeof="textArea"/>
<button typeof="button" className="rounded-md bg-blue-600">send</button>
</div>
</div>
</>)
}
export async function getServerSideProps(context){
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
}
}


export default Admin