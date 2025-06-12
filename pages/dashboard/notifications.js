const Note=({sodObj})=>{
    return (<>
    <div className="mx-auto mt-2 w-full text-center">Notifications </div>
    {
        sodObj.map((a)=>(
            <div style={{width:"90%"}} className="p-2 rounded mb-3 rubik-b">{a.value}</div>
        ))
    }
    </>)
}
export default Note
export async function getServerSideProps(context){
try{
if(!context.req.isAuthenticated()){
return {
    redirect:{
        destination:"/login",
    permanent:false
},}
}
else{
    const {Note}=require("../../Svr_fns/Note")
const res= await Note.find();
if(!res){
    return{
        props:{obj:0}
    }
}
const obj= res[0].Notes

const sodObj = [...obj].sort((a, b) => {
    const timeA = new Date(a.time)
    const timeB = new Date(b.time)
    return timeA - timeB;
  });
return{
    props:{sodObj}
}
}
}catch(e){
console.log("notification failed to load")
}finally{
    console.log("notification loaded")
}
}