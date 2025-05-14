import { applyActionCode } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebaseconfig";

function VerifyComplete() {

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const oobCode = params.get("oobCode");
        console.log("Finish");
        console.log(mode, oobCode, params);
        if (mode === "verifyEmail" && oobCode) {

            applyActionCode(auth, oobCode).then(() => {
                // Email Verified 
                navigate("https://cosc-484-project-front.vercel.app");
            })
                .catch((error) => {
                    navigate("https://cosc-484-project-front.vercel.app");
                    console.error("Verification Error", error.message);
                });
        }
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md mx-4 space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
                <div>
                    <h2 className="text-left text-3xl font-extrabold text-gray-700">
                        Verifying...
                    </h2>
                </div>
            </div>
        </div>);
}

export default VerifyComplete;