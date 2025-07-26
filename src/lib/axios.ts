import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  //withCredentials: true, //이거 지우니까 됨
  headers: {
    "Content-Type": "application/json",
  },
});

//인스턴스 설정할 때 자동으로 토큰 붙이기
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
