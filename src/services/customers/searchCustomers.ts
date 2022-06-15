import { api } from '../../utils/api';
import { Customer, User } from './types';

type SearchFormCustomerType = Customer & User

type SearchForCustomersRequest = {
	text: string;
}

export type SearchForCustomersResponse = SearchFormCustomerType[]

export const searchForCustomers = async ({ text }: SearchForCustomersRequest) => {
	const response = await api.get<SearchForCustomersResponse>('/customers/search', {
		params: {
			text
		}
	});

	return response.data;
};