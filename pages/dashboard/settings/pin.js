import { ArrowBack, ArrowBackIosRounded, ArrowForward, CheckCircle } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Head from "next/head";
import { useState, useRef } from "react";
import Link from "next/link";
import router from "next/router";

const Pin = () => {
    const [pinCreated, setPinCreated] = useState(false);
    const [firstPin, setFirstPin] = useState(["", "", "", ""]);
    const [secondPin, setSecondPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1 = Create PIN, 2 = Confirm PIN

    const firstPinRefs = [useRef(), useRef(), useRef(), useRef()];
    const secondPinRefs = [useRef(), useRef(), useRef(), useRef()];

    const handlePinChange = (index, value, pinType) => {
        if (!/^\d?$/.test(value)) return;
        
        if (pinType === 'first') {
            setFirstPin(prev => {
                const updated = [...prev];
                updated[index] = value;
                return updated;
            });
            if (value && index < 3) firstPinRefs[index + 1].current.focus();
        } else {
            setSecondPin(prev => {
                const updated = [...prev];
                updated[index] = value;
                return updated;
            });
            if (value && index < 3) secondPinRefs[index + 1].current.focus();
        }
    };

    const handleBackToEdit = () => {
        setCurrentStep(1);
        setTimeout(() => firstPinRefs[0].current.focus(), 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pin1 = firstPin.join("");
        const pin2 = secondPin.join("");

        if (pin1 !== pin2 || !/^\d{4}$/.test(pin1)) {
            setError(true);
            setTimeout(() => setError(false), 1000);
            return;
        }

        try {
            const response = await fetch("https://www.billsly.co/zonapay/setpin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin: pin1 })
            });
            if (response.ok) setPinCreated(true);
        } catch (e) {
            console.error("Error setting PIN:", e);
        }
    };

    if (pinCreated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-6 max-w-md w-full">
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 100 }} />
                    <h1 className="text-3xl font-bold text-center">PIN Successfully Set</h1>
                    <Link href="/dashboard" className="w-full">
                        <Button 
                            fullWidth 
                            variant="contained" 
                            startIcon={<ArrowBack />}
                            sx={{ py: 2, borderRadius: 2 }}
                        >
                            Return to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col p-4 bg-gray-50">
            <Head>
                <title>{currentStep === 1 ? "Create PIN" : "Confirm PIN"}</title>
            </Head>

            <IconButton 
                onClick={currentStep === 1 ? () => router.back() : handleBackToEdit}
                sx={{ alignSelf: 'flex-start', mb: 2 }}
            >
                <ArrowBackIosRounded />
            </IconButton>

            <form onSubmit={handleSubmit} className="flex flex-col items-center flex-1">
                <h1 className="text-3xl font-bold mb-2 text-center">
                    {currentStep === 1 ? "Create Security PIN" : "Confirm Your PIN"}
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    {currentStep === 1 
                        ? "Enter a 4-digit PIN for secure transactions"
                        : "Re-enter your PIN to confirm"}
                </p>

                {/* Step Indicator */}
                <div className="flex gap-2 mb-8">
                    {[1, 2].map(step => (
                        <div 
                            key={step}
                            className={`h-1 w-6 rounded-full ${currentStep === step ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>

                {/* PIN Inputs */}
                <div className={`flex gap-4 mb-8 ${error ? 'animate-shake' : ''}`}>
                    {(currentStep === 1 ? firstPin : secondPin).map((digit, index) => (
                        <input
                            key={index}
                            ref={currentStep === 1 ? firstPinRefs[index] : secondPinRefs[index]}
                            type="password"
                            maxLength="1"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handlePinChange(index, e.target.value, currentStep === 1 ? 'first' : 'second')}
                            className={`w-14 h-14 text-2xl text-center border-2 rounded-lg focus:outline-none ${
                                error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-red-500 mb-4">PINs do not match. Please try again.</p>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    disabled={(currentStep === 1 ? firstPin : secondPin).some(d => d === "")}
                    onClick={() => {
                        if (currentStep === 1 && firstPin.every(d => d !== "")) {
                            setCurrentStep(2);
                            setTimeout(() => secondPinRefs[0].current.focus(), 100);
                        }
                    }}
                    type={currentStep === 2 ? "submit" : "button"}
                    sx={{
                        maxWidth: 400,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        textTransform: 'none'
                    }}
                >
                    {currentStep === 1 ? "Continue" : "Confirm PIN"}
                </Button>
            </form>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default Pin;