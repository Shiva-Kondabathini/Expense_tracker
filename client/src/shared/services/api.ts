import axios from "axios";
import { store } from "@/store/store";
import { startRequest, finishRequest } from "@/features/ui/uiSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nakharch-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    store.dispatch(startRequest());
    return config;
  },
  (error) => {
    store.dispatch(finishRequest());
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    store.dispatch(finishRequest());
    return response;
  },
  (error) => {
    store.dispatch(finishRequest());
    return Promise.reject(error);
  },
);
