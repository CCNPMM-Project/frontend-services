import api from "./api";

export const createJob = (data) =>
  api.post("/jobs", data, {
    headers: { "Content-Type": "application/json" },
  });

export const getAllJobs = (page = 1, limit = 10) => 
  api.get("/jobs", { params: { page, limit } });

export const searchJobs = (params) => api.get("/jobs/search", { params });

export const getJobById = (id) => api.get(`/jobs/${id}`);

export const getJobsByCompany = (companyId) =>
  api.get(`/jobs/company/${companyId}`);

export const updateJob = (id, data) =>
  api.put(`/jobs/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

export const deleteJob = (id) => api.delete(`/jobs/${id}`);

export const saveJob = (jobId) => api.post(`/jobs/${jobId}/save`);

export const unsaveJob = (jobId) => api.delete(`/jobs/${jobId}/save`);

export const getSavedJobs = (page = 1, limit = 10) => 
  api.get("/jobs/saved", { params: { page, limit } });

export const getViewedJobs = (page = 1, limit = 10) => 
  api.get("/jobs/viewed", { params: { page, limit } });

export const getApplicationCount = (jobId) => 
  api.get(`/jobs/${jobId}/applications/count`);

export const markJobAsViewed = (jobId) => 
  api.post(`/jobs/${jobId}/view`);