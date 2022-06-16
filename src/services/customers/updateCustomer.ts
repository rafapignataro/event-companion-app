import { api } from '../../utils/api';
import { AuthenticateResponse } from '../authentication/authenticate';
import { Customer } from './types';

type UpdateCustomerRequest = {
	id: number
	data: Omit<Customer, 'id' | 'password'>
}

export const updateCustomer = async ({ id, data }: UpdateCustomerRequest) => {
	const response = await api.put<AuthenticateResponse>(`/customers/${id}`, data);

	return response.data;
};