
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Component Counter để hiển thị animation số
const Counter = ({ end, duration = 2, suffix = "", prefix = "", isInView = false }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;
      
      // Xử lý các trường hợp khác nhau
      let endValue;
      if (end.includes("K+")) {
        endValue = parseInt(end.replace(/[^\d]/g, '')) * 1000; // 10K+ -> 10000
      } else if (end.includes("%")) {
        endValue = parseInt(end.replace(/[^\d]/g, '')); // 98% -> 98
      } else {
        endValue = parseInt(end.replace(/[^\d]/g, ''));
      }

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // Easing function cho animation mượt mà và kéo dài
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, hasAnimated, end, duration]);

  // Format số hiển thị
  const formatNumber = (num) => {
    if (suffix === "K+") {
      return (num / 1000).toFixed(0);
    }
    return num.toLocaleString();
  };

  return (
    <motion.h3 
      className="text-4xl md:text-5xl font-bold mb-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: [0.5, 1.1, 1],
        transition: { duration: 0.6 }
      } : { opacity: 0, scale: 0.5 }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.h3>
  );
};

const ActionSection = ({ user }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Action Cards */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        id="features-section"
        className="max-w-7xl mx-auto py-20 px-4 md:px-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 px-4">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
          Bắt Đầu Hành Trình Của Bạn
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Khám phá những tính năng mạnh mẽ giúp bạn đạt được mục tiêu nghề nghiệp
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <motion.div
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
            }}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {user.role === "candidate" ? "Tìm Việc Làm" : "Đăng Tin Tuyển Dụng"}
            </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {user.role === "candidate"
                  ? "Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và đam mê của bạn. Tìm kiếm thông minh với AI."
                  : "Tìm kiếm ứng viên lý tưởng cho công ty của bạn với quy trình đăng tin dễ dàng và hiệu quả."}
            </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user.role === "candidate" ? "/jobs" : "/post-job")}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {user.role === "candidate" ? "Tìm Việc Ngay" : "Đăng Tin Ngay"}
              </motion.button>
          </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
            }}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ rotate: 5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Quản Lý Hồ Sơ
            </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Cập nhật thông tin cá nhân, theo dõi lịch sử ứng tuyển, hoặc quản lý tin tuyển dụng của bạn một cách thông minh.
            </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Xem Hồ Sơ
              </motion.button>
          </div>
          </motion.div>
        </div>

      {/* Features Showcase */}
        <motion.div variants={itemVariants} className="text-center mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Tại Sao Chọn Jobify?
        </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Những tính năng độc đáo giúp bạn thành công trong hành trình nghề nghiệp
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 px-4">
          {[
            {
              title: "Tìm Việc Thông Minh",
              description: "Công cụ tìm kiếm AI giúp bạn nhanh chóng tìm được công việc phù hợp với kỹ năng và sở thích.",
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
              color: "from-yellow-500 to-orange-500"
            },
            {
              title: "Kết Nối Doanh Nghiệp",
              description: "Doanh nghiệp dễ dàng tìm kiếm ứng viên tài năng với hệ thống quản lý tin tuyển dụng thông minh.",
              icon: "M17 20h5v-2a2 2 0 00-2-2h-3m-8 4H4v-2a2 2 0 012-2h3m-1-4l4-4m0 0l4 4m-4-4v12",
              color: "from-green-500 to-teal-500"
            },
            {
              title: "Hỗ Trợ 24/7",
              description: "Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giải đáp mọi thắc mắc, giúp bạn đạt được mục tiêu nghề nghiệp.",
              icon: "M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586l-5.95 5.95 1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-5.95-5.95z",
              color: "from-blue-500 to-purple-500"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 10 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
              </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white mb-20 mx-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Jobify Trong Số Liệu</h2>
            <p className="text-lg sm:text-xl opacity-90">Những con số ấn tượng về cộng đồng Jobify</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "10K+", label: "Việc Làm Đăng Tải", delay: 0, suffix: "K+" },
              { value: "50K+", label: "Ứng Viên Kết Nối", delay: 0.3, suffix: "K+" },
              { value: "1K+", label: "Nhà Tuyển Dụng", delay: 0.6, suffix: "K+" },
              { value: "98%", label: "Tỷ Lệ Hài Lòng", delay: 0.9, suffix: "%" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: stat.delay }}
              >
                <Counter 
                  end={stat.value} 
                  duration={4}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
                <motion.p 
                  className="text-lg opacity-90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: stat.delay + 0.5 }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
        </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={itemVariants} className="text-center mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Người Dùng Nói Gì Về Jobify
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Những câu chuyện thành công từ cộng đồng Jobify
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20 px-4">
          {[
            {
              name: "Nguyễn Văn A",
              role: "Ứng Viên",
              quote: "Nhờ Jobify, tôi đã tìm được công việc mơ ước chỉ trong một tuần! Giao diện thân thiện và dễ sử dụng.",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              rating: 5
            },
            {
              name: "Trần Thị B",
              role: "Nhà Tuyển Dụng",
              quote: "Jobify giúp tôi tìm được ứng viên phù hợp nhanh chóng. Hệ thống quản lý tin tuyển dụng rất tiện lợi!",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              rating: 5
            },
            {
              name: "Lê Minh C",
              role: "Ứng Viên",
              quote: "Tôi rất ấn tượng với sự hỗ trợ nhiệt tình từ đội ngũ Jobify. Họ luôn sẵn sàng giúp đỡ!",
              avatar: "https://randomuser.me/api/portraits/men/3.jpg",
              rating: 5
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-6">
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action Banner */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-white overflow-hidden mx-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90" />
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32" />
          <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/5 rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24" />
          
          <div className="relative z-10 text-center">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              Sẵn Sàng Tham Gia Jobify?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Đừng bỏ lỡ cơ hội kết nối với công việc mơ ước hoặc ứng viên tài năng. Hãy bắt đầu ngay hôm nay!
            </motion.p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user.role === "candidate" ? "/jobs" : "/post-job")}
              className="bg-yellow-400 text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 w-full sm:w-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {user.role === "candidate" ? "Khám Phá Việc Làm" : "Đăng Tin Tuyển Dụng"}
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default ActionSection;
