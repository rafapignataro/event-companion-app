
export type Location = {
	id: number;
  eventId: number;
	brandId?: number;
	name: string;
	description?: string;
	latitude: number;
	longitude: number;
	locationCategoryCode: string;
}

export type Visitor = {
  id: number;
  customerId: number;
  eventId: number;
  updatedAt: Date;
  createdAt: Date;
}