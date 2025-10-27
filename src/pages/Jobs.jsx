import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import { useFilter } from "../contexts/FilterContext";
import { getAllJobs } from "../services/jobService";

const Jobs = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const jobsPerPage = 10;
  const navigate = useNavigate();
  const { filter } = useFilter();
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

  const fetchJobs = useCallback(async (page = 1, reset = false) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await getAllJobs(page, jobsPerPage);
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
          isSaved: false, // This will be updated when we check saved jobs
          isViewed: false, // This will be updated when we check viewed jobs
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
      console.error("Error fetching jobs:", error);
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
      fetchJobs(1, true);
    }
  }, [user]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, true);
  };

  const loadMoreJobs = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchJobs(nextPage, false);
    }
  };

  const handleSaveChange = (jobId, isSaved) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, isSaved } : job
      )
    );
  };

  const handleViewChange = (jobId, isViewed) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, isViewed } : job
      )
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const keyword = filter.keyword || "";
    const location = filter.location || "";
    const category = filter.category || "";
    const type = filter.type || "";
    const experienceLevel = filter.experienceLevel || "";
    const salaryRange = filter.salaryRange || "";

    let salaryMatch = true;
    if (salaryRange) {
      const [filterMin, filterMax] = salaryRange
        .split("-")
        .map((val) => parseInt(val || "999999999"));
      const [jobSalaryMin, jobSalaryMax] = job.salary
        .replace(" triệu", "")
        .split("-")
        .map((val) => parseFloat(val) * 1000000);
      salaryMatch = jobSalaryMin >= filterMin && jobSalaryMax <= filterMax;
    }

    return (
      job.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (location === "" || job.location === location) &&
      (category === "" || job.category === category) &&
      (type === "" || job.type === type) &&
      (experienceLevel === "" || job.experienceLevel === experienceLevel) &&
      salaryMatch
    );
  });

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

          {/* Search and Filters */}
          <SearchBar onSearch={handleSearch} />
          {/* Job Listings */}
          <div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveChange={handleSaveChange}
                  onViewChange={handleViewChange}
                />
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Không tìm thấy công việc nào.
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && filteredJobs.length > 0 && (
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
          {isLoading && filteredJobs.length === 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Jobs;