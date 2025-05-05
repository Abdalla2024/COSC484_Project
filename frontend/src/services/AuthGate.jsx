import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebaseconfig";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const AuthGate = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const isAuthPage = ['signin', 'signup', 'verify-pending', 'verify-complete'].includes(location.pathname.slice(1));

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log("user =", user, isAuthPage);
            if (user == null && isAuthPage == false) {
                navigate("/signin");
            }

            if (user && isAuthPage == false && !user.emailVerified) {
                navigate("/verify-pending");
            }

            /* else if (!user?.emailVerified) {
                navigate("/verify-pending");
            } */
        });
        return () => unsub();
    }, [navigate]);

    return <>{children}</>;
}

export default AuthGate; 