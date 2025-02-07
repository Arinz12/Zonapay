import { Cancel, CheckCircle } from "@mui/icons-material"
import Head from "next/head";

const Success = ()=>{
    return(<>
    <Head><title>Success</title></Head>
<div style={{height:"100lvh",width:"100vw"}} className="flex  flex-row items-center justify-center">
    <div className="flex flex-col gap-8 justify-center items-center">
    <Cancel sx={{color:"red",height:"130px",width:"130px"}}/>
      <div className="">Something went wrong </div>
        </div>
</div>
    </>
    )
}
export default Success;