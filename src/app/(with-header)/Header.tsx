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

  useEffect(() => {
    console.log("🔵 [AuthProvider] user 상태 변경:", user);
  }, [user]);

  // if (isPending) return <div>로딩 중...</div>;
  return (
    <header className={styles.wrapper}>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={133}
        height={24}
        className={styles.logo}
        onClick={() => router.push("/")}
      />
      {user ? (
        <div className={styles.wrapperRight}>
          {/* 즐겨찾기대신 */}
          <Button onClick={handleLogout} className={styles.loginBtn}>
            ⭐ 로그아웃
          </Button>
          <div
            className={styles.profile}
            onClick={() => router.push("/linklist")}
          >
            <Image
              src="/images/profile_img.png"
              alt="profile_img"
              width={20}
              height={20}
              className={styles.profileImg}
            />
            <div className={styles.profileName}>{user.name}</div>
          </div>
        </div>
      ) : (
        <div className={styles.wrapperRight}>
          <Button
            onClick={() => router.push("/login")}
            className={styles.loginBtn}
          >
            로그인
          </Button>
        </div>
      )}
    </header>
  );
}
