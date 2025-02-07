import {Button} from "@mui/material"
import {Cancel,ArrowBack} from "@mui/icons-material"

 const Error=()=>{
    return(<>
    <div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
    <div className="flex flex-col gap-8 justify-center items-center">
    <Cancel sx={{color:"red",height:"130px",width:"130px"}}/>
      <div className="">Something went wrong {" "+" "+details.error}</div>
      <Link href={"/dashboard"} className="rubik-b mt-8">{<Button startIcon={<ArrowBack/> } variant="contained" sx={{textTransform:"none",backgroundColor:"#1E3A5F"}}>Home</Button>}</Link>
        </div>
</div>
    </>)
}
export default Error;