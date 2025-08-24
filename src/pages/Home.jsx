import React from "react";
import { Link } from "react-router-dom";
import { ChatBubbleLeftRightIcon, UsersIcon, PhoneIcon } from "@heroicons/react/24/outline";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">ZaloUTE</h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Đăng nhập
          </Link>
          <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Đăng ký
          </Link>
          <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
            Hồ sơ
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Chào mừng đến với <span className="text-blue-600 dark:text-blue-400">ZaloUTE</span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Ứng dụng nhắn tin và kết nối sinh viên Trường Đại học Sư phạm Kỹ thuật. 
          Trò chuyện, chia sẻ và học tập cùng nhau dễ dàng hơn.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Bắt đầu ngay
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-400 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Đăng nhập
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-6 pb-20 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-blue-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Nhắn tin</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Trò chuyện nhanh chóng, gửi ảnh, file dễ dàng.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <UsersIcon className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Nhóm học tập</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Tạo nhóm để thảo luận và chia sẻ tài liệu.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
          <PhoneIcon className="h-12 w-12 text-purple-500 mx-auto" />
          <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Gọi thoại & video</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Kết nối với bạn bè qua các cuộc gọi HD.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
