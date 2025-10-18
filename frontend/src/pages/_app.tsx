import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Bọc toàn bộ ứng dụng bằng AuthProvider
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}