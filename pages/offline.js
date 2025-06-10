// components/OfflinePage.tsx
import React, { useEffect } from 'react';
import Head from 'next/head';

const OfflinePage = () => {
  // Auto-reload when connection is restored
  useEffect(() => {
    const handleOnline = () => window.location.reload();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <>
      <Head>
        <title>You're Offline | Billsly App</title>
      </Head>
      <div className="offline-container">
        <div className="offline-content">
          <div className="pulse-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#2536EB" strokeWidth="8" fill="none" />
              <path 
                stroke="#2536EB" 
                strokeWidth="8" 
                strokeLinecap="round"
                d="M40,50 L60,70 L80,40"
                fill="none"
              />
            </svg>
          </div>
          <h1>Whoops! No Internet Connection</h1>
          <p className="subtext">
            You're offline right now. Check your network or try again later.
          </p>
          <button onclick={() => window.location.reload()}
            className="retry-button"
          >
            Retry Connection
          </button>
        </div>
      </div>
      <style jsx>{`
        .offline-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
          padding: 20px;
          text-align: center;
        }
        
        .offline-content {
          max-width: 500px;
          animation: fadeIn 0.6s ease-out;
        }

        .pulse-circle {
          margin: 0 auto 30px;
          animation: pulse 2s infinite;
        }

        h1 {
          color: #2536EB;
          font-size: 2.2rem;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .subtext {
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .retry-button {
          background: #2536EB;
          color: white;
          border: none;
          padding: 12px 28px;
          font-size: 1rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(37, 54, 235, 0.2);
        }

        .retry-button:hover {
          background: #1a2ac1;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 54, 235, 0.3);
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default OfflinePage;