/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_DEV: string;
  readonly VITE_API_GATEWAY_PROD: string;
  readonly VITE_API_GATEWAY: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
