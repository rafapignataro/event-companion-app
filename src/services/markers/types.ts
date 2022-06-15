export interface Marker {
	id: number
	latitude: number
	longitude: number
	eventId: number
	visitor: {
		id: number
		avatarColor: string
		user: {
			id: number
			name: string
			email: string
		}
	}
}