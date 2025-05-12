import { applyActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebaseconfig";

function VerifyComplete() {

    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const oobCode = params.get("oobCode");
        console.log("Finish");
        console.log(mode, oobCode, params);
        if (mode === "verifyEmail" && oobCode) {
            applyActionCode(auth, oobCode).then(() => {
                //alert is ("Email Verified");
                setIsVerified(true);
                navigate("https://cosc-484-project-front.vercel.app", { replace: true });
            })
                .catch((error) => {
                    navigate("https://cosc-484-project-front.vercel.app", { replace: true });
                    console.error("Verification Error", error.message);
                });
        }
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md mx-4 space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
                <div>
                    <h2 className="text-left text-3xl font-extrabold text-gray-700">
                        {isVerified ? "Verification Complete" : "Verifying..."}
                    </h2>
                </div>
            </div>
        </div>);
}

export default VerifyComplete;