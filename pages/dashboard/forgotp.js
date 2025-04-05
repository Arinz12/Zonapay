import router from "next/router";
import { useEffect } from "react";

const Forgotp=()=>{
useEffect(()=>{
    document.getElementById("proceed").addEventListener("click", async (e)=>{
const resp= await fetch("https://zonapay.onrender.com/zonapay/ValEmail",{method:"post",body:JSON.stringify({val:document.getElementById("email").value.trim()})});
if(resp.ok){
    document.getElementById("msg").style.display="block"
    setTimeout(()=>{document.getElementById("msg").style.display="none"
},4000)
}
else{
    await fetch("https://zonapay.onrender.com/change",{method:"post",body:JSON.stringify({email:document.getElementById("email").value
    .trim()})})
    router.push("/forgotPass");
}
    })
})

return(<>
<div style={{height:"100vh"}} className="w-full h-full flex flex-col items-center justify-center bg-white">
<div className="h-4/6" style={{backgroundColor:"whitesmoke"}}>
    <div id="msg" className="fixed top-1 left-1 rounded-md bg-yellow-200 hidden text-black">Email does not exist in our database</div>
    <label className="rubik-h">Enter your registered Email</label>
    <input id='email' placeholder="email" className="w-11/12 h-11 border-l-0 border-r-0 border-t-0 my-6 border-b-2 rounded-lg bg-white rubik-b"/>
    <div id="proceed"  className="w-full flex flex-row justify-center items-center"><button className="p-4 rounded-xl bg-blue-600 rubik-b">Continue</button></div></div>
</div>
</>
)
}
export default Forgotp;