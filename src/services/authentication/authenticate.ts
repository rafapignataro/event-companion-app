import { unauthApi } from '../../utils/api';

type AuthenticateRequest = {
	email: string;
	password: string;
}

export type AuthenticateResponse = {
	token: string;
	user: {
		id: number;
		name: string;
		email: string;
		role: string;
		customerId: number;
		avatarColor: string;
		events: {
			visitorId: number;
			eventId: number;
		}[]
	}
}

export const authenticate = async ({ email, password }: AuthenticateRequest) => {
	const { data } = await unauthApi.post<AuthenticateResponse>('/auth/authenticate', {
		email,
		password
	});

	return data;
};