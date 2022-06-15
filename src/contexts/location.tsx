import React, { createContext, useContext, useEffect, useState } from 'react';
import { Location } from '../services/locations/types';
import { findAllLocations } from '../services/locations/findAllLocations';
import moment from 'moment';
import { Marker } from '../services/markers/types';
import { findAllMarkers } from '../services/markers/findAllMarkers';
import { useUser } from './user';

interface MarkerParams {
	latitude: number
	longitude: number
	eventId: number
	visitorId: number
}

interface LocationProviderProps {
	eventId: number,
  children: React.ReactNode;
}

interface LocationContextProps {
	locationList: Location[];
	filteredLocationList: Location[];
	filterLocations: (filter: string) => void;
  selectedLocation: Location | null;
	selectedMarker: Marker | null;
	yourMarker: Marker | null;
	friendMarkers: Marker[]
  loading: boolean;
  selectLocation: (location: Location | null) => void
	selectMarker: (marker: Marker | null) => void
	positionMarker: (marker: MarkerParams | null) => void
	refreshLocations: () => Promise<void>
	eventId: number
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ eventId, children }: LocationProviderProps) {
	const [locationList, setLocationList] = useState<Location[]>([]);
	const [friendMarkers, setFriendMarkers] = useState<Marker[]>([]);
	const [filteredLocationList, filterLocationList] = useState<Location[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
	const [yourMarker, setYourMarker] = useState<Marker | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const { user } = useUser();
	// const { friendList } = useContext();

	const refreshMarkers = async () => {
		// const tempMarkers = await findAllMarkers({ eventId });

		// const tempFriendMarkers = tempMarkers.filter((marker) => {
		// 	// Retornar markers de amigos cujo id (visitor ou user) estejam na sua lista de amigos
		// 	return friendList.find((friend) => friend.id === marker.visitor.user.id);
		// });

		// const tempYourMarker = tempMarkers.find((marker) => {
		// 	// Retornar marker cujo id (visitor ou user) sejam iguais ao da userProvider
		// 	return marker.visitor.user.id === user.id;	
		// });

		// setYourMarker(tempYourMarker || null);
		// setFriendMarkers(tempFriendMarkers);
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

	const positionMarker = async (receivedMarker: MarkerParams | null) => {
		if (!receivedMarker) {
			// Await Deletar Marker
			return setYourMarker(null);
		}

		// Await Post Marker
		const newMarker = {
			id: 0,
			latitude: receivedMarker.latitude,
			longitude: receivedMarker.longitude,
			eventId: receivedMarker.eventId,
			visitor: {
				id: receivedMarker.visitorId,
				avatarColor: '',
				user: {
					id: 0,
					name: '',
					email: '',
				}
			}
		};
		setYourMarker(newMarker);
	};

	useEffect(() => {
		const heartBeat = setInterval(() => {
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
		}, 1000 * 60); // 60s
		return () => clearInterval(heartBeat);
	}, []);

	useEffect(() => {
		(async () => {
			try {
				await refreshMarkers();
			} catch (e) {
				console.log('Error', e);
			}
		})();
	}, [yourMarker, friendMarkers]);

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
				locationList,
				refreshLocations,
				filterLocations,
				filteredLocationList,
				selectedLocation, 
				selectLocation,
				selectedMarker,
				selectMarker,
				friendMarkers,
				yourMarker,
				positionMarker,
				eventId,
				loading,
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