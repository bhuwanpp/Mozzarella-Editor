import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "../editor/fileOperations";
import { logOutFunction } from "./login";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});
let authCheckInterval: NodeJS.Timeout | null = null;

window.addEventListener("load", async () => {
  const isLoggedIn = await checkAuthStatus();
  if (isLoggedIn) {
    authCheckInterval = startAuthStatusCheck();
  }
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
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/auth/refresh-token",
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
    throw error;
  }
};

// request interceptor
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

// response interceptor
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
        sessionExpiredLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
async function checkAuthStatus() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return false;
  }
  try {
    await api.get("/auth/status", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logOutFunction();
    }
    return false;
  }
}
// check after  every 5 minutes
function startAuthStatusCheck(interval = 310000) {
  return setInterval(checkAuthStatus, interval);
}

// Function to call when user logs in
export function onUserLogin() {
  if (!authCheckInterval) {
    authCheckInterval = startAuthStatusCheck();
  }
}

// Function to call when user logs out
export function onUserLogout() {
  if (authCheckInterval) {
    clearInterval(authCheckInterval);
    authCheckInterval = null;
  }
}

export default api;
