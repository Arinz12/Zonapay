import Head from 'next/head';
import Image from 'next/image';

export default function OrbitingBallLoader() {
  return (
    <>
      <Head>
        <title>Icon with Orbiting Ball</title>
        <style jsx global>{`
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
        `}</style>
      </Head>

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="relative w-[150px] h-[150px]">
          {/* Loader Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] z-10 animate-pulse-custom">
            <Image
              src="https:zonapay.onrender.com/cicon192.png" // Update this path to your actual image
              alt="Loading Icon"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Orbit Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] border-2 border-blue-400/30 rounded-full z-0" />

          {/* Orbiting Ball */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
          </div>
        </div>
      </div>

      {/* Custom Animation Definitions */}
      <style jsx global>{`
        @keyframes pulse-custom {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.85;
          }
        }
        .animate-pulse-custom {
          animation: pulse-custom 1.5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: rotate 2s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}