import { useState } from 'react';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import styles from '../styles/login.module.css';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Đăng nhập với:', { email, password, remember });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>

            <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email doanh nghiệp
                    </label>
                    <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu
                    </label>
                    <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 hover:bg-white transition text-gray-800 placeholder-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                        <EyeOff size={20} />
                        ) : (
                        <Eye size={20} />
                        )}
                    </button>
                    </div>
                </div>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between text-sm mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 font-medium">Ghi nhớ phiên đăng nhập</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Quên mật khẩu?
                    </a>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                >
                    Đăng nhập →
                </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
                Chưa có tài khoản?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                Liên hệ quản trị viên
                </a>
            </p>
            <Link href="/index" className= {styles.BackBtn}> Trở về trang chủ </Link>
            </div>
        </div>
        </div>
    );
}