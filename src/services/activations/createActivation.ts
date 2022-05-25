import { api } from '../../utils/api';
import { Activation } from './types';

type CreateActivationRequest = Omit<Activation, 'id' | 'active'>

export const createActivation = async (data: CreateActivationRequest) => {
	await api.post<Location>('/activations', data);
};