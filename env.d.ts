/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_API_BASE: string;
  readonly VITE_IMG_PRE_PATH: string;
  // 更多环境变量...
}
