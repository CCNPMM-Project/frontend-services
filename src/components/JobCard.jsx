import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  BookmarkIcon,
} from "@heroicons/react/24/solid";
import { saveJob, unsaveJob } from "../services/jobService";

const JobCard = ({ job, onSaveChange }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if job is saved (you might want to get this from props or context)
    setIsSaved(job.isSaved || false);
  }, [job.isSaved]);

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveJob(job.id);
        setIsSaved(false);
        if (onSaveChange) onSaveChange(job.id, false);
      } else {
        await saveJob(job.id);
        setIsSaved(true);
        if (onSaveChange) onSaveChange(job.id, true);
      }
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 hover:scale-[1.02] hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.companyAvatar || "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/logo_default.png"}
            alt={`${job.company} logo`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 dark:border-gray-600 object-cover"
            loading="lazy"
          />
        </div>

        {/* Job Info & Actions */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Job Info */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {job.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Công ty:</span>{" "}
                  {job.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Vị trí:</span>{" "}
                  {job.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Lương:</span>{" "}
                  {job.salary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Loại công việc:</span>{" "}
                  {job.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Ngày đăng:</span>{" "}
                  {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Hạn nộp:</span>{" "}
                  {new Date(job.closingDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
            {/* Tags */}
            {job.tags && (
              <div className="flex gap-2 mt-3">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Deadline Indicator */}
            <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex justify-start">
  Hạn nộp: {new Date(job.closingDate).toLocaleDateString("vi-VN")} (
  {Math.ceil((new Date(job.closingDate) - new Date()) / (1000 * 60 * 60 * 24))} ngày còn lại)
</div>

          </div>

          {/* Actions */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 mt-4 sm:mt-0">
            <button
              onClick={handleSaveJob}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isSaved
                  ? "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <BookmarkIcon className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">
                {isLoading ? "..." : isSaved ? "Đã lưu" : "Lưu"}
              </span>
            </button>
            <button
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-all duration-200"
            >
              <EyeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Xem chi tiết</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobCard);