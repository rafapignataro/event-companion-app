import { api } from '../../utils/api';

type findAllBrandsRequest = {
  eventId: number
}

type Brand = {
  id: number;
  userId: number;
  eventId: number;
  updatedAt: Date;
  createdAt: Date;
}

export const findAllBrands = async ({ eventId }: findAllBrandsRequest) => {
	const response = await api.get<Brand[]>('/brands', {
		params: {
			eventId
		}
	});

	return response.data;
};