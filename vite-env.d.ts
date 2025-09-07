/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REPLICATE_API_TOKEN: string;
  // tambahkan env lain kalau perlu
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
