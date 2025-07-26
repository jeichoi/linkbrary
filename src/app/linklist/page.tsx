"use client";

import { useAuth } from "@/contexts/AuthProvider";

export default function Linklist() {
  const { user } = useAuth();

  if (!user) return <div>로그인 정보 없음</div>;

  return (
    <div>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
    </div>
  );
}
