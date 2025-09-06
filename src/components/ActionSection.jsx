
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ActionSection = ({ user }) => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 mt-10">
      {/* Action Cards */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        id="job-section"
        className="max-w-7xl mx-auto py-16 px-4 md:px-8 opacity-0 "
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 mt-10">
          Bắt Đầu Hành Trình Của Bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {user.role === "candidate" ? "Tìm Việc Làm" : "Đăng Tin Tuyển Dụng"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {user.role === "candidate"
                ? "Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và đam mê của bạn."
                : "Tìm kiếm ứng viên lý tưởng cho công ty của bạn với quy trình đăng tin dễ dàng."}
            </p>
            <button
              onClick={() => navigate(user.role === "candidate" ? "/jobs" : "/post-job")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold"
            >
              {user.role === "candidate" ? "Tìm Việc Ngay" : "Đăng Tin Ngay"}
            </button>
          </div>
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Quản Lý Hồ Sơ
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cập nhật thông tin cá nhân, theo dõi lịch sử ứng tuyển, hoặc quản lý tin tuyển dụng của bạn.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold"
            >
              Xem Hồ Sơ
            </button>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="max-w-7xl mx-auto py-16 px-4 md:px-8 opacity-0"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
          Tại Sao Chọn Jobify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Tìm Việc Dễ Dàng",
              description: "Công cụ tìm kiếm mạnh mẽ giúp bạn nhanh chóng tìm được công việc phù hợp với kỹ năng và sở thích.",
              icon: "M12 8v4l4 4m-4-8v-4m-4 4H4m12 0h4",
            },
            {
              title: "Kết Nối Doanh Nghiệp",
              description: "Doanh nghiệp dễ dàng tìm kiếm ứng viên tài năng với hệ thống quản lý tin tuyển dụng thông minh.",
              icon: "M17 20h5v-2a2 2 0 00-2-2h-3m-8 4H4v-2a2 2 0 012-2h3m-1-4l4-4m0 0l4 4m-4-4v12",
            },
            {
              title: "Hỗ Trợ 24/7",
              description: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc, giúp bạn đạt được mục tiêu nghề nghiệp.",
              icon: "M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586l-5.95 5.95 1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-5.95-5.95z",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition duration-300"
            >
              <svg
                className="w-12 h-12 text-green-600 dark:text-green-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={feature.icon}></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-white dark:bg-gray-800 rounded-t-3xl opacity-0"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
          Jobify Trong Số Liệu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Việc Làm Đăng Tải" },
            { value: "50K+", label: "Ứng Viên Kết Nối" },
            { value: "1K+", label: "Nhà Tuyển Dụng" },
            { value: "98%", label: "Tỷ Lệ Hài Lòng" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="max-w-7xl mx-auto py-16 px-4 md:px-8 opacity-0"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
          Người Dùng Nói Gì Về Jobify
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Nguyễn Văn A",
              role: "Ứng Viên",
              quote: "Nhờ Jobify, tôi đã tìm được công việc mơ ước chỉ trong một tuần! Giao diện thân thiện và dễ sử dụng.",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
              name: "Trần Thị B",
              role: "Nhà Tuyển Dụng",
              quote: "Jobify giúp tôi tìm được ứng viên phù hợp nhanh chóng. Hệ thống quản lý tin tuyển dụng rất tiện lợi!",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            {
              name: "Lê Minh C",
              role: "Ứng Viên",
              quote: "Tôi rất ấn tượng với sự hỗ trợ nhiệt tình từ đội ngũ Jobify. Họ luôn sẵn sàng giúp đỡ!",
              avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-3xl mx-4 opacity-0"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Sẵn Sàng Tham Gia Jobify?
        </h2>
        <p className="text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
          Đừng bỏ lỡ cơ hội kết nối với công việc mơ ước hoặc ứng viên tài năng. Hãy bắt đầu ngay hôm nay!
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate(user.role === "candidate" ? "/jobs" : "/post-job")}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 transition duration-300"
          >
            {user.role === "candidate" ? "Khám Phá Việc Làm" : "Đăng Tin Tuyển Dụng"}
          </button>
        </div>
      </section>

    </div>
  );
};

// Reuse animation keyframes
const styles = `
  @keyframes slideIn {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in {
    animation: slideIn 0.8s ease-out forwards;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ActionSection;
