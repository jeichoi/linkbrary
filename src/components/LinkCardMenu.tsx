"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LinkCardMenu.module.css";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export default function LinkCardMenu({ onEdit, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      <button
        className={styles.kebabButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ⋯
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <button onClick={onEdit}>수정하기</button>
          <button onClick={onDelete}>삭제하기</button>
        </div>
      )}
    </div>
  );
}
