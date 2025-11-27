import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";
const BASE_URL = process.env.REACT_APP_API_GATEWAY || "http://localhost:3000";

export const customAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(t(`errors.${error.response?.data?.key}`));
    return Promise.reject(error);
  }
);
