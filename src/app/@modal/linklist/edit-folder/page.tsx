"use client";
import Modal from "@/components/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Folder } from "@/types/folder";
import { runEditFolderCallback } from "@/lib/modalCallback";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";

export default function EditFolderModal() {
  const router = useRouter();
  const [folder, setFolder] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClose = () => {
    router.back(); // 모달 닫기
  };

  const handleEdit = async () => {
    if (!id) return;

    try {
      const res = await axios.put(`/folders/${id}`, { name: folder });
      runEditFolderCallback(res.data); // 전체 객체 전달
      handleClose();
    } catch (error) {
      alert("수정 실패");
    }
  };

  return (
    <Modal title="폴더 수정">
      <Input
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        placeholder="내용 입력"
        className="content"
        type="content"
      />
      <Button type="submit" className="submit" onClick={handleEdit}>
        수정 하기
      </Button>
    </Modal>
  );
}
