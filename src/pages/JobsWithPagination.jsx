import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useFilter } from "../contexts/FilterContext";
import { getAllJobs } from "../services/jobService";

const JobsWithPagination = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 10;
  const navigate = useNavigate();
  const { filter } = useFilter();

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

  const fetchJobs = useCallback(async (page = 1) => {
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
          isSaved: false,
        }));

        setJobs(formattedJobs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [jobsPerPage]);

  useEffect(() => {
    if (user) {
      fetchJobs(currentPage);
    }
  }, [user, currentPage, fetchJobs]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSaveChange = (jobId, isSaved) => {
    setJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, isSaved } : job
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
            {isLoading ? (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onSaveChange={handleSaveChange}
                />
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Không tìm thấy công việc nào</h3>
                <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default JobsWithPagination;
