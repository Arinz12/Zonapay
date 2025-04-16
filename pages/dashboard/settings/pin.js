import { ArrowBackIosRounded, ArrowBack, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import router from "next/router";

const Pin = () => {
  const [set, setSet] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1: Create PIN, 2: Confirm PIN

  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePinChange = (index, value, setFunc, refs) => {
    if (!/^\d?$/.test(value)) return;
    setFunc(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    if (value && index < 3) refs[index + 1].current.focus();
  };

  const handleKeyDown = (index, e, setFunc, refs, values) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p1 = pin.join("");
    const p2 = confirmPin.join("");
    const valid = /^\d{4}$/;

    if (p1 !== p2 || !valid.test(p1) || !valid.test(p2)) {
      setError(true);
      setMessage("PINs don't match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      confirmRefs[0].current.focus();
      setTimeout(() => {
        setError(false);
        setMessage("");
      }, 4000);
      return;
    }

    const data = { pin: p1 };
    try {
      const resdata = await fetch("https://zonapay.onrender.com/zonapay/setpin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (resdata.ok) {
        setSet(true);
      }
    } catch (e) {
      console.log("An error occurred. Check connectivity.");
    }
  };

  if (set) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="flex flex-col items-center gap-6 max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle sx={{ color: "#10B981", height: 100, width: 100 }} />
            <h1 className="text-3xl font-bold text-gray-800">PIN Successfully Set</h1>
            <p className="text-gray-600">Your security PIN is now active</p>
          </div>
          <Link href="/dashboard" className="w-full max-w-xs">
            <Button
              fullWidth
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{
                textTransform: "none",
                backgroundColor: "#1E3A5F",
                py: 1.5,
                borderRadius: "12px",
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
    <>
      <Head>
        <title>Create Security PIN</title>
      </Head>
      <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col">
        <button 
          onClick={() => router.back()}
          className="self-start p-2 rounded-full hover:bg-blue-100 transition-colors"
        >
          <ArrowBackIosRounded sx={{ color: "#1E3A5F" }} />
        </button>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-xs">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              {activeStep === 1 ? "Create Security PIN" : "Confirm Your PIN"}
            </h1>
            <p className="text-gray-600 text-center mb-8">
              {activeStep === 1 
                ? "Enter a 4-digit PIN for secure transactions"
                : "Re-enter your PIN to confirm"}
            </p>

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2].map((step) => (
                <div 
                  key={step}
                  className={`h-2 rounded-full ${activeStep === step ? "bg-blue-600 w-6" : "bg-gray-300 w-2"} transition-all duration-300`}
                />
              ))}
            </div>

            {/* PIN Inputs */}
            <div className="mb-8">
              <div className={`flex justify-center gap-4 ${error ? 'animate-shake' : ''}`}>
                {(activeStep === 1 ? pin : confirmPin).map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength="1"
                    inputMode="numeric"
                    value={digit}
                    ref={activeStep === 1 ? pinRefs[idx] : confirmRefs[idx]}
                    onChange={(e) => handlePinChange(
                      idx, 
                      e.target.value, 
                      activeStep === 1 ? setPin : setConfirmPin,
                      activeStep === 1 ? pinRefs : confirmRefs
                    )}
                    onKeyDown={(e) => handleKeyDown(
                      idx, 
                      e, 
                      activeStep === 1 ? setPin : setConfirmPin,
                      activeStep === 1 ? pinRefs : confirmRefs,
                      activeStep === 1 ? pin : confirmPin
                    )}
                    className={`w-14 h-14 text-center border-2 rounded-lg focus:outline-none text-3xl font-medium ${
                      error 
                        ? 'border-red-400 bg-red-50 text-red-600' 
                        : 'border-blue-200 focus:border-blue-500 text-gray-800'
                    } transition-colors`}
                  />
                ))}
              </div>
              {message && (
                <p className="text-red-500 text-center mt-3 text-sm">{message}</p>
              )}
            </div>

            {/* Continue Button */}
            <Button
              type={activeStep === 2 ? "submit" : "button"}
              fullWidth
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={
                activeStep === 1 
                  ? pin.join("").length !== 4 
                  : confirmPin.join("").length !== 4
              }
              onClick={() => {
                if (activeStep === 1 && pin.join("").length === 4) {
                  setActiveStep(2);
                  setTimeout(() => confirmRefs[0].current.focus(), 100);
                }
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#1E3A5F",
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#152A4A"
                },
                "&:disabled": {
                  backgroundColor: "#E5E7EB",
                  color: "#9CA3AF"
                }
              }}
            >
              {activeStep === 1 ? "Continue" : "Set PIN"}
            </Button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!context.req.isAuthenticated()) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default Pin;