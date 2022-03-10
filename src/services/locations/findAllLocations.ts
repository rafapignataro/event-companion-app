import { api } from '../../utils/api';

type FindAllLocationsRequest = {
  eventId: number
}

type Visitor = {
  id: number;
  customerId: number;
  eventId: number;
  updatedAt: Date;
  createdAt: Date;
}

export const findAllLocations = async ({ eventId }: FindAllLocationsRequest) => {
	const response = await api.get<Visitor[]>('/visitors', {
		params: {
			eventId
		}
	});

	return response.data;
};