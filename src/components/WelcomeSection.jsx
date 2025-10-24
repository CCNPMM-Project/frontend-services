
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeSection = ({ user }) => {
  const navigate = useNavigate();

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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(34, 197, 94, 0.9), rgba(20, 184, 166, 0.9))",
              "linear-gradient(135deg, rgba(20, 184, 166, 0.9), rgba(59, 130, 246, 0.9))",
              "linear-gradient(225deg, rgba(59, 130, 246, 0.9), rgba(34, 197, 94, 0.9))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-40 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"
          transition={{ delay: 1 }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-lg"
          transition={{ delay: 2 }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-40 right-1/3 w-24 h-24 bg-teal-300/20 rounded-full blur-xl"
          transition={{ delay: 3 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
        <motion.div variants={itemVariants}>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Khám phá{" "}
            <motion.span 
              className="text-yellow-300 relative inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.5)",
                  "0 0 40px rgba(251, 191, 36, 0.8)",
                  "0 0 20px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Jobify
            </motion.span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl">Nơi Kết Nối Ước Mơ Nghề Nghiệp!</span>
          </motion.h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto mb-12 text-white/90 leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Tìm việc làm phù hợp, đăng tin tuyển dụng dễ dàng, và xây dựng sự nghiệp mơ ước với Jobify. 
            <br className="hidden sm:block" />
            Hàng ngàn cơ hội đang chờ bạn!
          </motion.p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/jobs")}
            className="group relative bg-yellow-400 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg overflow-hidden w-full sm:w-auto"
          >
            <motion.div
              className="absolute inset-0 bg-yellow-300"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Tìm Việc Ngay
              <motion.svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/post-job")}
            className="group bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              Đăng Tin Tuyển Dụng
              <motion.svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </motion.svg>
            </span>
          </motion.button>
        </motion.div>

        {/* User Welcome Message */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md mx-auto"
        >
          <p className="text-white/90 text-sm">
            Chào mừng trở lại, <span className="font-semibold text-yellow-300">{user?.name}</span>! 
            {user?.role === "candidate" ? " Hãy khám phá những cơ hội việc làm mới nhất." : " Quản lý tin tuyển dụng của bạn."}
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => {
          const el = document.getElementById("features-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
        >
          <motion.svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default WelcomeSection;
