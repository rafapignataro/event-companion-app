import { api } from '../../utils/api';

type UpdatePasswordRequest = {
	userId: number;
	oldPassword: string;
	newPassword: string;
	newPasswordRepeated: string;
}

export const updatePassword = async ({ userId, oldPassword, newPassword, newPasswordRepeated }: UpdatePasswordRequest) => {
	await api.put(`/auth/password/${userId}`, {
		oldPassword,
		newPassword,
		newPasswordRepeated
	});
};