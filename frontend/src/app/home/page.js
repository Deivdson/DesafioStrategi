'use client'
import Home from "@/components/page/home";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
export default function Page(){
    
    const { data, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {        
        if (status === 'loading') {
          return;
        }
    
        if (!data) {
          router.push('/login');
        }
      }, [data, status, router]);

    return(
        <Home/>
    )
}