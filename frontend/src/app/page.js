'use client'
import styles from './page.module.css';
import { Button } from 'antd';
import Link from 'next/link';


export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.marvelLogo}>
        <h1>Marvel Universe</h1>
      </div>

      <div className={styles.gifContainer}>
        <img src='/images/ironman.gif' alt="Iron Man" className={styles.gif} />
        <img src='/images/spiderman.gif' alt="Spider-Man" className={styles.gif} />
      </div>

      <Button type="dashed" className={styles.manageGroupsButton}>
        <Link href="/home">Gerenciar Grupos</Link>
      </Button>
    </main>
  );
}
