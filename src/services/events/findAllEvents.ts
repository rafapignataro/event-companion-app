import { api } from '../../utils/api';
import { Event } from './types';

export const findAllEvents = async () => {
	const response = await api.get<Event[]>('/events');
	return response.data;
};