import axios from "axios";
import { getSession } from "next-auth/react";
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // baseURL: 'http://192.168.0.63:3065/store',
});
instance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (err) => {
    console.log("Axios error:", err);
    return Promise.reject(err);
  }
);

export default instance;
