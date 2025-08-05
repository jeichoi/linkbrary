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
import LinkCardMenu from "@/components/LinkCardMenu";
import { setAddFolderCallback } from "@/lib/modalCallback";
import { setAddLinkCallback } from "@/lib/modalCallback";
import { FiPlus } from "react-icons/fi";
import styles from "./page.module.css";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import { setDeleteLinkCallback } from "@/lib/modalCallback";
import { setEditLinkCallback } from "@/lib/modalCallback";
import { setDeleteFolderCallback } from "@/lib/modalCallback";
import { setEditFolderCallback } from "@/lib/modalCallback";

export default function Linklist() {
  const { user } = useAuth(true);
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [allLinkCount, setAllLinkCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam && parseInt(pageParam) > 0 ? parseInt(pageParam) : 1;
  const itemCountPerPage = 9;

  const [selectedFolderId, setSelectedFolderId] = useState<number>(0);

  // 폴더 추가 모달 열기
  const openAddFolderModal = () => {
    // 콜백을 등록해둠
    // 부모의 상태를 업데이트하는 콜백을 저장소에 등록
    // 폴더 새로 등록 후 즉시 화면에 표시하기 위해

    setAddFolderCallback((newFolder: Folder) => {
      setFolders((prev) => [{ ...newFolder, linkCount: 0 }, ...prev]); // linkCount 기본값 명시 // 화면에 즉시 추가
      setSelectedFolderId(newFolder.id); // 폴더 추가 후 해당 폴더 선택되게 설정
    });

    router.push("/linklist/add-folder");
  };

  // 폴더 수정 모달 열기
  const openEditFolderModal = (id: number) => {
    // 폴더 수정 콜백 등록 (매번 새로 등록해야 함)
    setEditFolderCallback((updatedFolder: Folder) => {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === updatedFolder.id
            ? { ...folder, name: updatedFolder.name }
            : folder
        )
      );
      getFolders();
    });

    router.push(`/linklist/edit-folder?id=${id}`);
  };

  // 폴더 삭제 모달 열기
  const openDeleteFolderModal = (id: number) => {
    setDeleteFolderCallback((deletedId: number) => {
      setFolders((prev) => prev.filter((folder) => folder.id !== deletedId));
      setSelectedFolderId((current) => (current === deletedId ? 0 : current));
    });

    router.push(`/linklist/delete-folder?id=${id}`);
  };

  // 링크 수정 모달 열기
  const openEditLinkModal = (id: number) => {
    setEditLinkCallback((updatedLink: LinkType) => {
      setLinks((prev) =>
        prev.map((link) => (link.id === updatedLink.id ? updatedLink : link))
      );
    });
    router.push(`/linklist/edit-link?id=${id}`);
  };

  // 링크 삭제 모달 열기
  const openDeleteLinkModal = (id: number) => {
    router.push(`/linklist/delete-link?id=${id}`);
  };

  const getAllLinkCount = async () => {
    try {
      //list는 pageSize=1이라서 링크 1개만 응답됨 → 데이터량 최소화
      const res = await axios.get<{ totalCount: number; list: LinkType[] }>(
        `/links?page=1&pageSize=1`
      );
      setAllLinkCount(res.data.totalCount);
    } catch (err) {
      console.error("전체 링크 수 가져오기 실패", err);
    }
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
    let res;
      if (selectedFolderId === 0) {
        // 전체 링크 가져오기
        res = await axios.get<{ totalCount: number; list: LinkType[] }>(
          `/links?page=${page}&pageSize=${itemCountPerPage}`
        );
        setLinks(res.data.list);
        setTotalCount(res.data.totalCount);
        setAllLinkCount(res.data.totalCount);
      } else {
        // 선택된 폴더의 링크 가져오기
        res = await axios.get<{ totalCount: number; list: LinkType[] }>(
          `/folders/${selectedFolderId}/links?page=${page}&pageSize=${itemCountPerPage}`
        );

        // ✅ 페이지 유효성 검사
        const maxPage = Math.ceil(res.data.totalCount / itemCountPerPage);
        if (page > maxPage && maxPage > 0) {
          router.push(`/linklist`);
          return;
        }

        setLinks(res.data.list);
        setTotalCount(res.data.totalCount);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setLinks([]);
        //setAllLinkCount();
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
    } else {
      //router.push("/login");
    }
  }, [user, page, selectedFolderId]); //page 바뀔 때마다 재요청

  //링크 추가 모달에서 새 링크를 등록한 후,
  //그 정보를 이 Linklist 페이지에서 실시간으로 반영하기 위해
  useEffect(() => {
    //이 콜백은 새 링크가 생성됐을 때 실행됩니다.
    setAddLinkCallback((newLink: LinkType) => {
      setLinks((prev) => [newLink, ...prev]);
      getFolders();
      getLinks();
    });
    setDeleteLinkCallback((linkid: number) => {
      setLinks((prev) => prev.filter((link) => link.id !== linkid));
      getFolders();
      getLinks();
      getAllLinkCount();
    });
  }, [links]);

  if (!user) return <div>로그인 정보 없음</div>;

  // 필터링된 링크 계산
  const filteredLinks = links;

  // "전체" 폴더 객체 생성
  const allFolder: Folder = {
    id: 0,
    name: "전체",
    linkCount: allLinkCount,
  };

  // 선택된 폴더 가져오기
  const selectedFolder =
    selectedFolderId === 0
      ? allFolder
      : folders.find((folder) => folder.id === selectedFolderId);

  return (
    <section className={styles.folderWrapper}>
      <div className={styles.folderListWrapper}>
        {/* 폴더 리스트 */}
        <div className={styles.folderListInnerWrapper}>
          {folders.length === 0 ? (
            <p>폴더가 없습니다.</p>
          ) : (
            <div>
              {[allFolder, ...folders].map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  isActive={selectedFolderId === folder.id}
                  onFolderClick={(f) => {
                    setSelectedFolderId(f.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {/* 폴더 추가 모달 */}
        <Button
          onClick={() => openAddFolderModal()}
          className={styles.addFolderButton}
        >
          <FiPlus />
          폴더 추가하기
        </Button>
      </div>

      {/* 링크 리스트 */}
      <section className={styles.linkWrapper}>
        <div className={styles.linkTitleWrapper}>
          <div className={styles.linkTitleLeft}>
            <h2>{selectedFolder?.name ?? "폴더 없음"}</h2>
            {selectedFolder?.id !== 0 && (
              <Image
                src="/images/pencil.png"
                alt="연필 아이콘"
                width={40}
                height={40}
                className={styles.editFolder}
                onClick={() =>
                  selectedFolder?.id && openEditFolderModal(selectedFolder.id)
                }
              />
            )}
          </div>
          {selectedFolder?.id === 0 ? (
            <div></div>
          ) : (
            <Image
              src="/images/Frame.png"
              alt="deleteFolder"
              width={24}
              height={24}
              className={styles.deleteFolder}
              onClick={() =>
                selectedFolder?.id && openDeleteFolderModal(selectedFolder.id)
              }
            />
          )}
        </div>
        {filteredLinks.length === 0 ? (
          <p>링크가 없습니다.</p>
        ) : (
          <ul>
            {filteredLinks.map((link) => {
              //날짜
              const timeAgo = dayjs(link.createdAt).fromNow(); // 상대 시간
              const createdAt = dayjs(link.createdAt).format("YYYY. M. D"); // 절대 시간

              return (
                <li key={link.id}>
                  <img
                    src={
                      link.imageSource &&
                      (link.imageSource.includes(".png") ||
                        (link.imageSource.startsWith("http") &&
                          !link.imageSource.includes(".jpg")))
                        ? link.imageSource
                        : "/images/no.png"
                    }
                    alt={link.title}
                    width={50}
                    className={styles.linkImg}
                  />
                  <div className={styles.linkContents}>
                    <div className={styles.linkContentsTop}>
                      <p className={styles.gray}>{timeAgo}</p>

                      {/* 링크삭제/수정 */}
                      <LinkCardMenu
                        onEdit={() => openEditLinkModal(link.id)}
                        onDelete={() => openDeleteLinkModal(link.id)}
                      />
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.title}
                    >
                      {link.title}
                    </a>
                    <p className={styles.description}>{link.description}</p>
                    <p className={styles.gray}>{createdAt}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Pagination
        totalCount={totalCount}
        currentPage={page}
        pageCount={10}
        itemCountPerPage={itemCountPerPage}
      />
    </section>
  );
}
