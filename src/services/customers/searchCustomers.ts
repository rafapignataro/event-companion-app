import { api } from '../../utils/api';
import { Customer, User } from './types';

export type SearchForCustomerType = Customer & { user: User };

type SearchForCustomersRequest = {
	text: string;
}

export type SearchForCustomersResponse = SearchForCustomerType[]

export const searchForCustomers = async ({ text }: SearchForCustomersRequest) => {
	const response = await api.get<SearchForCustomersResponse>('/customers/search', {
		params: {
			text
		}
	});

	return response.data;
};