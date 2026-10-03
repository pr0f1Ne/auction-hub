/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  // Khai báo thêm các biến môi trường VITE_ khác của bạn ở đây...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}