import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Bind to IPv4 so the printed URL works reliably in browsers (localhost → ::1 can fail on Windows).
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    open: true,
  },
});
