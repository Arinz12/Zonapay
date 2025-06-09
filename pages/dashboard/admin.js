import {Button,Paper} from "@mui/material"
const Admin =({result})=>{
return(<>
<div style={{backgroundColor:"whitesmoke",height:"100vh"}} className="h-full flex flex-col justify-center">
<div className="bg-white p-5 rounded-lg w-4/5 mx-auto h-3/6 flex flex-row justify-between items-center gap-1">
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
    const resp= await fetch("https://www.billsly.co/balances",{method:"POST",headers:{"Content-Type":"application/json"}})
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