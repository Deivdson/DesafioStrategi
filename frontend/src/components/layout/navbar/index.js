"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";
import React from "react";
import { api } from "@/api";
import styles from "./index.module.css";
import nookies from "nookies";

const NavBar = () => {
  const { data: session } = useSession();
  const token = nookies.get().token;
  const user = nookies.get().user;

  if (!session && !token) return <></>;
  return (
    <div className={styles.navbar}>
      <div>
        {session?.user || user ? (
          <>
            <p> {user?.name}</p>
            <Button
              type="primary"
              className={styles.btn}
              onClick={() => api.logout()}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              className={styles.btn}
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
