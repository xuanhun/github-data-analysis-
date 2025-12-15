import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import additionBuildPlugin from "./plugins/additionBuildPlugin";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), additionBuildPlugin()],
  server: {
    host: "0.0.0.0",
    https: (() => {
      // 尝试加载证书文件，如果不存在则使用自签名证书
      const certPath = process.env.SSL_CERT_PATH || path.resolve(__dirname, "certs/server.crt");
      const keyPath = process.env.SSL_KEY_PATH || path.resolve(__dirname, "certs/server.key");
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        return {
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        };
      }
      // 如果没有证书文件，使用自签名证书（仅用于开发）
      return true;
    })(),
  },
});
