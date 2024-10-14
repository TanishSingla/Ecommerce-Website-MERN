import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';


export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    success: false,

    signup: async ({ name, email, password, confirmPassword }) => {

        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Password does not match");
        }

        try {
            const resp = await axios.post("/auth/signup", { name, email, password });

            set({ user: resp?.data?.user, loading: false, success: true });
            toast.success("Account created Successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error occured while creating new account.");
        }
    },
    login: async (email, password) => {

        set({ loading: true });
        try {
            const resp = await axios.post("/auth/login", {
                email, password
            });
            console.log("Resp", resp.data);
            set({ user: resp?.data, loading: false, success: true });
            toast.success("Login successfully.");

        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error occured while login.");
        }
    },
    logout: async () => {
        try {
            console.log("called1")
            await axios.get("/auth/logout");
            set({ user: null });
        } catch (error) {
            console.log("called2")
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });

        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },
    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post('/auth/refresh-token');
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    }
}));


//Interceptors

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login 
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);  