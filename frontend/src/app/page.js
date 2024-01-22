'use client'
import styles from './page.module.css'
import { Space, Button, Image } from 'antd';
import Link from 'next/link';


export default function Home() {


  return (
    <main className={styles.main}>
        <div className="space-align-block">
          <Button type="dashed" style={{backgroundColor:'chocolate', color:'white', fontFamily:'fantasy'}}>
            <Link href={'/home'}>
              Gerenciar Grupos
            </Link> 
          </Button>
        
        </div>
    </main>
  )
}
