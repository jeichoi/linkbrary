"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReactNode } from "react";
import Input from "./Input";
import Button from "./Button";
import styles from "./Modal.module.css";

interface ModalWrapperProps {
  title?: string;
  children: ReactNode;
}

export default function Modal({ title, children }: ModalWrapperProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back(); // 이전 페이지로 이동 (모달 닫기)
  };

  return (
    <div onClick={handleClose} className={styles.modalwrapper}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.modalInnerWrapper}
      >
        <Button className={styles.buttonX} onClick={handleClose}>
          ✕
        </Button>

        {title && <h2>{title}</h2>}
        <div className={styles.su}>{children}</div>
      </div>
    </div>
  );
}
