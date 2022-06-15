import { api } from '../../utils/api';
import { Marker } from './types';

type FindAllMarkersRequest = {
  eventId: number
	// visitorId: number
}

export const findAllMarkers = async ({ eventId }: FindAllMarkersRequest) => {
	const response = await api.get<Marker[]>('/markers', {
		params: {
			eventId,
			// visitorId
		}
	});

	return response.data;
};