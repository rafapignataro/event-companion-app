import { api } from '../../utils/api';

type DeleteActivationRequest = {
	id: number
}

export const deleteActivation = async ({ id }: DeleteActivationRequest) => {
	await api.delete<Location>(`/activations/${id}`);
};