import { StorageEnum } from "@/helper/constants";
import { accessToken, baseURL } from "@/helper/env";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import apiService from ".";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ================== Request Interceptor ==================
axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // Nếu env có token -> ưu tiên dùng (fix cứng)
    // Nếu không có -> fallback sang localStorage
    const lsToken =
      accessToken && accessToken.trim().length > 0
        ? accessToken
        : localStorage.getItem(StorageEnum.ACCESS_TOKEN);

    config.headers.Authorization = lsToken ? `Bearer ${lsToken}` : "";

    if (config.data instanceof FormData) {
      // Để browser tự set boundary cho multipart
      delete config.headers["Content-Type"];
    }

    return config;
  },
  function (error: AxiosError | Error) {
    return Promise.reject(error);
  }
);

// ================== Refresh Token Logic ==================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const refreshToken = async (refreshToken: string) => {
  try {
    const response = await apiService.auth.refreshToken({ refresh: refreshToken });

    if (response.data.status === "success") {
      const data = response.data.data;
      localStorage.setItem(StorageEnum.ACCESS_TOKEN, data.access);
      return data.access;
    }
    return null;
  } catch (error) {
    console.error("Refresh token failed", error);
    localStorage.clear();
    return null;
  }
};

// ================== Response Interceptor ==================
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    const lsRefreshToken = localStorage.getItem(StorageEnum.REFRESH_TOKEN);

    // Nếu token fix cứng trong env thì bỏ qua refresh (chỉ reject)
    if (accessToken && accessToken.trim().length > 0) {
      return Promise.reject(error);
    }

    // Nếu token từ localStorage thì cho phép refresh
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (lsRefreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshToken(lsRefreshToken);
          isRefreshing = false;

          if (newToken) {
            onRefreshed(newToken);
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              originalRequest._retry = true;
              return axiosClient(originalRequest);
            }
          } else {
            localStorage.clear();
            return Promise.reject(error);
          }
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            }
          });
        });
      } else {
        localStorage.clear();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
