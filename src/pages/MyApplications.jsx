import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import { getMyApplications } from "../services/applicationService";
import { getJobById } from "../services/jobService";
import Alert from "../components/ui/Alert";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const MyApplications = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const fetchApplications = async () => {
          try {
            const response = await getMyApplications();
            if (response.data.success) {
              const enrichedApplications = await Promise.all(
                response.data.data.map(async (app) => {
                  try {
                    const jobResponse = await getJobById(app.job);
                    return {
                      ...app,
                      jobDetails: jobResponse.data.success ? jobResponse.data.data : null,
                    };
                  } catch (error) {
                    console.error(`Lỗi khi lấy chi tiết công việc ${app.job}:`, error);
                    return { ...app, jobDetails: null };
                  }
                })
              );
              setApplications(enrichedApplications);
            } else {
              setAlert({
                show: true,
                message: "Không tìm thấy đơn ứng tuyển nào!",
                type: "error",
              });
            }
          } catch (err) {
            setAlert({
              show: true,
              message: err.response?.data?.message || "Lỗi khi tải danh sách đơn ứng tuyển!",
              type: "error",
            });
          } finally {
            setIsLoading(false);
          }
        };

        fetchApplications();
      } catch (err) {
        console.error("Lỗi phân tích user từ localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case "pending":
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">

            {alert.show && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: "", type: "success" })}
              />
            )}

            {applications.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Bạn chưa ứng tuyển công việc nào.{" "}
                <Button
                  onClick={() => navigate("/jobs")}
                  className="text-green-500 hover:underline"
                >
                  Tìm việc ngay
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                      <th className="py-3 px-4 text-left">Công Việc</th>
                      <th className="py-3 px-4 text-left">Ngày Nộp</th>
                      <th className="py-3 px-4 text-left">Trạng Thái</th>
                      <th className="py-3 px-4 text-left">Hồ Sơ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr
                        key={application._id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                          {application.jobDetails ? (
                            <Link
                              to={`/jobs/${application.job}`}
                              className="text-green-500 hover:text-green-600 flex items-center"
                            >
                              <EyeIcon className="w-5 h-5 mr-1" />
                              Xem công việc
                            </Link>
                          ) : (
                            "Công việc không khả dụng"
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(application.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                              application.status
                            )}`}
                          >
                            {getStatusIcon(application.status)}
                            <span className="ml-1">
                              {application.status === "accepted"
                                ? "Được chấp nhận"
                                : application.status === "rejected"
                                ? "Bị từ chối"
                                : "Đang chờ"}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to="/view-resume"
                            state={{ resumeUrl: application.applicant.resumeUrl }}
                            className="text-green-500 hover:text-green-600 flex items-center"
                          >
                            <DocumentTextIcon className="w-5 h-5 mr-1" />
                            Xem CV
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default MyApplications;