import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { logOutFunction } from "./login";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// todo  not working access token expires
const sessionExpiredLogout = () => {
  alert("Your session has expired. Please log in again.");
  logOutFunction();
};

const refreshToken = async (): Promise<string> => {
  const userCredentials = JSON.parse(
    localStorage.getItem("userCredentials") || "{}"
  );
  const { refreshToken } = userCredentials;

  if (!refreshToken) {
    sessionExpiredLogout();
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const newAccessToken = response.data.accessToken;

    userCredentials.accessToken = newAccessToken;
    localStorage.setItem("userCredentials", JSON.stringify(userCredentials));

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    sessionExpiredLogout();
    throw error;
  }
};
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userCredentials = JSON.parse(
      localStorage.getItem("userCredentials") || "{}"
    );
    const { accessToken } = userCredentials;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        sessionExpiredLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
