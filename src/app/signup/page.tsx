"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const RegisterPage = () => {
  const [values, setValues] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const router = useRouter();
  const { user, login } = useAuth();
  const TEAM_ID = "16-%EC%B5%9C%EC%9E%AC%EC%9D%B4";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (values.password !== values.passwordRepeat) {
    //   toast("warn", "비밀번호가 일치하지 않습니다.");
    //   return;
    // }

    try {
      const res = await fetch(
        `https://linkbrary-api.vercel.app/${TEAM_ID}/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("회원가입 실패");
      }

      await login({ email: values.email, password: values.password });
      router.push("/");
    } catch (err) {
      // toast("error", "회원가입에 실패했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <Button type="button" variant="outline" className="w-full mb-4">
        <span className="ml-2">구글로 시작하기</span>
      </Button>
      <div className="text-center text-gray-500 mb-4">또는</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="김링크"
          value={values.name}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={values.email}
          onChange={handleChange}
        />
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호"
          value={values.password}
          onChange={handleChange}
        />
        <Input
          id="passwordRepeat"
          name="passwordRepeat"
          type="password"
          placeholder="비밀번호 확인"
          value={values.passwordRepeat}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">
          회원가입
        </Button>
        <p className="text-sm text-center">
          이미 회원이신가요?{" "}
          {/* <Link href="/login" className="text-blue-600">
            로그인하기
          </Link> */}
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
