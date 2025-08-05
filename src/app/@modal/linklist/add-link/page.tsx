"use client";

import Modal from "@/components/Modal";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Folder } from "@/types/folder";
import { runAddLinkCallback } from "@/lib/modalCallback";
import { Link as LinkType } from "@/types/link";
import Button from "@/components/Button";
import { FiCheck } from "react-icons/fi"; // 체크 아이콘 추가 (선택 폴더 표시용)

export default function AddLinkModal() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [linkName, setLinkName] = useState(initialUrl);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const router = useRouter();

  // 폴더 목록 불러오기
  const getFolders = async () => {
    try {
      const res = await axios.get<Folder[]>("/folders");
      setFolders(res.data);
      if (res.data.length > 0) {
        setSelectedFolder(res.data[0].id); // 기본값으로 첫 번째 폴더 선택
      }
    } catch (err) {
      console.error("폴더 가져오기 실패", err);
    }
  };

  useEffect(() => {
    getFolders();
  }, []);

  // 모달 닫기
  const handleClose = () => {
    router.back();
  };

  // 링크 추가
  const handleAdd = async () => {
    if (!linkName) return alert("링크를 입력해주세요.");
    if (!selectedFolder) return alert("폴더를 선택해주세요.");

    try {
      const res = await axios.post<LinkType>("/links", {
        url: linkName,
        folderId: selectedFolder,
      });

      runAddLinkCallback(res.data);
      handleClose();
    } catch (err: any) {
      console.error("링크 추가 실패", err);
      const message =
        err.response?.data?.message || "저장 실패. 다시 시도해주세요.";
      alert(message);
    }
  };

  return (
    <Modal title="폴더에 추가">
      <div className="modalContent">
        {/* 링크 주소 */}
        <p
          style={{ textAlign: "center", color: "#888", marginBottom: "1.5rem" }}
        >
          {linkName}
        </p>

        {/* 폴더 리스트 */}
        <ul className="folderList">
          {folders.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            return (
              <li
                key={folder.id}
                className={`folderItem ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedFolder(folder.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 500 }}>{folder.name}</span>
                <span style={{ color: "#999", fontSize: "0.9rem" }}>
                  {folder.linkCount}개 링크
                </span>
                {isSelected && (
                  <FiCheck style={{ marginLeft: "0.5rem", color: "#333" }} />
                )}
              </li>
            );
          })}
        </ul>

        {/* 링크 추가하기 버튼 */}
        <Button type="submit" className="submit" onClick={handleAdd}>
          링크 추가하기
        </Button>
      </div>
    </Modal>
  );
}
