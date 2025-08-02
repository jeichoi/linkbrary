"use client";

import Modal from "@/components/Modal";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Folder } from "@/types/folder";
import { runAddFolderCallback } from "@/lib/modalCallback";

export default function AddFolderModal() {
  const [folderName, setFolderName] = useState("");
  const router = useRouter();

  const handleClose = () => {
    router.back(); // 모달 닫기
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post<Folder>("/folders", { name: folderName });

      // 부모에 등록된 콜백 실행 → 부모 화면에 즉시 전달
      runAddFolderCallback(res.data);
      handleClose(); // 모달 닫기
    } catch {
      alert("저장 실패");
    }
  };

  return (
    <Modal title="폴더 추가">
      <Input
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="내용 입력"
      />

      <button onClick={handleAdd}>추가하기</button>
    </Modal>
  );
}
