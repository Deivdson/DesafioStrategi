"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";
import React from "react";
import { api } from "@/api";
import styles from './index.module.css'

const NavBar = () => {
    const {data: session} = useSession();
    
    if (!session) return <></>
    return (
        <div className={styles.navbar}>
            <div>
                {session?.user ? (
                    <>
                        <p> {session.user.name}</p>
                        <Button type="primary" className={styles.btn} onClick={() => api.logout()}>
                            Sign Out
                        </Button>
                    </>
                )
                : 
                (
                    <>
                        <Button type="primary" className={styles.btn} onClick={() => signIn()}>
                            Sign In
                        </Button>
                    </>
                )
                }
            </div>
        </div>
    )
}

export default NavBar;