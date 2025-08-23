import api from "./api";

export const register = async (data) => {
    return await api.post("/auth/register", data);
};

export const verifyOtp = async (data) => {
    return await api.post("/auth/verify-otp", data);
};
