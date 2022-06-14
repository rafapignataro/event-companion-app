export interface Event {
	id: number,
	name: string,
	startDate: Date,
	endDate: Date,
	logoURL?: string,
	version: number,
	eventCategoryId: number,
}