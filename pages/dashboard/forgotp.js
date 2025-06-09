import { useRouter } from "next/router";
import { useEffect } from "react";

const Forgotp = () => {
    const router = useRouter();

    useEffect(() => {
        document.getElementById("proceed").addEventListener("click", async (e) => {
            const resp = await fetch("https://www.billsly.co/zonapay/ValEmail", {
                method: "post",
                body: JSON.stringify({ val: document.getElementById("email").value.trim() }),
                headers: { "Content-Type": "application/json" }
            });
            if (resp.ok) {
                document.getElementById("msg").style.display = "block"
                setTimeout(() => { document.getElementById("msg").style.display = "none" }, 4000)
            }
            else {
                router.push({
                    pathname: "/forgotPass",
                    query: { data: document.getElementById("email").value.trim(), auth: true }
                });
            }
        })
    }, [])

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
            {/* Error Message */}
            <div 
                id="msg" 
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg hidden max-w-md w-full"
            >
                <p>Email does not exist in our database</p>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8">
                <div className="text-center space-y-6">
                    <h1 className="text-2xl font-bold text-gray-800">Password Recovery</h1>
                    <p className="text-gray-600">Enter your registered email address</p>

                    <div className="space-y-4">
                        <input 
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />

                        <button
                            id="proceed"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center" 
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgotp;