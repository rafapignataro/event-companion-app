import { api } from '../../utils/api';
import { Marker } from './types';

type FindEventMarkersRequest = {
	eventId: number
	visitorId?: number
}

export const findEventMarkers = async ({ eventId }: FindEventMarkersRequest) => {
	const response = await api.get<Marker[]>('/markers', {
		params: {
			eventId,
		}
	});

	return response.data;
};