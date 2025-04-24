import { Button } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";

const NumericPad = ({ maxLength = 4, onSubmit, hideComp }) => {
  const [pin, setPin] = useState("");
  const inputRefs = useRef([]);

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
  };

  // Focus the appropriate input box when pin changes
  useEffect(() => {
    if (pin.length < maxLength && pin.length >= 0) {
      inputRefs.current[pin.length]?.focus();
    }
  }, [pin, maxLength]);

  return (
    <div 
      id="keyPad" 
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.253)",
        backdropFilter: "blur(9px)"
      }} 
      className="flex-col items-center mt-10 fixed z-10 w-full bottom-0 h-full pt-36 fdn flex"
    >
      <span 
        onClick={() => {
          setPin("");
          hideComp();
        }}
        className="absolute text-black text-4xl top-1 right-3"
      >
        &times;
      </span>

      {/* PIN Input Boxes */}
      <div className="flex gap-3 mb-6">
        {[...Array(maxLength)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="password"
            value={pin[index] || ""}
            readOnly
            maxLength={1}
            className="w-12 h-12 text-center text-2xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            style={{
              border: "1px solid #ddd",
              backgroundColor: "white"
            }}
          />
        ))}
      </div>

      {/* Numeric Pad */}
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "delete"].map((item) => (
          <Button 
            style={{
              borderRadius: "40%",
              width: "48px",
              height: "48px",
              backgroundColor: "white"
            }}
            key={item}
            onClick={() => handleButtonClick(item.toString())}
            className={`w-12 h-12 keypad text-xl shadow-md ${
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
        className="mt-6 px-6 py-2 text-xl text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-600"
      >
        Proceed
      </button>
    </div>
  );
};

export default NumericPad;