import { useRouter } from 'next/router';
import { useEffect } from 'react';
import nookies from "nookies";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const token = nookies.get().token;
  
  useEffect(() => {
    
    if (!token) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
