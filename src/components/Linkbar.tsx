"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Linkbar() {
  const router = useRouter();
  const [addLink, setAddLink] = useState("");


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

    
 // 모달 열기
   const openAddLinkModal = () => {
     if (!addLink) return window.alert("링크 입력");
     router.push(`/linklist/add-link?url=${addLink}`);
   };   
    
    
  return (
    <div>
      <input
        value={addLink}
        onChange={onChangeLink}
        onKeyDown={onKeyDown}
        placeholder="링크 입력"
      />
      <button onClick={openAddLinkModal}>추가하기</button>
    </div>
  );
}
