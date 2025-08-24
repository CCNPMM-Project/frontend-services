import api from "./api";

export const register = async (data) => {
    return await api.post("/auth/register", data);
};

export const verifyOtp = async (data) => {
    return await api.post("/auth/verify-otp", data);
};

export const login = async (data) => {
    return await api.post("/auth/login", data);
};
export const verifyToken = () => api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getProfile = async () => {
    return await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

export const updateProfile = async (data) => {
    return await api.post("/auth/profile", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
};

// Forgot password APIs
export const forgotPassword = async (data) => {
    return await api.post("/auth/forgot-password", data);
};

export const resetPassword = async (data) => {
    return await api.post("/auth/reset-password", data);
};