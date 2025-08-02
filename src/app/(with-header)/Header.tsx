"use client";
import styles from "./Header.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import Image from "next/image";
import { useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const { user, handleLogout, isPending } = useAuth();

  // if (isPending) return <div>로딩 중...</div>;
  return (
    <header className={styles.wrapper}>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={133}
        height={24}
        className={styles.logo}
      />
      {user ? (
        <Button onClick={handleLogout}>로그아웃</Button>
      ) : (
        <Button onClick={() => router.push("/login")}>로그인</Button>
      )}
    </header>
  );
}
