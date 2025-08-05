"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./Linkbar.module.css";

export default function Linkbar() {
  const router = useRouter();
  const [addLink, setAddLink] = useState("");
  const searchParams = useSearchParams();

  const onChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddLink(e.target.value);
  };

  const onSubmit = () => {
    if (!addLink) return window.alert("링크 입력");
    router.push(`/linklist/`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  // URL이 초기 페이지(/linklist)로 돌아오면 입력창 비우기
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/linklist") {
      setAddLink(""); // ✅ 비우기
    }
  }, [searchParams]);

  // 모달 열기
  const openAddLinkModal = () => {
    if (!addLink) return window.alert("링크 입력");
    router.push(`/linklist/add-link?url=${addLink}`);
  };

  return (
    <div className={styles.linkbarWrapper}>
      <h2 className={styles.title}>세상의 모든 정보, 필요한 순간에</h2>
      <div className={styles.inputWrapper}>
        <div className={styles.inputInner}>
          <Image
            src="/images/link.png"
            alt="링크 아이콘"
            width={28}
            height={28}
            className={styles.linkIcon}
          />
          <input
            value={addLink}
            onChange={onChangeLink}
            onKeyDown={onKeyDown}
            placeholder="링크 입력"
          />
        </div>
        <button onClick={openAddLinkModal}>추가하기</button>
      </div>
    </div>
  );
}
