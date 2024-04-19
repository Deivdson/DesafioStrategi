"use client";
import styles from "./page.module.css";
import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.marvelLogo}>
        <h1>Desafio Strategi</h1>
      </div>

      <Button type="dashed" className={styles.manageGroupsButton}>
        <Link href="/home">Gerenciar Grupos</Link>
      </Button>
    </main>
  );
}
