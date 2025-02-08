import { Button } from "@mui/material";
import React, { useState } from "react";
const NumericPad = ({ maxLength = 4, onSubmit }) => {
  const [pin, setPin] = useState("");

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === "clear") {
      setPin("");
    } else if (value === "delete") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => (prev.length < maxLength ? prev + value : prev));
    }
  };

  // Handle submit action
  const handleSubmit = () => {
    if (onSubmit) onSubmit(pin);
    console.log("PIN Submitted:", pin);
  };
  return (<div id="keyPad" style={{backgroundColor:"rgba(0, 0, 0, 0.253)",backdropFilter:"blur(9px)"}} className=" flex-col items-center mt-10 fixed  z-10 w-full bottom-0 h-full pt-36 shp hidden ">

      <span onClick={()=>{document.getElementById("keyPad").style.display="none"}} className="absolute text-black text-4xl top-1 right-3">&times;</span>
      {/* PIN Input */}
      <input
        type="password"
        value={pin}
        readOnly
        maxLength={maxLength}
        placeholder="Enter PIN"
        className="w-48 text-center text-2xl  rounded-full py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Numeric Pad */}
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "delete"].map((item) => (
          <Button
          style={{borderRadius:"50%"}}
            key={item}
            onClick={() => handleButtonClick(item.toString())}
            className={`w-12 h-12 keypad text-xl  shadow-md
              ${
                item === "clear"
                  ? "bg-none text-black hover:bg-none"
                  : item === "delete"
                  ? "bg-none text-black hover:bg-none"
                  : "bg-none text-black hover:bg-none"
              }`}
          >
            {item === "clear" ? "C" : item === "delete" ? "⌫" : item}
          </Button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 text-xl text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600"
      >
        Proceed
      </button>
    </div>
  );
};

export default NumericPad;
