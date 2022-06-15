import { api } from '../../utils/api';

type DeleteMarkerRequest = {
	id: number;
}

export const deleteMarker = async ({ id }: DeleteMarkerRequest) => {
	await api.delete<void>(`/markers/${id}`);
};