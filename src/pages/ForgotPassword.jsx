import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { forgotPassword, resetPassword } from "../services/authService";
import Modal from "../components/ui/Modal";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: "" });
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { email } = formData;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAlert({ show: true, type: "error", message: "Định dạng email không hợp lệ." });
            setIsLoading(false);
            return;
        }

        try {
            const response = await forgotPassword({ email });
            setAlert({
                show: true,
                type: "success",
                message: response.data.message || "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email."
            });
            setIsOtpModalOpen(true);
        } catch (error) {
            console.error("Error:", error);
            setAlert({
                show: true,
                type: "error",
                message: error.response?.data?.message || "Không thể gửi mã OTP, vui lòng thử lại."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            setAlert({ show: true, type: "error", message: "Mật khẩu phải dài ít nhất 6 ký tự." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setAlert({ show: true, type: "error", message: "Mật khẩu không khớp." });
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPassword({ 
                email: formData.email, 
                otp, 
                newPassword 
            });
            setAlert({ 
                show: true, 
                type: "success", 
                message: response.data.message || "Đặt lại mật khẩu thành công!" 
            });
            setIsOtpModalOpen(false);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setAlert({ 
                show: true, 
                type: "error", 
                message: error.response?.data?.message || "OTP không hợp lệ hoặc có lỗi xảy ra." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
                    Quên mật khẩu
                </h2>
                {alert.show && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ ...alert, show: false })}
                        className="mb-4"
                    />
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Gửi mã OTP
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        Đã nhớ mật khẩu?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </Card>

            {/* Modal nhập OTP và mật khẩu mới */}
            {isOtpModalOpen && (
                <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)} title="Đặt lại mật khẩu">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mã OTP
                            </label>
                            <Input
                                type="text"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Xác nhận mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleResetPassword}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Đặt lại mật khẩu
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ForgotPassword; 