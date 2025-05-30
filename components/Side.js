import React from 'react';
import Head from 'next/head';

const ChangingWordsComponent = () => {
  return (
    <>
      <Head>
        <style>{`
          .text-container {
            font-size: 1.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            white-space: nowrap;
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            height:100vh;
            justify-content:center;
            flex-grow:1
          }
          
          .changing-words {
            position: relative;
            display: inline-block;
            height: 1.2em;
            margin-left: 0.3em;
            vertical-align: middle;
            color: #e74c3c;
          }
          
          .changing-word {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            animation: wordCycle 12s infinite;
          }
          
          .changing-word:nth-child(1) { animation-delay: 0s; }
          .changing-word:nth-child(2) { animation-delay: 3s; }
          .changing-word:nth-child(3) { animation-delay: 6s; }
          .changing-word:nth-child(4) { animation-delay: 9s; }
          
          @keyframes wordCycle {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            8% {
              opacity: 1;
              transform: translateY(0);
            }
            25% {
              opacity: 1;
              transform: translateY(0);
            }
            33% {
              opacity: 0;
              transform: translateY(-15px);
            }
            100% {
              opacity: 0;
              transform: translateY(-15px);
            }
          }
          
          .static-text {
            color: #2563EB;
            display: inline-block;
            font-size:40px;
          }
        `}</style>
      </Head>

      <div className="text-container">
 
        <span className="static-text rubik-b">Billsly is</span>
        <div className="changing-words">
          <span className="changing-word">Fast</span>
          <span className="changing-word">Secure</span>
          <span className="changing-word">Reliable</span>
          <span className="changing-word">Alive</span>
        </div>
      </div>
    </>
  );
};

export default ChangingWordsComponent;