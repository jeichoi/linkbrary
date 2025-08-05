"use client";
import Modal from "@/components/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Folder } from "@/types/folder";
import { runEditLinkCallback } from "@/lib/modalCallback";
import Input from "@/components/Input";
import { useState } from "react";

export default function EditLinkModal() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClose = () => {
    router.back(); // 모달 닫기
  };

  const handleEdit = async () => {
    if (!id) return;

    try {
      const res = await axios.put(`/links/${id}`, { url: link });
      runEditLinkCallback(res.data); // 전체 객체 전달
      handleClose();
    } catch (error) {
      alert("수정 실패");
    }
  };

  return (
    <Modal title="링크수정">
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="내용 입력"
        type="content"
      />
      <button type="submit" className="submit" onClick={handleEdit}>
        수정 하기
      </button>
    </Modal>
  );
}
