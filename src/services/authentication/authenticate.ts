import { unauthApi } from '../../utils/api';

type AuthenticateRequest = {
  email: string;
  password: string;
}

type AuthenticateResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  }
}

export const authenticate = async ({ email, password }: AuthenticateRequest) => {
	const { data } = await unauthApi.post<AuthenticateResponse>('/auth/authenticate', {
		email,
		password
	});

	return data;
};