"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";

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

  //회원가입 성공 후 자동으로 로그인하려고
  // 커스텀 훅(useAuth)을 사용하여 user와 handleLogin을 가져오는 부분
  const { user, handleLogin } = useAuth();

  const TEAM_ID = "16-%EC%B5%9C%EC%9E%AC%EC%9D%B4";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //입력 필드가 여러 개이기 때문에 각각의 onChange 핸들러를 따로 만들지 않고 하나로 처리하기 위해
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (values.password !== values.passwordRepeat) {
      window.alert("비밀번호가 일치하지 않습니다.");
      return;
    }

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

      await handleLogin({ email: values.email, password: values.password });
      router.push("/");
    } catch (err) {
      window.alert("회원가입에 실패했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      <h1>회원가입</h1>
      <Button type="button">
        <span>구글로 시작하기</span>
      </Button>
      <div>또는</div>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit">회원가입</Button>
        <p>
          이미 회원이신가요?
          <Link href="/login">로그인하기</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
