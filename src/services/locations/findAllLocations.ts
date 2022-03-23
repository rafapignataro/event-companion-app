import { api } from '../../utils/api';
import { Location } from './types';

type FindAllLocationsRequest = {
  eventId: number
}

export const findAllLocations = async ({ eventId }: FindAllLocationsRequest) => {
	const response = await api.get<Location[]>('/locations', {
		params: {
			eventId
		}
	});

	return response.data;
};