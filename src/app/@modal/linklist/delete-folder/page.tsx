"use client";

import Modal from "@/components/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { Folder } from "@/types/folder";
import { runDeleteFolderCallback } from "@/lib/modalCallback";
import Button from "@/components/Button";

export default function DeleteFolderModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClose = () => {
    router.back(); // 모달 닫기
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await axios.delete(`/folders/${id}`);
      runDeleteFolderCallback(Number(id)); // 삭제 후 부모에 반영
      handleClose();
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 409) {
        alert(
          "해당 폴더에 링크가 남아 있어 삭제할 수 없습니다. 먼저 링크를 삭제해주세요."
        );
      } else {
        alert("폴더 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Modal title="폴더 삭제">
      <Button type="submit" className="submit" onClick={handleDelete}>
        삭제하기
      </Button>
    </Modal>
  );
}
