"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import Header from "@/app/(with-header)/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { user, handleLogout, isPending } = useAuth();

  return (
    <section className={styles.mainWrapper}>
      <article className={styles.mainTop}>
        <div className={styles.mainFont}>
          <span>세상의 모든 정보</span>를<br />
          쉽게 저장하고 관리해 보세요
        </div>
        <Image
          src="/images/main.png"
          alt="main"
          width={1440}
          height={927}
          className={styles.mainImg}
        />
      </article>
      <article className={styles.mainWhite}>
        <div className={styles.wrapper}>
          <div className={styles.articleFont}>
            <div>
              원하는 링크를
              <br />
              저장하세요
            </div>
            <div>
              나중에 읽고 싶은 글, 다시 보고 싶은 영상,
              <br />
              사고 싶은 옷, 기억하고 싶은 모든 것을
              <br />한 공간에 저장하세요.
            </div>
          </div>
          <Image
            src="/images/img1.png"
            alt="main"
            width={696}
            height={450}
            className={styles.mainImg}
          />
        </div>
      </article>
      <article className={styles.mainGray}>
        <div className={styles.wrapper}>
          <Image
            src="/images/img2.png"
            alt="main"
            width={729}
            height={450}
            className={styles.mainImg}
          />
          <div className={styles.articleFont}>
            <div>
              링크를 폴더로
              <br />
              관리하세요
            </div>
            <div>
              나만의 폴더를 무제한으로 만들고
              <br />
              다양하게 활용할 수 있습니다.
            </div>
          </div>
        </div>
      </article>
      <article className={styles.mainWhite}>
        <div className={styles.wrapper}>
          <div className={styles.articleFont}>
            <div>
              저장한 링크를
              <br />
              공유해 보세요.
            </div>
            <div>
              여러 링크를 폴더에 담고 공유할 수 있습니다.
              <br />
              가족, 친구, 동료들에게 쉽고 빠르게 링크를
              <br />
              공유해 보세요.
            </div>
          </div>
          <Image
            src="/images/img3.png"
            alt="main"
            width={712}
            height={450}
            className={styles.mainImg}
          />
        </div>
      </article>
      <article className={styles.mainGray}>
        <div className={styles.wrapper}>
          <Image
            src="/images/img4.png"
            alt="main"
            width={650}
            height={450}
            className={styles.mainImg}
          />
          <div className={styles.articleFont}>
            <div>
              저장한 링크를
              <br />
              검색해 보세요
            </div>
            <div>중요한 정보들을 검색으로 쉽게 찾아보세요.</div>
          </div>
        </div>
      </article>
    </section>
  );
}
