import { api } from '../../utils/api';
import { Location } from './types';

type UpdateLocationRequest = {
	id: number
	locationData: Omit<Location, 'id'>
}

export const updateLocation = async ({ id, locationData }: UpdateLocationRequest) => {
	const response = await api.put<Location>(`/locations/${id}`, locationData);
	return response.data;
};