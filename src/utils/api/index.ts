import axios from 'axios';
import { parseCookies } from 'nookies';
import Router from 'next/router';

import { globalConfig } from '../../config';

const api = axios.create({
	baseURL: globalConfig.apiURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(config => {
	const { token } = parseCookies();
  
	if(config.headers) config.headers.Authorization = `Bearer ${token}`;
   
	return config;
});

api.interceptors.response.use(response => response, error => {
	if (error.response.status === 401) {
		Router.push('/login');
	}

	return error;
});

export { api };
