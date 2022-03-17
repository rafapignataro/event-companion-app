import { api } from '../../utils/api';
import { Visitor } from './types';

type FindAllLocationsRequest = {
  eventId: number
}

export const findAllLocations = async ({ eventId }: FindAllLocationsRequest) => {
	const response = await api.get<Visitor[]>('/visitors', {
		params: {
			eventId
		}
	});

	return response.data;
};