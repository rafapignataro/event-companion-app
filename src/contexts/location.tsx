import React, { createContext, useContext, useEffect, useState } from 'react';
import { Location } from '../services/locations/types';
import { findAllLocations } from '../services/locations/findAllLocations';
import moment from 'moment';

interface LocationProviderProps {
	eventId: number,
  children: React.ReactNode;
}

interface LocationContextProps {
	locationList: Location[];
	filteredLocationList: Location[];
	filterLocations: (filter: string, filterByCategory?: boolean) => void;
  selectedLocation: Location | null;
  loading: boolean;
  selectLocation: (location: Location | null) => void
	refreshLocations: () => Promise<void>
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ eventId, children }: LocationProviderProps) {
	const [locationList, setLocationList] = useState<Location[]>([]);
	const [filteredLocationList, filterLocationList] = useState<Location[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const refreshLocations = async () => {
		const tempLocations = await findAllLocations({ eventId })
			.then((locationList) => locationList.map((location) => {
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

	const filterLocations = (filter: string, filterByCategory?: boolean) => {
		const newLocationList = filterByCategory ? locationList.filter((location) => {
			return location.locationCategory.code === filter;
		}) : locationList.filter((location) => {
			return location.name.toLowerCase().includes(filter.toLowerCase()) || location.locationCategory.name.toLowerCase().includes(filter.toLowerCase());
		});
		filterLocationList(newLocationList);
	};

	const selectLocation = (receivedLocation: Location | null) => {
		setSelectedLocation(receivedLocation);
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
				setLoading(true);
				await refreshLocations();
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