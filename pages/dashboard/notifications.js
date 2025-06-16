import { ArrowBack } from "@mui/icons-material"
import Head from "next/head"

const Note=({sodObj})=>{
    return (<>
    <Head>
        <title>Notifications</title>
    </Head>
<div className="flex sticky top-0 items-center gap-4 p-5 border-b border-gray-200">
          <button 
            className="flex items-center justify-center p-1 text-blue-600" 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowBack color="primary" />
          </button>
          <div className="text-xl font-semibold">Notifications</div>
        </div> 
        {
  sodObj?.length > 0 ? (
    <div className="flex flex-col gap-3 max-w-md mx-auto px-4 w-full">
      {sodObj.map((notification, index) => (
        <div
          key={index}
          className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500 
                    transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                    text-gray-800 font-medium text-center"
        >
          {notification.value}
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg max-w-md mx-auto 
                   text-gray-500 font-light my-4">
      There are no notifications yet
    </div>
  )
}
    </>)
}
export default Note
export async function getServerSideProps(context){
    const {Note}=require("../../Svr_fns/Note")
try{
if(!context.req.isAuthenticated()){
return {
    redirect:{
        destination:"/login",
    permanent:false
},}
}
else{
const res= await Note.find();
if(res.length==0){
    return{
        props:{sodObj:0}
    }
}
const obj= res[0].Notes

const sodObj = [...obj].sort((a, b) => {
    const timeA = new Date(a.time)
    const timeB = new Date(b.time)
    return timeA - timeB;
  });
return {
    props:{sodObj}
}
}
}
catch(e){
console.log("notification failed to load")
}
finally{
    console.log("Notification page Settled")
}
}