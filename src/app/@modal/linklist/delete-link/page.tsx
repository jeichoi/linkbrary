"use client";

import Modal from "@/components/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Folder } from "@/types/folder";
import { runDeleteLinkCallback } from "@/lib/modalCallback";

export default function DeleteLinkModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClose = () => {
    router.back(); // 모달 닫기
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await axios.delete(`/links/${id}`);
      runDeleteLinkCallback(Number(id)); // 삭제 후 부모에 반영
      handleClose();
    } catch (error) {
      alert("삭제 실패");
    }
  };

  return (
    <Modal title="링크삭제">
      <button type="submit" className="submit" onClick={handleDelete}>
        삭제하기
      </button>
    </Modal>
  );
}
