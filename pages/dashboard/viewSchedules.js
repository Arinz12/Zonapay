import { useState } from "react";
import { SuccessDeleteComponent } from "../../components/DeletedS";
import { FailedDeleteComponent } from "../../components/FailedDel";
import Schedule from "../../Svr_fns/schedule"
import router from "next/router"
import { AddBox } from "@mui/icons-material";
import {DateTime} from "luxon"
import Link from "next/link"
const View = ({obj}) => {
    const [deleted,setSuccess]=useState(false)
    const [failed,setFailed]=useState(false) 
    const deletedIds=[]  
    const handleCancelSchedule = async (billId) => {
      document.getElementById(billId+"btn").innerHTML="cancelling"
      // Implement your cancellation logic here
      console.log(`Canceling bill with ID: ${billId}`);
  const res= await fetch("https://www.billsly.co/completeSchedule",{method:"post",body:JSON.stringify({id:billId}),headers:{"Content-Type":"application/json"}})
  if(res.ok){
    deletedIds.push(billId+"con");
    document.querySelectorAll("#"+billId+"con").forEach((a)=>{
      if(deletedIds.includes(billId+"con")){
a.style.display="none";
      }
    })
    document.getElementById(billId+"btn").innerHTML="cancelled";
      setSuccess(true)
      console.log("successful")
  }
  else{
    document.getElementById(billId+"btn").innerHTML="cancel schedule"
      setFailed(true)
      console.log("failed")
  }
    };
    return (
      <div className="container mx-auto px-4 py-8">
        <div style={{backgroundColor:"white"}} className="  sticky top-0 text-2xl font-bold mb-6 flex flex-row justify-between items-center" >
        <h1 className="  text-2xl font-bold mb-6">Scheduled Bills</h1>
        <div  className='flex flex-col justify-center items-center '>
                    <Link href={"https://www.billsly.co/dashboard/schedule"}>{<div style={{fontSize:"15px"}} className='rubik-b text-black z-10'>Add schedule</div>}</Link>
 <Link href={"https://www.billsly.co/dashboard/schedule"}>{<AddBox begin={"txn"} sx={{color:"black",fontSize:"30px",zIndex:10}}/>}</Link></div>
        </div>
        
        {obj.length === 0 ? (
          <p className="text-gray-500">No scheduled bills found.</p>
        ) : (
          <div className="space-y-4">
            {obj.map((bill, index) => (
            
              <div id={bill.Idd+"con"} key={index} className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bill</h3>
                    <p className="mt-1 text-sm text-gray-900">{bill.Bill}</p>
                  </div>
                  
                  <div id={bill.Idd}>
                    <h3 className="text-sm font-medium text-gray-500">ID</h3>
                    <p className="mt-1 text-sm text-gray-900">{bill.Idd}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Time</h3>
                    <p className="mt-1 text-sm text-gray-900">{new Date(bill.Time).toLocaleDateString("en-US",{weekday: 'long', year: 'numeric',month: 'long',
  day: 'numeric',hour:"2-digit",minute:"2-digit",second:"2-digit"})}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 text-sm text-gray-900">{bill.Details?.customer || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {bill.Details?.amount ? `${bill.Details.amount.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button id={bill.Idd+"btn"}
                    onClick={() => handleCancelSchedule(bill.Idd)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                  Cancel Schedule
                  </button>

                </div>
              </div>
            )
            )}
          </div>
        )}

        {deleted&& <SuccessDeleteComponent hide={()=>{setSuccess(false)}}/>}
        {failed&& <FailedDeleteComponent hide={()=>{setFailed(false)}}/>}
      </div>
    );
  };
  
  // Example function to handle cancellation
 
  
export default View

export async function getServerSideProps(context){
    if(!context.req.isAuthenticated()){
        return{
            redirect:{
                destination:"/login",
                permanent:false
            }
        }
    }
    else{
        const obj= await Schedule.find({Email:context.req.user.User,Status:"not completed"})
        return {
            props:{obj}
        }
    }
}