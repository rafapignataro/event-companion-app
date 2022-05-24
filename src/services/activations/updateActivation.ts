import { api } from '../../utils/api';
import { Activation } from './types';

type UpdateActivationRequest = {
	id: number
	data: Omit<Activation, 'id'>
}

export const updateActivation = async ({ id, data }: UpdateActivationRequest) => {
	await api.put<Location>(`/activations/${id}`, data);
};