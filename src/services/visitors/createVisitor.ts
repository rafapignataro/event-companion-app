import { api } from '../../utils/api';
import { Visitor } from './types';

type VisitorRequest = Omit<Visitor, 'id' | 'updatedAt' | 'createdAt'>

export const createVisitor = async (data: VisitorRequest) => {
	await api.post<Visitor>('/visitors', data);
};