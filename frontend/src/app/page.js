'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { usePathname, useRouter } from 'next/navigation';
import { Space, Button } from 'antd';
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
     

        <div className="space-align-block">
          <Space align="start">          
            <Button type="dashed" style={{backgroundColor:'chocolate', color:'white', fontFamily:'fantasy'}}>
              <Link href={'/home'}>
                Gerenciar Grupos
              </Link>
            </Button>          
          </Space>
        </div>        
      
      
    </main>
  )
}
