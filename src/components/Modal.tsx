"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReactNode } from "react";
import Input from "./Input";
import Button from "./Button";

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
    <div onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Button onClick={handleClose}>✕</Button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
