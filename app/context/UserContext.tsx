"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define the shape of the decoded JWT token
interface DecodedToken {
  id?: string;
  name?: string;
  role?: string;
  [key: string]: any; // Allow for additional dynamic properties
}

// Define the shape of the Context Data
interface UserContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  userData: DecodedToken | null;
  setUserData: (data: DecodedToken | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<DecodedToken | null>(null);

  useEffect(() => {
    // Ensure we are running on the client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("userToken");

      if (token) {
        setUserToken(token);

        try {
          // Decode the token to extract user details
          const decoded = jwtDecode<DecodedToken>(token);
          setUserData(decoded);
        } catch (error) {
          console.error("Invalid Token:", error);
          // Clean up invalid session data
          localStorage.removeItem("userToken");
          setUserToken(null);
          setUserData(null);
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userToken, setUserToken, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}