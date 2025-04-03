import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Script from "next/script";

export default function Fund() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to load the Flutterwave script dynamically
  const loadFlutterwave = () => {
    return new Promise((resolve) => {
      if (typeof FlutterwaveCheckout !== "undefined") {
        resolve();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      }
    });
  };

  const validateForm = () => {
    const { name, email, phone, amount } = formData;
    if (!name || !email || !phone || !amount) {
      alert("All fields are required");
      return false;
    }
    if (amount <= 0) {
      alert("Amount must be greater than zero");
      return false;
    }
    return true;
  };

  const makePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await loadFlutterwave();
      FlutterwaveCheckout({
        public_key: "FLWPUBK-254af65d33d3f2e4cbfa5e025673d67f-X", // Use public key from environment
        tx_ref: uuidv4(),
        amount: formData.amount,
        currency: "NGN",
        payment_options: "card, mobilemoneyghana, ussd",
        redirect_url: "https://zonapay.onrender.com/done",
        meta: {
          consumer_id: 23,
          consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
          email: formData.email,
          phone_number: formData.phone,
          name: formData.name,
        },
        customizations: {
          title: "The Titanic Store",
          description: "Funding of Zona wallet",
          logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
        },
      });
    } catch (error) {
      console.error("Payment initialization failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Fund</title>
        {/* Tailwind CSS */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {/* Flutterwave Script will be loaded dynamically */}
      </Head>
      <div className="bg-gray-100 flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fund</h2>
          <form>
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Phone Field */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Amount Field */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={makePayment}
                disabled={loading}
                aria-busy={loading}
                className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-500"
                }`}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
