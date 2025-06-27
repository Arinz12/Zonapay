import { Button } from "@mui/material";
import React, { useState, useRef, useEffect, useCallback } from "react";

const NumericPad = ({ maxLength = 4, onSubmit, hideComp }) => {
  const [pin, setPin] = useState("");
  const inputRefs = useRef([]);
  const primaryColor = "#2563eb"; // Stored in memory

  // Memoized button click handler
  const handleButtonClick = useCallback((value) => {
    if (value === "clear") {
      setPin("");
    } else if (value === "delete") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => (prev.length < maxLength ? prev + value : prev));
    }
  }, [maxLength]);

  // Memoized submit handler
  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit(pin);
  }, [onSubmit, pin]);

  // Focus management
  useEffect(() => {
    if (pin.length < maxLength && pin.length >= 0) {
      inputRefs.current[pin.length]?.focus();
    }
  }, [pin, maxLength]);

  return (
    <div 
      id="keyPad" 
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease-out"
      }} 
      className="flex flex-col items-center fixed z-10 w-full h-full bottom-0 pt-28 px-4"
    >
      <span 
        onClick={() => {
          setPin("");
          hideComp();
        }}
        className="absolute text-white text-3xl top-4 right-6 cursor-pointer hover:scale-110 transition-transform"
        aria-label="Close"
      >
        &times;
      </span>

      {/* PIN Input Boxes */}
      <div className="flex gap-4 mb-8">
        {Array.from({ length: maxLength }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="password"
            value={pin[index] || ""}
            readOnly
            maxLength={1}
            className="w-10 h-10 text-center text-2xl rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            style={{
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          />
        ))}
      </div>

      {/* Numeric Pad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "delete"].map((item) => (
          <Button 
            key={item}
            onClick={() => handleButtonClick(item.toString())}
            style={{
              borderRadius: "50%",
              minWidth: "60px",
              height: "60px",
              backgroundColor: "white",
              color: "#1f2937",
              fontSize: "1.25rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              margin: "0 auto"
            }}
            className="hover:bg-gray-50 active:scale-95"
          >
            {item === "clear" ? "C" : item === "delete" ? "⌫" : item}
          </Button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={pin.length !== maxLength}
        style={{ backgroundColor: primaryColor }}
        className="mt-8 px-8 py-3 text-xl text-white rounded-full shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none"
      >
        Proceed
      </button>
    </div>
  );
};

export default React.memo(NumericPad);