import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (status === 403) {
      error.userMessage =
        error.response?.data?.message ||
        "You do not have permission to perform this action.";
    }
    if (status === 404) {
      error.userMessage =
        error.response?.data?.message ||
        "The requested resource was not found.";
    }
    if (status >= 500) {
      error.userMessage =
        "Something went wrong on the server. Please try again later.";
    }
    if (!error.response) {
      error.userMessage =
        "Unable to connect to the server. Please check your connection.";
    }
    return Promise.reject(error);
  },
);

export default api;
