"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import styles from "./page.module.css";
import Image from "next/image";

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
  const { user, handleLogin, isPending, setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLogin(values);
      if (user) {
        router.push("/linklist");
      }
    } catch (err) {
      window.alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.");
      console.error(err);
    }
  };
  useEffect(() => {
    // 로그인 페이지 진입 시 기존 로그인 정보 제거
    setUser(null);
  }, []);
  
  useEffect(() => {
    console.log("로그아웃했는데..", user); //계속 이전 값 찍힘
    if (isPending) {
      console.log("isPending..", isPending);
      <div>로딩 중...</div>;
    } else {
      console.log("!isPending..", isPending);
    }
    //원래는 if(user)였는데 여기서 계속 이전 값 찍힘
    if (!isPending) {
      router.push("/login");
    } else {
      router.push("/linklist");
    }
  }, [user, router, isPending]);

  return (
    <section className={styles.loginWrapper}>
      <div className={styles.loginBg}>
        <div className={styles.loginMain}>
          <Image
            src="/images/logo.png"
            alt="logo"
            width={210}
            height={38}
            className={styles.logo}
            onClick={() => {
              router.push("/");
            }}
          />
          <p>
            회원이 아니신가요?
            <Link href="/signup">회원가입하기</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">이메일</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={values.email}
              onChange={handleChange}
            />
            <div className={styles.pwRelative}>
              <label htmlFor="password">비밀번호</label>
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
                className={styles.eyeButton}
              >
                <Image
                  src={
                    showPassword ? "/images/eye-off.png" : "/images/eye-on.png"
                  }
                  alt="비밀번호 보기 토글"
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <Button type="submit" className={styles.LoginBtn}>
              로그인
            </Button>
          </form>
          {/* <Button type="button">
            <span>구글로 시작하기</span>
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
