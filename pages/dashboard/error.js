import {Button,Link} from "@mui/material"
import {Cancel,ArrowBack} from "@mui/icons-material"

 const Error = ()=>{
    return(<>
    <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
    <div className="flex flex-col gap-8 justify-center items-center">
    <Cancel sx={{color:"red",height:"130px",width:"130px"}}/>
      <div className=" rubik-h">An error occured</div>
      <Link href={"/dashboard"} className="rubik-b mt-8">{<Button className="bg-blue-600" startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none"}}>Home</Button>}</Link>
        </div>
</div>
    </>)
}
export default Error;