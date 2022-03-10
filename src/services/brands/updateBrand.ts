import { api } from '../../utils/api';

type UpdateBrandRequest = {
  id: number;
  name: string;
  email: string;
  eventId: number;
}

export const updatePassword = async ({ id, name, email, eventId }: UpdateBrandRequest) => {
	await api.post<void>(`/brands/${id}`, {
		name, 
		email, 
		eventId
	});
};