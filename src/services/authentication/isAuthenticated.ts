import { api } from '../../utils/api';

export const isAuthenticated = async () => api.get('/auth/status');