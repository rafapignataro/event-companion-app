import { api } from '../../utils/api';

type FindAllVisitorsRequest = {
  eventId: number
}

type Visitor = {
  id: number;
  customerId: number;
  eventId: number;
  updatedAt: Date;
  createdAt: Date;
}

export const findAllVisitors = async ({ eventId }: FindAllVisitorsRequest) => {
	const response = await api.get<Visitor[]>('/visitors', {
		params: {
			eventId
		}
	});

	return response.data;
};