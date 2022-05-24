import { Activation } from '../activations/types';

export type Location = {
	id: number;
  eventId: number;
	brandId?: number;
	name: string;
	description?: string;
	latitude: number;
	longitude: number;
	locationCategoryId: number;
	locationCategory: LocationCategory
	activations: Activation[];
}

export type LocationCategory = {
	id: number;
	name: string;
	code: string;
	color: string;
}

export type Visitor = {
  id: number;
  customerId: number;
  eventId: number;
  updatedAt: Date;
  createdAt: Date;
}