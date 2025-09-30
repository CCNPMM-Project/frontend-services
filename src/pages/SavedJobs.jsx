import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { getSavedJobs } from "../services/jobService";

const SavedJobs = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const jobsPerPage = 10;
  const navigate = useNavigate();
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchSavedJobs = useCallback(async (page = 1, reset = false) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await getSavedJobs(page, jobsPerPage);
      if (response.data.success) {
        const formattedJobs = response.data.data.map((job) => ({
          id: job._id,
          title: job.title,
          company: job.company.name,
          location: job.location,
          salary: `${(job.salary.min / 1000000).toFixed(1)}-${(job.salary.max / 1000000).toFixed(1)} triệu`,
          type: job.jobType,
          createdAt: job.createdAt,
          closingDate: job.closingDate,
          companyAvatar: job.company.avatarUrl,
          category: job.category || "",
          experienceLevel: job.experienceLevel || "",
          isSaved: true,
          isViewed: false,
          applicationCount: job.applicationCount || 0,
        }));

        if (reset) {
          setJobs(formattedJobs);
        } else {
          setJobs(prev => [...prev, ...formattedJobs]);
        }
        
        setPagination(response.data.pagination);
        setHasMore(response.data.pagination.hasNext);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      if (reset) {
        setJobs([]);
      }
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [jobsPerPage]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs(1, true);
    }
  }, [user, fetchSavedJobs]);

  const loadMoreJobs = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchSavedJobs(nextPage, false);
    }
  };

  const handleSaveChange = (jobId, isSaved) => {
    if (!isSaved) {
      // If job is unsaved, remove it from the list
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleViewChange = (jobId, isViewed) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, isViewed } : job
      )
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Công Việc Đã Lưu
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Danh sách các công việc bạn đã lưu để xem sau
            </p>
          </div>

          {/* Job Listings */}
          <div>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onSaveChange={handleSaveChange}
                  onViewChange={handleViewChange}
                />
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Chưa có công việc nào được lưu</h3>
                <p>Hãy lưu những công việc bạn quan tâm để xem lại sau này.</p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && jobs.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreJobs}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Đang tải...
                  </>
                ) : (
                  "Tải thêm công việc"
                )}
              </button>
            </div>
          )}

          {/* Loading indicator for initial load */}
          {isLoading && jobs.length === 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedJobs;
