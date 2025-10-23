import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../../context/AuthContext"; // Import AuthProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Bọc Component bằng AuthProvider
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}