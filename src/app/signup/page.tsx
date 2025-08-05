"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";
import axios from "@/lib/axios";
import styles from "./page.module.css";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const router = useRouter();

  //회원가입 성공 후 자동으로 로그인하려고
  // 커스텀 훅(useAuth)을 사용하여 user와 handleLogin을 가져오는 부분
  const { user, handleLogin, isPending } = useAuth();

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
      await axios.post(
        `https://linkbrary-api.vercel.app/${TEAM_ID}/auth/sign-up`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await handleLogin({ email: values.email, password: values.password });
      
      await axios.post("/folders", { name: "기본 폴더" });

      router.push("/linklist");
    } catch (err) {
      window.alert("회원가입에 실패했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isPending) {
      router.push("/signup");
    } else {
      router.push("/linklist");
    }
  }, [user, router, isPending]);
  const isFormValid = Object.values(values).every((v) => v.trim() !== "");

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
            이미 회원이신가요?
            <Link href="/login">로그인하기</Link>
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
            <label htmlFor="name">이름</label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="김링크"
              value={values.name}
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
            <div className={styles.pwRelative}>
              <label htmlFor="passwordRepeat">비밀번호 확인</label>
              <Input
                id="passwordRepeat"
                name="passwordRepeat"
                type={showPasswordRepeat ? "text" : "password"}
                placeholder="비밀번호 확인"
                value={values.passwordRepeat}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                className={styles.eyeButton}
              >
                <Image
                  src={
                    showPasswordRepeat
                      ? "/images/eye-off.png"
                      : "/images/eye-on.png"
                  }
                  alt="비밀번호 보기 토글"
                  width={16}
                  height={16}
                />
              </button>
            </div>

            <Button
              type="submit"
              className={styles.LoginBtn}
              disabled={!isFormValid}
            >
              회원가입
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
