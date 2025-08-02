"use client";

import axios from "@/lib/axios";
import { Link as LinkType } from "@/types/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) return;
    setLoading(true);

    axios
      .get<{ list: LinkType[] }>(`/links?search=${search}`)
      .then((res) => setLinks(res.data.list))
      .catch((err) => console.error("검색 실패", err))
      .finally(() => setLoading(false));
  }, [search]);

  if (!search) return <p>검색어를 입력해주세요.</p>;
  if (loading) return <p>검색 중...</p>;

  return (
    <div>
      {links.length === 0 ? (
        <p>{search ? "검색 결과가 없습니다." : "검색어를 입력해주세요."}</p>
      ) : (
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <img src={link.imageSource} alt={link.title} width={50} />
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
              <p>{link.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
