import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: "https://ecommerce-backend-one-xi.vercel.app/api/v1",
    withCredentials: true
});

export default axiosInstance;