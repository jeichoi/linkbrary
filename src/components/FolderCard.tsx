"use client";

import { HTMLAttributes } from "react";
import { Folder } from "@/types/folder";

interface FolderCardProps extends HTMLAttributes<HTMLDivElement> {
  folder: Folder;
  onFolderClick?: (folder: Folder) => void;
}

const FolderCard = ({ folder, onFolderClick, ...props }: FolderCardProps) => {
  const handleClick = () => {
    onFolderClick?.(folder);
  };

  return (
    <div
      {...props} //부모에서 전달된 나머지 속성을 그대로 div에 추가
      role="button"
      tabIndex={0} //tabIndex={0}을 주면 Tab 키로 접근 가능
      aria-label={`폴더 ${folder.name}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        //포커스된 상태에서 Enter 또는 Space 키 누르면 클릭한 것처럼 작동
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <h3>{folder.name}</h3>
    </div>
  );
};

export default FolderCard;
