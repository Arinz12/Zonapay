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
  return (<div id="keyPad" style={{backgroundColor:"gainsboro"}} className=" flex-col items-center mt-10 fixed rounded-t-2xl z-10 w-full bottom-0 pt-5 shp hidden ">
      <span onClick={()=>{document.getElementById("keyPad").style.display="none"}} className="absolute text-black text-4xl top-1 right-3">&times;</span>
      {/* PIN Input */}
      <input
        type="password"
        value={pin}
        readOnly
        maxLength={maxLength}
        placeholder="Enter PIN"
        className="w-48 text-center text-2xl border-2 border-gray-300 rounded-md py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Numeric Pad */}
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "delete"].map((item) => (
          <button
            key={item}
            onClick={() => handleButtonClick(item.toString())}
            className={`w-12 h-12 text-xl rounded-lg shadow-md
              ${
                item === "clear"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : item === "delete"
                  ? "bg-yellow-500 text-black hover:bg-yellow-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {item === "clear" ? "C" : item === "delete" ? "⌫" : item}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 text-xl text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
};

export default NumericPad;
