import { api } from '../../utils/api';

type FindAllFriendshipsRequest = {
	customerId: number;
}

export type Friendship = {
	id: number;
	status: 'NOT_ACCEPTED' | 'ACCEPTED' | 'REFUSED'
	customer: {
		id: number;
		avatarColor: string;
		user: {
			id: number;
			name: string;
			email: string;
		}
	}
	friend: {
		id: number;
		avatarColor: string;
		user: {
			id: number;
			name: string;
			email: string;
		}
	}
}

export const findAllFriendships = async ({ customerId }: FindAllFriendshipsRequest) => {
	const response = await api.get<Friendship[]>('/friendships', {
		params: {
			customerId
		}
	});

	return response.data
};