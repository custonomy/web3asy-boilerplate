import axiosInstance from "./config/axiosInstance";
import { IUpdateUser } from "./utils/types";

export const authUser = async () => {
  return axiosInstance.get("/auth").then((res) => res.data);
};

export const logout = async () => {
  const res = await axiosInstance.get("/auth/logout");
  return res.data;
};

export const login = async (credentials: { email: string; password: string }) => {
  return axiosInstance.post("/auth/login", credentials).then((res) => res.data);
};

export const register = async (email: string) => {
  return axiosInstance.post("/auth/register", { email }).then((res) => res.data);
};

export const changePassword = async (user: IUpdateUser) => {
  return axiosInstance.post("/auth/change-password", user).then((res) => res.data);
};

export const forgotPassword = async (email: string) => {
  return axiosInstance.post("/auth/forgot-password", { email }).then((res) => res.data);
};

export const verify = async (token: string) => {
  return axiosInstance.get(`/auth/verify?token=${token}`).then((res) => res.data);
};

export const mint = async (body: { address: string; asset: string }) => {
  return axiosInstance.post("/mint", body).then((res) => res.data);
};
