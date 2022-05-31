import { api } from '../../utils/api';
import { Customer } from './types';

type CustomerRequest = Omit<Customer, 'id'>

export const createCustomer = async (data: CustomerRequest) => {
	await api.post<Customer>('/customers', data);
};