export type Activation = {
	id: number;
	locationId: number;
	description: string;
	startDate: Date;
	endDate: Date;
	active?: boolean;
}