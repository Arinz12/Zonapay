import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Forgot = () => {
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.getElementById("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        otp: document.getElementById("otp").value.trim(),
        newpass: document.getElementById("newpass").value.trim(),
        email: document.getElementById("email").value.trim()
      };

      const resp = await fetch("https://zonapay.onrender.com/change2", {
        method: "post",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
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
            <h1 className="text-3xl font-bold text-gray-800">Password Reset Successful</h1>
            <p className="text-gray-600">Your new password has been set successfully</p>
          </div>
          <Link href="/dashboard" className="w-full max-w-xs">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{
                backgroundColor: "#1E3A5F",
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
      {/* Header */}
      <div className="bg-blue-600 text-white text-xl font-bold text-center px-6 py-5 rounded-b-2xl shadow-md sticky top-0 z-10">
        Password Reset
      </div>

      {/* Notification */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-lg mx-auto mt-6 max-w-md">
        <p className="text-sm text-center">
          An OTP has been sent to your email. Enter the OTP and your new password.
        </p>
      </div>

      {/* Form */}
      <form 
        id="form"
        className="bg-white p-6 rounded-xl shadow-md space-y-6 max-w-md mx-auto mt-6"
        method="post"
      >
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            readOnly
            value={router.query.auth ? router.query.data : null}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

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
          <label htmlFor="newpass" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newpass"
            name="newpass"
            type="text"
            placeholder="Enter new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#1E3A5F",
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
      </form>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (context.req.isAuthenticated()) {
    await fetch("https://zonapay.onrender.com/change", {
      method: "post",
      body: JSON.stringify({ email: context.req.user.Email }),
      headers: { "Content-Type": "application/json" }
    });
  } else {
    await fetch("https://zonapay.onrender.com/change", {
      method: "post",
      body: JSON.stringify({ email: context.req.query.data }),
      headers: { "Content-Type": "application/json" }
    });
  }
  return {
    props: {}
  };
}

export default Forgot;