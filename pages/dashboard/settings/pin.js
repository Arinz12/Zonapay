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
      setMessage("Pin not accepted");
      setPin(["", "", "", ""]);
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
      <div style={{ height: "100lvh", width: "100vw" }} className="flex flex-row items-center justify-center">
        <div className="flex flex-col gap-8 justify-center items-center w-full">
          <div className="flex flex-col gap-2 items-center justify-center">
            <CheckCircle className="scale" sx={{ color: "green", height: "130px", width: "130px" }} />
            <div style={{ fontSize: "25px" }} className="text-black rubik-b">Pin successfully set</div>
          </div>
          <Link href="/dashboard" className="rubik-b mt-8">
            <Button className="bg-blue-600" startIcon={<ArrowBack />} variant="contained" sx={{ textTransform: "none" }}>Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head />
      <div className="mx-auto flex flex-col gap-6 justify-center items-start h-full">
        <div onClick={() => router.back()} className="absolute left-1 p-3 top-1 inline-block">
          <ArrowBackIosRounded sx={{ color: "black" }} />
        </div>
        <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col gap-3 justify-center items-start h-full" autoComplete="off">
          <div className="text-5xl mt-8 mb-10 mx-auto text-center rubik-h">Create Pin</div>

          <div className="mx-auto rubik-b w-full text-center">
            <label className="rubik-b">Enter Pin</label><br />
            <div className="flex justify-center gap-4 mt-2">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  type="password"
                  maxLength="1"
                  inputMode="numeric"
                  value={digit}
                  ref={pinRefs[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value, setPin, pinRefs)}
                  onKeyDown={(e) => handleKeyDown(idx, e, setPin, pinRefs, pin)}
                  className="w-12 h-12 text-center border-2 rounded-md border-black focus:outline-none text-2xl"
                />
              ))}
            </div>
          </div>

          <div className="mx-auto rubik-b w-full text-center mt-11">
            <label className="rubik-b">Re-enter Pin</label><br />
            <div className={`flex justify-center gap-4 mt-2 transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
              {confirmPin.map((digit, idx) => (
                <input
                  key={idx}
                  type="password"
                  maxLength="1"
                  inputMode="numeric"
                  value={digit}
                  ref={confirmRefs[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value, setConfirmPin, confirmRefs)}
                  onKeyDown={(e) => handleKeyDown(idx, e, setConfirmPin, confirmRefs, confirmPin)}
                  className={`w-12 h-12 text-center border-2 rounded-md ${error ? 'border-red-500 text-red-600' : 'border-black'} focus:outline-none text-2xl`}
                />
              ))}
            </div>
          </div>

          <span className="text-red-600 rubik-l mx-auto mt-2" id="message">{message}</span>

          <div className="absolute w-full flex bottom-0 mx-auto justify-center text-center">
            <Button endIcon={<ArrowForward />} className="p-5 w-full rounded-full bg-blue-600" variant="contained" type="submit">Continue</Button>
          </div>
        </form>
      </div>

      {/* Shake Animation CSS */}
      <style jsx>{`
        .animate-shake {
          animation: shake 0.4s;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
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

export default Pin
