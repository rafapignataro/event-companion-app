import { api } from '../../utils/api';
import { Marker } from './types';

type CreateMarkerRequest = {
	eventId: number;
	visitorId: number;
	latitude: number;
	longitude: number;
}

export const createMarker = async (data: CreateMarkerRequest) => {
	const response = await api.post<Marker>('/markers', data);

	return response.data;
};