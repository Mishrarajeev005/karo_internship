import axios from 'axios';

const api = axios.create({
    baseURL: 'https://karointernship-production.up.railway.app/api'
});

export default api;
