import { api } from '../../utils/api';

type UpdateFriendshipRequest = {
	customerId: number;
	friendId: number;
	status: 'ACCEPTED' | 'REFUSED'
}

export const updateFriendship = async (data: UpdateFriendshipRequest) => {
	await api.put('/friendships', data);
};