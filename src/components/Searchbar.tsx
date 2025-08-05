"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./Searchbar.module.css";

export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const q = searchParams.get("search");

  useEffect(() => {
    setSearch(q || "");
  }, [searchParams]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    if (!search) return window.alert("검색어 입력");
    if (q == search) return;
    router.push(`/linklist/search?search=${search}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className={styles.linkbarWrapper}>
      <div className={styles.inputWrapper}>
        <div className={styles.inputInner}>
          <Image
            src="/images/Search.png"
            alt="검색 아이콘"
            width={16}
            height={16}
            className={styles.searchIcon}
          />
          <input
            value={search}
            onChange={onChangeSearch}
            onKeyDown={onKeyDown}
            placeholder="링크를 검색해 보세요."
          />
        </div>
      </div>
    </div>
  );
}
