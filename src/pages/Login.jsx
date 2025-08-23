// Các import đã lược bỏ useAuthContext
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { login } from '../services/authService';
import validateLoginInputs from '../components/validateInputs';

const BACKEND_URL = 'http://localhost:5000';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });

    if (!validateLoginInputs(formData.email, formData.password, (message) =>
      setAlert({ show: true, type: 'error', message }))) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(formData);
      const { data } = response.data;
      console.log(data)

      if (data && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('userId', data.user.id);

        localStorage.setItem('user', JSON.stringify(data.user));

        setAlert({
          show: true,
          type: 'success',
          message: 'Đăng nhập thành công! Đang chuyển hướng...',
        });

        navigate('/home');
      } else {
        throw new Error('Dữ liệu đăng nhập không đầy đủ');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      setAlert({ show: true, type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Đăng nhập
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
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mật khẩu
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Đăng nhập
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Đăng ký
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
