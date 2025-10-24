import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatsService from '../services/statsService';
import { ArrowLeftIcon, ChartBarIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const JobStats = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [jobId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await StatsService.getJobStats(jobId);
      setStats(response.data);
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi lấy thống kê');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  // Function to get chart colors based on theme
  const getChartColors = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      return {
        grid: '#374151',
        text: '#D1D5DB',
        line: '#60A5FA',
        bar: '#34D399',
        pie: ['#F59E0B', '#10B981', '#EF4444']
      };
    }
    return {
      grid: '#E5E7EB',
      text: '#374151',
      line: '#3B82F6',
      bar: '#10B981',
      pie: ['#F59E0B', '#10B981', '#EF4444']
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lỗi tải thống kê</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không có dữ liệu thống kê</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Chưa có dữ liệu thống kê cho công việc này</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const { job, basicStats, chartData } = stats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Thống kê công việc
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-1">{job.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">Công ty: {job.company}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng đơn ứng tuyển</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{basicStats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <ChartBarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Đang chờ</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{basicStats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Được chấp nhận</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{basicStats.acceptedApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <EyeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{basicStats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Application Status Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Phân bố trạng thái đơn ứng tuyển</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Đang chờ', value: basicStats.pendingApplications, color: getChartColors().pie[0] },
                    { name: 'Được chấp nhận', value: basicStats.acceptedApplications, color: getChartColors().pie[1] },
                    { name: 'Bị từ chối', value: basicStats.rejectedApplications, color: getChartColors().pie[2] }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Đang chờ', value: basicStats.pendingApplications, color: getChartColors().pie[0] },
                    { name: 'Được chấp nhận', value: basicStats.acceptedApplications, color: getChartColors().pie[1] },
                    { name: 'Bị từ chối', value: basicStats.rejectedApplications, color: getChartColors().pie[2] }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                    border: document.documentElement.classList.contains('dark') ? '1px solid #374151' : '1px solid #E5E7EB',
                    color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Acceptance Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tỷ lệ chấp nhận</h3>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {basicStats.acceptanceRate}%
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {basicStats.acceptedApplications} / {basicStats.totalApplications} đơn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Timeline Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biểu đồ đơn ứng tuyển theo thời gian</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.applicationTimeline}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={getChartColors().grid}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: getChartColors().text }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: getChartColors().text }}
              />
              <Tooltip 
                labelFormatter={(value) => `Ngày: ${value}`}
                formatter={(value, name) => [value, 'Số đơn ứng tuyển']}
                contentStyle={{
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                  border: document.documentElement.classList.contains('dark') ? '1px solid #374151' : '1px solid #E5E7EB',
                  color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke={getChartColors().line} 
                strokeWidth={2}
                dot={{ fill: getChartColors().line, strokeWidth: 2, r: 4 }}
                name="Đơn ứng tuyển"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* View Timeline Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biểu đồ lượt xem theo thời gian</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.viewTimeline}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={getChartColors().grid}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: getChartColors().text }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: getChartColors().text }}
              />
              <Tooltip 
                labelFormatter={(value) => `Ngày: ${value}`}
                formatter={(value, name) => [value, 'Lượt xem']}
                contentStyle={{
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
                  border: document.documentElement.classList.contains('dark') ? '1px solid #374151' : '1px solid #E5E7EB',
                  color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151'
                }}
              />
              <Legend />
              <Bar 
                dataKey="views" 
                fill={getChartColors().bar}
                name="Lượt xem"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default JobStats;
