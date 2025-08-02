"use client";

import styles from "./Pagination.module.css";
import { useRouter } from "next/navigation";

interface PaginationProps {
  totalCount: number; // 전체 아이템 개수
  currentPage: number; // 현재 페이지 번호
  pageCount: number; // 한 화면에 보여줄 페이지 버튼 개수
  itemCountPerPage: number; // 페이지당 아이템 개수
}

export default function Pagination({
  totalCount,
  currentPage,
  pageCount,
  itemCountPerPage,
}: PaginationProps) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / itemCountPerPage);

  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - Math.floor(pageCount / 2));
  const end = Math.min(totalPages, start + pageCount - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const goToPage = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <nav className={styles.paginationWrapper}>
      {/* 이전 버튼 */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        이전
      </button>

      {/* 페이지 번호 버튼 */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          aria-current={currentPage === p ? "page" : undefined}
          className={`${styles.pageButton} ${
            currentPage === p ? styles.active : ""
          }`}
        >
          {p}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        다음
      </button>
    </nav>
  );
}
