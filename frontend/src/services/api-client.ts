import axios from 'axios';
import { API_URL } from '../constants';

const client = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

client.interceptors.response.use((response) => {
	return response
}, async function (error) {
	const originalRequest = error.config;
	if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== 'auth/refresh') {
		originalRequest._retry = true;
		await client.get('auth/refresh');
		return client(originalRequest);
	}
	return Promise.reject(error);
});


export default client;