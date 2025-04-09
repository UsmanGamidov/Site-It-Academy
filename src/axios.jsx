import axios from "axios";

const instance = axios.create({
    baseURL: "https://site-it-academy-backend.onrender.com"
})

export default instance
