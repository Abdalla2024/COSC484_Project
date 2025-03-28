import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const auth = getAuth(); // Ensure Firebase is initialized before calling this

    useEffect(() => {
        if (!auth) {
            console.error("Firebase Auth is not initialized.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const idToken = await getIdToken(currentUser);
                    setToken(idToken);
                } catch (error) {
                    console.error('Error getting ID token:', error);
                }
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [auth]);

    const value = { user, token, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
