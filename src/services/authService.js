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
export const verifyToken = () => api.get('/auth/verify');
