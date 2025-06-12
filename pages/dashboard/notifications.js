const Note=()=>{
    return (<>
    <div className="mx-auto mt-2">Notifications will appear here</div>
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
}catch(e){

}finally{
    console.log("notification loaded")
}
}