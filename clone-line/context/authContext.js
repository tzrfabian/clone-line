import { createContext, useState } from "react";

const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AuthContext.Provider
        value={{
            isLoggedIn,
            setIsLoggedIn
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext