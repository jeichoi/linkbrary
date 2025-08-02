"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useState, useEffect } from "react";
import { Folder } from "@/types/folder";
import { Link as LinkType } from "@/types/link";
import FolderCard from "@/components/FolderCard";
import Pagination from "@/components/Pagination";
import axios from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { setAddFolderCallback } from "@/lib/modalCallback";
import { setAddLinkCallback } from "@/lib/modalCallback";

export default function Linklist() {
  const { user } = useAuth();
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam && parseInt(pageParam) > 0 ? parseInt(pageParam) : 1;
  const pageCount = 5;

  // 폴더 모달 열기
  const openAddFolderModal = () => {
    // 콜백을 등록해둠
    // 부모의 상태를 업데이트하는 콜백을 저장소에 등록
    // 폴더 새로 등록 후 즉시 화면에 표시하기 위해 
    setAddFolderCallback((newFolder: Folder) => {
      setFolders((prev) => [newFolder, ...prev]); // 화면에 즉시 추가
    });

    router.push("/linklist/add-folder");
  };

  // 폴더 가져오기
  const getFolders = async () => {
    try {
      const res = await axios.get<Folder[]>("/folders");
      setFolders(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setFolders([]);
      } else {
        console.error("폴더 가져오기 에러", err);
      }
    }
  };

  // 링크 가져오기
  const getLinks = async () => {
    try {
      const res = await axios.get<{ totalCount: number; list: LinkType[] }>(
        `/links?page=${page}&pageSize=${pageCount}`
      );
      setLinks(res.data.list);
      setTotalCount(res.data.totalCount);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setLinks([]);
      } else {
        console.error("링크 가져오기 에러", err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      getFolders();
      getLinks();
      // window.scrollTo(0, 0);
    }
  }, [user, page]); //page 바뀔 때마다 재요청

  //링크 추가 모달에서 새 링크를 등록한 후, 
  //그 정보를 이 Linklist 페이지에서 실시간으로 반영하기 위해
  useEffect(() => {
    //이 콜백은 새 링크가 생성됐을 때 실행됩니다.
    setAddLinkCallback((newLink: LinkType) => {
      setLinks((prev) => [newLink, ...prev]);
    });
  }, []);

  if (!user) return <div>로그인 정보 없음</div>;

  return (
    <div>
      {/* 폴더 리스트 */}
      <div>
        {folders.length === 0 ? (
          <p>폴더가 없습니다.</p>
        ) : (
          <div>
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onFolderClick={(f) => console.log(`${f.name} 클릭됨`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 폴더 추가 모달 */}
      <button onClick={() => openAddFolderModal()}>폴더 모달 열기</button>

      {/* 링크 리스트 */}
      <div>
        {links.length === 0 ? (
          <p>링크가 없습니다.</p>
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

      <Pagination
        totalCount={totalCount}
        currentPage={page}
        pageCount={pageCount}
        itemCountPerPage={5}
      />
    </div>
  );
}
