import axiosInstance from "./config/axiosInstance";
import { IUpdateUser } from "./utils/types";

export const authUser = () => {
  return axiosInstance.get("/auth").then((res) => res.data);
};

export const logout = () => {
  return axiosInstance.get("/auth/logout").then((res) => res.data);
};

export const login = (credentials: { email: string; password: string }) => {
  return axiosInstance.post("/auth/login", credentials).then((res) => res.data);
};

export const register = (email: string) => {
  return axiosInstance
    .post("/auth/register", { email })
    .then((res) => res.data);
};

export const changePassword = (user: IUpdateUser) => {
  return axiosInstance
    .post("/auth/change-password", user)
    .then((res) => res.data);
};

export const forgotPassword = (email: string) => {
  return axiosInstance
    .post("/auth/forgot-password", { email })
    .then((res) => res.data);
};

export const verify = (token: string) => {
  return axiosInstance
    .get(`/auth/verify?token=${token}`)
    .then((res) => res.data);
};

export const getStripeClient = () => {
  return axiosInstance.post("/create-payment-intent").then((res) => res.data);
};

export const mint = (body: { address: string; asset: string }) => {
  return axiosInstance.post("/mint", body).then((res) => res.data);
};

export const createIntent = (body: { chainId: string, contractAddress: string, method: string, params: any[] }) => {
  return axiosInstance.post("/order/oneclickintent", body).then((res) => res.data);
};

export const getOrderIntent = (orderId: string) => {
  return axiosInstance.get(`/order/${orderId}`).then((res) => res.data);
};

export const custonomyMint = (body: {
  address: string;
  asset: string;
  id: string;
}) => {
  return axiosInstance.post("/custonomy/mint", body).then((res) => res.data);
};
