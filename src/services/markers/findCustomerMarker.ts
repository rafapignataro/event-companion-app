import { api } from '../../utils/api';
import { Marker } from './types';

type FindCustomerMarkerRequest = {
	eventId: number
	visitorId: number
}

export const findCustomerMarker = async ({ eventId, visitorId }: FindCustomerMarkerRequest) => {
	const response = await api.get<Marker[]>('/markers', {
		params: {
			eventId,
			visitorId
		}
	});

	if (!response.data.length) return null;

	return response.data[0];
};