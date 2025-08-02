import { Folder } from "@/types/folder";
import { Link } from "@/types/link";

//콜백저장소(callback store) 역할을 하는 모듈인데, 
// props를 직접 전달할 수 없는 상황(예: Next.js 라우팅 기반 모달 구조)에서 
// 부모 컴포넌트의 함수를 임시로 저장했다가 나중에 실행하기 위해 쓰는 방식


//콜백을 저장할 변수-
//부모가 폴더 추가 시 실행할 함수를 미리 callbackStore에 "저장"해 두고,
//모달이 폴더를 추가했을 때 그 함수를 꺼내 실행한다.
let addFolderCallback: ((folder: Folder) => void) | null = null; // | Union Type


//부모 컴포넌트에서 콜백을 등록하는 함수
//부모가 자기 내부에서 setFolders 같은 state 업데이트 함수를 감싼 콜백을 만들어서 
//이 함수에 전달하면, addFolderCallback에 저장됨
export const setAddFolderCallback = (cb: (folder: Folder) => void) => {
  addFolderCallback = cb;
};


//모달 컴포넌트에서 실제로 콜백을 실행할 때 쓰는 함수
//파라미터로 새로 만든 folder를 전달하면, 부모에 저장된 콜백이 실행
export const runAddFolderCallback = (folder: Folder) => {
  if (addFolderCallback) {
    addFolderCallback(folder);
    addFolderCallback = null; // 1회성으로만 실행
    //실행 후 addFolderCallback = null로 초기화하는 이유-
    //메모리에 콜백이 남아 불필요하게 실행되는 걸 방지하기 위해
    //특히 모달이 여러 번 열리고 닫힐 때, 중복 실행 방지
  }
};



// ---- Link ----
let addLinkCallback: ((link: Link) => void) | null = null;

export function setAddLinkCallback(cb: (link: Link) => void) {
  addLinkCallback = cb;
}

export function runAddLinkCallback(link: Link) {
  if (addLinkCallback) addLinkCallback(link);
  addLinkCallback = null; // 실행 후 초기화
}



