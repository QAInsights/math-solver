import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env": env,
      // Explicitly set process.env.NODE_ENV
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/oauth/token': {
          target: 'https://dev-24.us.auth0.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/oauth\/token/, '/oauth/token'),
        },
      },
    },
    build: {
      outDir: "dist",
    },
    resolve: {
      alias: {
        process: "process/browser",
      },
    },
  };
});
