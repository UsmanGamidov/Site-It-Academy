import axios from "axios";

const instance = axios.create({
    baseURL: "https://site-it-academy-backend.onrender.com"
    //  baseURL: "http://localhost:3001"
})

export default instance
