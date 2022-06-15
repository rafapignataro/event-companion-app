import React, { createContext, useContext, useEffect, useState } from 'react';
import { Location } from '../services/locations/types';
import { findAllLocations } from '../services/locations/findAllLocations';
import moment from 'moment';
import { Marker } from '../services/markers/types';
import { useUser } from './user';
import { findCustomerMarker } from '../services/markers/findCustomerMarker';
import { findEventMarkers } from '../services/markers/findEventMarkers';
import { useFriendships } from './friendships';
import { deleteMarker } from '../services/markers/deleteMarker';
import { createMarker } from '../services/markers/createMarker';

interface LocationProviderProps {
	eventId: number,
	children: React.ReactNode;
}

interface LocationContextProps {
	// Event Id
	eventId: number
	// Locations
	locationList: Location[];
	filteredLocationList: Location[];
	filterLocations: (filter: string) => void;
	selectedLocation: Location | null;
	selectLocation: (location: Location | null) => void
	refreshLocations: () => Promise<void>
	loading: boolean;
	// Markers
	customerMarker: Marker | null;
	friendMarkers: Marker[]
	selectedMarker: Marker | null;
	selectMarker: (marker: Marker | null) => void
	createCustomerMarker: () => Promise<void>;
	removeMarker: () => void;
	positioningMarker: boolean;
	togglePositioningMarker: () => void;
	selectedMarkerPosition: { latitude: number; longitude: number } | null;
	selectMarkerPosition: (latitude: number, longitude: number) => void;
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ eventId, children }: LocationProviderProps) {
	const [locationList, setLocationList] = useState<Location[]>([]);
	const [filteredLocationList, filterLocationList] = useState<Location[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const [customerMarker, setCustomerMarker] = useState<Marker | null>(null);
	const [friendMarkers, setFriendMarkers] = useState<Marker[]>([]);
	const [positioningMarker, setPositioningMarker] = useState(false);
	const [selectedMarkerPosition, setSelectedMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);

	const { user } = useUser();
	const { friendships } = useFriendships();

	const refreshMarkers = async () => {
		try {
			const userEventInfo = user.events.find(ev => ev.eventId === eventId);

			if (!userEventInfo) return;
			console.log('userEventInfo', userEventInfo)

			const customerMarker = await findCustomerMarker({ eventId, visitorId: userEventInfo.visitorId });
			console.log('customerMarker', customerMarker)
			setCustomerMarker(customerMarker);

			const eventMarkers = await findEventMarkers({ eventId });
			console.log('eventMarkers', eventMarkers)
			console.log('friendships', friendships)
			setFriendMarkers(
				eventMarkers.filter(marker =>
					marker.visitor.id !== userEventInfo.visitorId &&
					marker.eventId === eventId &&
					friendships.find(friendship => friendship.customer.id === marker.visitor.customer.id || friendship.friend.id === marker.visitor.customer.id)
				)
			);
		} catch (err) {

		} finally {

		}
	};

	const refreshLocations = async () => {
		const tempLocations = await findAllLocations({ eventId })
			.then((tempLocationList) => tempLocationList.map((location) => {
				return {
					...location,
					activations: location.activations.map((activation) => {
						const now = moment();
						return {
							...activation,
							active: moment(activation.startDate) <= now && moment(activation.endDate) >= now
						};
					})
				};
			}));

		setLocationList(tempLocations);
		filterLocationList(tempLocations);
	};

	const filterLocations = (filter: string) => {
		const newLocationList = locationList.filter((location) => {
			return location.name.toLowerCase().includes(filter.toLowerCase()) || location.locationCategory.name.toLowerCase().includes(filter.toLowerCase());
		});
		filterLocationList(newLocationList);
	};

	const selectLocation = (receivedLocation: Location | null) => {
		setSelectedLocation(receivedLocation);
	};

	const selectMarker = (receivedMarker: Marker | null) => {
		setSelectedMarker(receivedMarker);
	};

	const createCustomerMarker = async () => {
		try {
			const userEventInfo = user.events.find(ev => ev.eventId === eventId);

			if (!userEventInfo) return;

			if (!selectedMarkerPosition) return;

			const { latitude, longitude } = selectedMarkerPosition;

			const marker = await createMarker({
				eventId,
				visitorId: userEventInfo.visitorId,
				latitude,
				longitude,
			});

			setCustomerMarker(marker);
			setPositioningMarker(false);
			setSelectedMarkerPosition(null);
		} catch (err) {

		} finally {

		}
	};

	const removeMarker = async () => {
		try {
			if (!customerMarker) return;

			await deleteMarker({ id: customerMarker.id });
			setCustomerMarker(null);
		} catch (err) {

		} finally {

		}
	}

	const togglePositioningMarker = () => {
		if (positioningMarker) {
			setSelectedMarkerPosition(null);
			setPositioningMarker(false);
		} else {
			setPositioningMarker(true);
		}
	}

	const selectMarkerPosition = (latitude: number, longitude: number) => {
		setSelectedMarkerPosition({
			latitude,
			longitude
		})
	}

	useEffect(() => {
		const heartBeat = setInterval(async () => {
			// Locations Heart Beat area
			setLocationList(current => current.map((location) => {
				return {
					...location,
					activations: location.activations?.map((activation) => {
						const now = moment();
						return {
							...activation,
							active: moment(activation.startDate) <= now && moment(activation.endDate) >= now
						};
					})
				};
			}));
			// Armazenar em localstorage a localização para enviar no final do evento

			// Markers Heart Beat area
			await refreshMarkers();
		}, 1000 * 10); // 60s
		return () => clearInterval(heartBeat);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				await refreshLocations();
				await refreshMarkers();
				setLoading(false);
			} catch (e) {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<LocationContext.Provider
			value={{
				eventId,
				locationList,
				filteredLocationList,
				filterLocations,
				selectedLocation,
				selectLocation,
				refreshLocations,
				loading,
				customerMarker,
				friendMarkers,
				selectedMarker,
				selectMarker,
				createCustomerMarker,
				removeMarker,
				positioningMarker,
				togglePositioningMarker,
				selectedMarkerPosition,
				selectMarkerPosition
			}}>
			{children}
		</LocationContext.Provider>
	);
}

export function useLocation() {
	const context = useContext(LocationContext);

	if (!context) throw new Error('useLocation must me used inside an LocationProvider.');

	return context;
}