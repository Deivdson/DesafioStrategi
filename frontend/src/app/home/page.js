'use client'
import Home from "@/components/page/home";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import nookies from "nookies";

export default function Page(){
    
    const { data, status } = useSession();
    const router = useRouter();
    const user = nookies.get().user;
    useEffect(() => {        
        if (status === 'loading') {
          return;
        }
    
        if (!data && !user) {
          router.push('/login');
        }
      }, [data, status, router]);

    return(
        <Home/>
    )
}