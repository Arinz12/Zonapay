import { useState, useRef, useEffect } from 'react';

export default function OTPVerification({email,hideOtp}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState({ text: '', color: '' });
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', color: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle resend cooldown timer
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (isNaN(value)) {
      e.target.value = '';
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setMessage({ text: 'Please enter all 6 digits', color: 'red' });
      return;
    }

    setMessage({ text: 'Verifying...', color: 'blue' });

    try {
      const response = await fetch('https://www.billsly.co/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rotp: otpValue }),
      });

      
      if (response.ok) {
        setMessage({ text: 'Email Verified successfully!', color: 'green' });
        // Clear OTP on success
        setOtp(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
        console.log("verified")
        setTimeout(()=>{hideOtp()},1000)
      } else {
        setMessage({ text: 'Verification failed', color: 'red' });
      }
    } catch (error) {
        console.log("this from otp ",error)
      setMessage({ text: 'Error verifying OTP', color: 'red' });
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendCooldown(30); // 30 second cooldown
      setMessage({ text: 'Sending new code...', color: 'blue' });
      
      const response = await fetch('https://www.billsly.co/change', {
        method: 'POST',
        body:JSON.stringify({email}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setMessage({ text: 'New code sent!', color: 'green' });
      } else {
        setMessage({ text:'Failed to send new code', color: 'red' });
      }
    } catch (error) {
        console.log("this", error)
      setMessage({ text: 'Error sending new code', color: 'red' });
    }
  };

  return (
    <div className="fixed top-0 h-full w-full inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xs relative">
        <h2 className="text-xl font-bold mt-3 mb-4  text-center">Enter Email Verification Code</h2>
        
        {/* Message display */}
        {message.text && (
          <div className={`absolute  top-0 left-0 right-0 text-center text-sm text-${message.color}-500`}>
            {message.text}
          </div>
        )}
        
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              inputMode="numeric"
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-12 border-2 border-gray-300 rounded text-center text-xl focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 block bg-blue-500 text-center text-white rounded-lg hover:bg-blue-600 transition mb-3"
        >
          Verify
        </button>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendCooldown > 0}
            className={`text-sm ${resendCooldown > 0 ? 'text-gray-400' : 'text-blue-500 hover:text-blue-700'} font-medium`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't receive code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
