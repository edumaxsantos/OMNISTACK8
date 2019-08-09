import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.3.20.4:3333'
});

export default api;