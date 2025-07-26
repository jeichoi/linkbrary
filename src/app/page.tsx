"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, logout, isPending } = useAuth();


  if (isPending) return <div>로딩 중...</div>;

  return (
    <div className={styles.page}>
      인덱스 페이지
      {user ? (
        <Button onClick={logout}>로그아웃</Button>
      ) : (
        <Button onClick={() => router.push("/login")}>로그인</Button>
      )}
    </div>
  );
}
