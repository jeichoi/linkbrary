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
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const getMe = async (token?: string) => {
    setIsPending(true);
    try {
      const res = await axios.get("/users", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });
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

  const login = async ({
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
      await getMe(token);
    }
  };

  const logout = async () => {
    // 1. localStorage에서 토큰 삭제
    localStorage.removeItem("token");

    // 2. 사용자 정보 초기화
    setUser(null);
  };

  //   const updateMe = async (formData: Partial<User>) => {
  //     const res = await axios.patch("/users/me", formData);
  //     setUser(res.data);
  //   };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getMe(token); //저장된 토큰으로 로그인 유지
    else setIsPending(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isPending, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(required = false) {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서 사용되어야 합니다.");
  }

  useEffect(() => {
    if (required && !context.user && !context.isPending) {
      router.push("/login");
    }
  }, [context.user, context.isPending, required, router]);

  return context;
}
