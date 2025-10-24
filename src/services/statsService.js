import api from './api';

class StatsService {
  // Lấy thống kê của một job
  static async getJobStats(jobId) {
    try {
      const response = await api.get(`/stats/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy thống kê job:', error);
      throw error;
    }
  }

  // Cập nhật thống kê cho một job
  static async updateJobStats(jobId) {
    try {
      const response = await api.put(`/stats/job/${jobId}/update`);
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật thống kê job:', error);
      throw error;
    }
  }

  // Lấy thống kê của tất cả jobs của user
  static async getAllJobStats() {
    try {
      const response = await api.get('/stats/jobs');
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy thống kê tất cả jobs:', error);
      throw error;
    }
  }

  // Tăng lượt xem job (public endpoint)
  static async incrementJobViews(jobId) {
    try {
      const response = await api.post(`/stats/job/${jobId}/view`);
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật lượt xem job:', error);
      throw error;
    }
  }
}

export default StatsService;
