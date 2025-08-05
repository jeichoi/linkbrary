"use client";
import styles from "./Footer.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className={styles.wrapper}>
      <section>
        <div className={styles.footerLeft}>©codeit - 2025</div>
        <div className={styles.footerCenter}>
          <span
            onClick={() => {
              router.push("/privacy");
            }}
          >
            Privacy Policy
          </span>
          <span
            onClick={() => {
              router.push("/faq");
            }}
          >
            FAQ
          </span>
        </div>
        <div className={styles.footerRight}>
          <Image
            src="/images/akar-icons_facebook-fill.png"
            alt="logo"
            width={20}
            height={20}
          />
          <Image
            src="/images/akar-icons_twitter-fill.png"
            alt="logo"
            width={20}
            height={20}
          />
          <Image
            src="/images/akar-icons_youtube-fill.png"
            alt="logo"
            width={20}
            height={20}
          />
          <Image
            src="/images/ant-design_instagram-filled.png"
            alt="logo"
            width={20}
            height={20}
          />
        </div>
      </section>
    </footer>
  );
}
