"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isPending: boolean;
  handleLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  handleLogout: () => Promise<void>;
}

//React의 createContext는 전역적으로 공유할 수 있는 값을 만들 때 사용
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const getMe = async (token?: string) => {
    setIsPending(true); //로딩 상태를 true로 바꿔서 데이터를 가져오는 중임을 표시
    try {
      const res = await axios.get("/users");
      setUser(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setUser(null);
      } else {
        console.error("get 에러", err);
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await axios.post("/auth/sign-in", { email, password });
    const token = res.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token); // 토큰 저장
      await getMe(token); //방금 로그인한 사용자의 정보를 서버에서 다시 가져옴=>가져온 유저 데이터를 전역 상태(user)에 저장
    }
  };

  const handleLogout = async () => {
    // 1. localStorage에서 토큰 삭제
    localStorage.removeItem("token");

    // 2. 사용자 정보 초기화
    setUser(null);
  };

  useEffect(() => {
    // localStorage.setItem(key, value)
    // 값 저장

    // localStorage.getItem(key)
    // 값 읽기 (없으면 null 반환)

    // localStorage.removeItem(key)
    // 값 삭제

    // localStorage.clear()
    // 전체 삭제

    const token = localStorage.getItem("token"); // 브라우저 Web Storage API에서 제공하는 내장 메서드
    if (token) getMe(token); //저장된 토큰으로 로그인 유지
    else setIsPending(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isPending, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//useAuth 훅은 지금 프로젝트에서 로그인 상태를 어디서든 쉽게 꺼내 쓰도록 만든 커스텀 훅
//required = false(어떤 페이지가 로그인 필수인지, 아니면 비로그인도 가능한지 구분하는 용도)
export function useAuth(required = false) {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    //만약 <AuthProvider> 없이 컴포넌트를 사용하면 context가 null이 됨
    throw new Error("useAuth는 AuthProvider 안에서 사용되어야 합니다.");
  }

  //로그인이 꼭 필요한 페이지에서 비로그인 상태면 자동으로 /login으로 보내는 기능
  // useEffect(() => {
  //   if (!required && !context.user && !context.isPending) {
  //     router.push("/login");
  //   }
  // }, [context.user, context.isPending, required, router]);

  return context;
}
