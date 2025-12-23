"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  
  // State to track authorization status and prevent content flash
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check for authentication token in local storage
    const token = localStorage.getItem("userToken");

    if (!token) {
      // Redirect unauthenticated users to the login page
      router.push("/login");
    } else {
      // Grant access if a token is present
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthorized(true);
    }
  }, [router]);

  // Render nothing while the authentication check is in progress
  if (!isAuthorized) {
    return null; 
  }

  // Render the protected content once authorized
  return <>{children}</>;
}