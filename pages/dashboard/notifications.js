import { ArrowBack } from "@mui/icons-material"

const Note=({sodObj})=>{
    return (<>
<div className="flex sticky top-0 items-center gap-4 p-5 border-b border-gray-200">
          <button 
            className="flex items-center justify-center p-1 text-blue-600" 
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <ArrowBack color="primary" />
          </button>
          <div className="text-xl font-semibold">Notification</div>
        </div> 
         {(sodObj)?
        sodObj.map((a)=>(
            <div style={{width:"90%"}} className="p-2 rounded mb-3 rubik-b">{a.value}</div>
        )) : <div className="rubik-l mx-auto text-center my-2">There are no notifications yet</div>
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