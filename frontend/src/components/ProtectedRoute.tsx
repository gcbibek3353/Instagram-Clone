import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // console.log(children);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null indicates loading

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get('http://localhost:3000/api/v1/user/auth', { withCredentials: true }).then((response)=>{
          // console.log(response.data.authenticated);
          setIsAuthenticated(response.data.authenticated);
        })
      } catch (error) {
        console.error("Error verifying token:");
        console.log(isAuthenticated);
        
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);
  
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }


  // Check if user is authenticated or if user data exists in recoil state
  if (isAuthenticated) {
    return <div>{children}</div>; 
  }

  // If not authenticated, redirect to sign-in page
  return <Navigate to="/signin" />;
};

export default ProtectedRoute;
