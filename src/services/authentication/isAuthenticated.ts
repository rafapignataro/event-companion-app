import { api } from '../../utils/api';

export const isAuthenticated = async () => {
	await api.get('/auth/status');
};