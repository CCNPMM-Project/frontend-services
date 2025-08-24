import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-gray-100">{user.fullName || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <p className="text-gray-900 dark:text-gray-100">{user.phoneNumber || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verified
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {user.isVerified ? 'Yes' : 'No'}
            </p>
          </div>

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </Button>

          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={() => navigate('/')}
          >
            Trang chủ
          </Button>

          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
