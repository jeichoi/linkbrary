import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  //withCredentials: true, //지우니까 됨 => 쿠키 기반 인증이 아니라 JWT(토큰) 기반 인증
  headers: {
    "Content-Type": "application/json",
  },
});

//매번 headers: { Authorization: ... } 안 써도 됨
//Axios에서 요청(request)이나 응답(response)이 
//서버로/서버에서 도착하기 전에 가로채서 가공할 수 있게 해주는 기능

//공통 작업(예: 토큰 추가, 로깅, 에러 처리)을 여기서 처리할 수 있음

//request interceptor 서버로 요청 보내기 전에 실행
//config는 Axios가 실제로 서버에 보낼 요청 정보를 담은 객체
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // 로그인, 회원가입 요청일 경우 Authorization 헤더 제거
  // 1) 로그인, 회원가입 요청이면 Authorization 붙이지 않음
  if (
    config.url?.includes("/auth/sign-in") ||
    config.url?.includes("/auth/sign-up")
  ) {
    return config; // 그대로 서버로 보냄
  }

  // 2) 나머지 요청엔 토큰 붙임
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // 수정된 config 리턴 => 이걸로 서버 요청
});

export default instance;
