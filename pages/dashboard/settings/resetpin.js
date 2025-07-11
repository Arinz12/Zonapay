import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";

const ForgotPin = () => {
  const [done, setDone] = useState(false);
  
  useEffect(() => {
    document.getElementById("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        otp: document.getElementById("otp").value.trim(),
        newpin: document.getElementById("newpin").value.trim()
      };
      const resp = await fetch("https://www.billsly.co/change2", {
        method: "post",
        body: JSON.stringify(data), 
        headers: {"Content-Type": "application/json"}
      });
      if (resp.ok) {
        setDone(true);
      } else {
        router.push("/dashboard/error");
      }
    });
  }, []);

  if (done) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center gap-8 max-w-md w-full p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle sx={{ color: "#10B981", fontSize: 100 }} />
            <h1 className="text-3xl font-bold text-gray-800">PIN Reset Successful</h1>
            <p className="text-gray-600">Your new PIN has been set successfully</p>
          </div>
          <Link href="/dashboard" className="w-full max-w-xs">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{
                backgroundColor: "#2563EB",
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#152A4A"
                }
              }}
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">
        
        
        <div style={{fontSize:"23px"}} className="rubik-h w-full text-white bg-blue-600 px-4 py-4 flex flex-row justify-start gap-4 items-center rounded-b-3xl  mb-8">

        <div onClick={()=>{router.back()}} style={{}}className="p-2 flex flex-row items-center justify-center"><ArrowBack sx={{color:"white"}} className="" /> </div>
          <div>Pin Reset</div>
          
          </div>

        {/* Notification */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-lg mb-8 shadow-sm">
          <p className="text-sm">
            An OTP has been sent to your email. Enter the OTP and your new PIN.
          </p>
        </div>

        {/* Form */}
        <form 
          id="form"
          className="bg-white p-6 rounded-xl shadow-md space-y-6"
          method="post"
        >
          <div className="space-y-1">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="newpin" className="block text-sm font-medium text-gray-700">
              New PIN
            </label>
            <input
              id="newpin"
              name="newpin"
              type="text"
              placeholder="Enter new PIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <Button className="bg-blue-600"
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#152A4A"
              }
            }}
          >
            Continue
          </Button>
          <Button
        onClick={()=>{router.reload()}
      }
        className="mt-4" 
          type="button"
          fullWidth
          variant="text"
          sx={{py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#152A4A"
            }
          }}
        >
          Resend code
        </Button>
        </form>
      </div>
    
  );
};

export async function getServerSideProps(context) {
  if (!context.req.isAuthenticated()) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }
  
  await fetch("https://www.billsly.co/change", {
    method: "post",
    body: JSON.stringify({ email: context.req.user.Email }),
    headers: {"Content-Type": "application/json"}
  });
  
  return {
    props: {}
  };
}

export default ForgotPin;