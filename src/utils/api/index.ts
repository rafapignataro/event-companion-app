import axios from 'axios';
import { parseCookies } from 'nookies';
import Router from 'next/router';

import { globalConfig } from '../../config';

const api = axios.create({
	baseURL: globalConfig.apiURL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': true
	},
});

api.interceptors.request.use(config => {
	const cookies = parseCookies();

	const token = cookies['companion_token'];

	if (config.headers) config.headers.Authorization = `Bearer ${token}`;

	return config;
});

api.interceptors.response.use(response => response, error => {
	if (error.response.status === 401) {
		if (Router.route !== '/login' && Router.route !== '/register') {
			Router.push('/login');
		}
	}

	return Promise.reject(error.response.data);
});

const unauthApi = axios.create({
	baseURL: globalConfig.apiURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

unauthApi.interceptors.response.use(response => response, error => Promise.reject(error.response.data));

export { api, unauthApi };