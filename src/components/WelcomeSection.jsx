
import React, { useEffect, useRef } from "react";

const WelcomeSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
<section
  ref={sectionRef}
  className="w-full max-w-7xl mx-auto h-[500px] rounded-[40px] flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 text-white overflow-hidden opacity-0 relative"
>

      {/* Background Video */}
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Khám phá <span className="text-yellow-300">Jobify</span> - Nơi Kết Nối Ước Mơ Nghề Nghiệp!
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-10">
          Tìm việc làm phù hợp, đăng tin tuyển dụng dễ dàng, và xây dựng sự nghiệp mơ ước với Jobify. Hàng ngàn cơ hội đang chờ bạn!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/jobs"
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 transition duration-300"
          >
            Tìm Việc Ngay
          </a>
          <a
            href="/post-job"
            className=" bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 focus:ring-4 focus:ring-white transition duration-300"
          >
            Đăng Tin Tuyển Dụng
          </a>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 animate-bounce cursor-pointer" onClick={() => {
  const el = document.getElementById("job-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}}>
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
  </svg>
</div>
    </section>
  );
};

// Custom animation keyframes
const styles = `
  @keyframes slideIn {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in {
    animation: slideIn 0.8s ease-out forwards;
  }
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default WelcomeSection;
