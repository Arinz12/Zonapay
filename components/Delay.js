// components/Loader.js
import Image from "next/image";

export default function Loader() {
  return (<div  style={{backgroundColor:"white",backdropFilter:"blur(10px)"}} className=" flex-col items-center justify-center  fixed  z-10 w-full bottom-0 left-0 right-0 h-full">
    <div className="relative w-[150px] h-[150px]">
      {/* Pulsing Icon */}
      <Image
        src="https://zonapay.onrender.com/cicon192.png"
        alt="Please wait..."
        width={100}
        height={100}
        className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 animate-pulseCustom"
      />

      {/* Static Orbit Ring */}
      <div className="absolute top-1/2 left-1/2 w-[130px] h-[130px] border-2 border-blue-400/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Rotating Dot Container */}
      <div className="absolute top-1/2 left-1/2 w-[130px] h-[130px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
        <div className="absolute top-0 left-1/2 w-[12px] h-[12px] bg-blue-500 rounded-full shadow-md -translate-x-1/2" />
      </div>
    </div>
    </div>
  );
}
