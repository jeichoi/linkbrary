"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [values, setValues] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { user, login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(values);
      router.push("/linklist");
    } catch (err) {
      // toast(
      //   "error",
      //   "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요."
      // );
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/linklist");
    }
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <Button type="button" variant="outline" className="w-full mb-4">
        <span className="ml-2">구글로 시작하기</span>
      </Button>
      <div className="text-center text-gray-500 mb-4">또는</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={values.email}
          onChange={handleChange}
        />
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={values.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            {showPassword ? "숨기기" : "보기"}
          </button>
        </div>
        <Button type="submit" className="w-full">
          로그인
        </Button>
        <p className="text-sm text-center">
          회원이 아니신가요?{" "}
          <Link href="/signup" className="text-blue-600">
            회원가입하기
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
