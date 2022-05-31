import { api } from '../../utils/api';
import { Customer } from './types';

type UpdateCustomerRequest = {
	id: number
	data: Omit<Customer, 'id'>
}

export const updateCustomer = async ({ id, data }: UpdateCustomerRequest) => {
	await api.put<Customer>(`/customers/${id}`, data);
};