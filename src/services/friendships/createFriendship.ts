import { api } from '../../utils/api';

type createFriendshipRequest = {
	customerId: number;
	friendId: number;
}

export const createFriendship = async (data: createFriendshipRequest) => {
	await api.post('/friendships', {
		...data,
		status: 'NOT_ACCEPTED'
	});
};