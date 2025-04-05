import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react"

const ForgotPin=()=>{
const [done,setdone]=useState(false)
useEffect(()=>{
    document.getElementById("form").addEventListener("submit", async (e)=>{
        e.preventDefault();
        const data={otp:document.getElementById("otp").value.trim(),newpin:document.getElementById("newpin").value.trim()}
        const resp= await fetch("https://zonapay.onrender.com/change2",{method:"post",body:JSON.stringify(data), headers:{"Content-Type":"application/json"}});
        if(resp.ok){
setdone(true);
        }
        else{
router.push("/dashboard/error");
        }
    })
})

if(done){
    return(<>
        <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
  <div className="flex flex-col gap-8 justify-center items-center w-full">
    <div className="flex flex-col gap-2 items-center justify-center">
  <CheckCircle sx={{color:"green",height:"130px",width:"130px"}}/>
  <div style={{fontSize:"25px"}} className="text-black rubik-b">Pin reset successfull</div>
  </div>
      <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
      </div>
</div>
        </>)
}

    return(<>
    <div className="h-full w-full flex flex-col justify-start items-center">
        <div style={{fontSize:"25px"}} className="bg-blue-600 rubik-h sticky top-0 w-full text-center mb-12 text-white px-4 py-7 rounded-b-3xl">
            Password Reset
        </div>
        <div style={{fontSize:"13px"}} className="text-center w-3/4 bg-yellow-200 rounded-xl p-5">
An otp has been sent to your email.Enter the otp and your new pin
        </div>
        <form id="form" style={{backgroundColor:"whitesmoke"}} className="flex mt-6 flex-col p-4 rounded-2xl gap-6 w-full"  method="post">
<div><input placeholder="Enter otp" style={{boxShadow:"2px 2px blue"}} id="otp" inputMode="numeric" className="h-11 rounded-md w-full border-0 border-b-2 focus:outline-none border-black text-center mb-3 bg-white" type="text" name="otp" /></div>

<div><input placeholder="Enter new password" style={{boxShadow:"2px 2px blue"}} id="newpin" className="w-full h-11  rounded-md border-0  border-b-2 border-black focus:outline-none text-center mb-3 bg-white" type="text" name="newpin" /></div>
<div className="w-full flex flex-row justify-center items-center"><button className="p-4 rounded-xl text-white bg-blue-600 rubik-b">Continue</button></div>
</form>
    </div>
    </>
    )
}
export default ForgotPin;
export async function getServerSideProps(context){
    if(!context.req.isAuthenticated()){
        return{
            redirect:{
                destination:"/login",
                permanent:false
            }
        }
    }
    await fetch("https://zonapay.onrender.com/change",{method:"post",body:JSON.stringify({email:context.req.user.Email}
        ),headers:{"Content-Type":"application/json"}})
    return {
        props:{}
    }
    }