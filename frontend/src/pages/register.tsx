import { useState } from "react";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import styles from "../styles/login.module.css"; // Có thể đổi tên thành register.module.css nếu bạn muốn thay đổi style
// import { registerUser } from "@/services/warrantyApi"; // Tạm thời comment, bạn sẽ cần tạo hàm này sau
import { useRouter } from "next/router";

// Tùy chọn: Import kiểu cho hàm đăng ký nếu bạn đã có
// import { RegisterRequest } from "@/types/warranty";
// import axios from "axios"; 

export default function Register() {
  // State cho các trường input
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State giao diện
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Thêm state thông báo thành công

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // 1. Xác thực phía client (Client-side Validation)
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    if (username.length < 5 || password.length < 6) {
      setError("Tên đăng nhập phải ít nhất 5 ký tự và Mật khẩu phải ít nhất 6 ký tự.");
      setLoading(false);
      return;
    }

    // 2. Gọi API đăng ký (BƯỚC NÀY CẦN BẠN TẠO HÀM `registerUser` TRONG `warrantyApi.ts`)
    try {
      // Ví dụ: Giả định bạn có hàm registerUser
      // await registerUser({ fullName, username, password });

      // Nếu thành công:
      setSuccess("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err) {
      // Xử lý lỗi API tương tự như file đăng nhập
      let errorMessage = "Lỗi đăng ký không xác định.";

      // if (axios.isAxiosError(err) && err.response) {
      //   const apiError = err.response.data as { message: string };
      //   errorMessage = apiError.message || errorMessage;
      // } else if (err instanceof Error) {
      //   errorMessage = err.message;
      // }

      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h1>
          
          {/* Hiển thị thông báo Lỗi */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Hiển thị thông báo Thành công */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Tên đầy đủ */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đầy đủ
              </label>
              <input
                type="text"
                placeholder=""
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Tên đăng nhập */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đăng nhập (Email hoặc Tên viết tắt)
              </label>
              <input
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Mật khẩu */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Xác nhận Mật khẩu */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>


            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
             className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
             text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg 
             disabled:opacity-50 disabled:cursor-not-allowed"
>
              {loading ? "Đang đăng ký..." : "Đăng ký →"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Đăng nhập ngay
            </Link>
          </p>
          <Link href="/" className={styles.BackBtn}>
            {" "}
            Trở về trang chủ{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}