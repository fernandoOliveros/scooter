import axios, { AxiosError } from "axios";
import baseUrl from "../utils/base-url.utils";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') as string);
        const token: string = user?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// interceptor para validar 401 no autorizado
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // Elimina el token de sesión
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;
