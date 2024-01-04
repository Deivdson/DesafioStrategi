'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import nookies from "nookies";

export default function Home() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(()=> {
    const token = nookies.get().token;
    console.log(token)
    if(!token){
      router.push('login')
    }
  },[])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
      
       <Link href={'/'}>
          Acessar Groups
       </Link>
      
      </div>
    </main>
  )
}
