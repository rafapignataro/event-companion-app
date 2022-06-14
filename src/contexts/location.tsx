import React, { createContext, useContext, useEffect, useState } from 'react';
import { Location } from '../services/locations/types';
import { findAllLocations } from '../services/locations/findAllLocations';
import moment from 'moment';

interface LocationProviderProps {
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
	activationCountdown: (endDate: Date) => string
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ children }: LocationProviderProps) {
	const [locationList, setLocationList] = useState<Location[]>([]);
	const [filteredLocationList, filterLocationList] = useState<Location[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const refreshLocations = async () => {
		const tempLocations = await findAllLocations({ eventId: 1 })
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
		console.log('zap1', filter);
		const newLocationList = filterByCategory ? locationList.filter((location) => {
			return location.locationCategory.code === filter;
		}) : locationList.filter((location) => {
			console.log('zap2', location);
			return location.name.toLowerCase().includes(filter.toLowerCase()) || location.locationCategory.name.toLowerCase().includes(filter.toLowerCase());
		});
		filterLocationList(newLocationList);
	};

	const selectLocation = (receivedLocation: Location | null) => {
		setSelectedLocation(receivedLocation);
	};

	const activationCountdown = (endDate: Date) => {
		const time = moment(endDate).valueOf();
		const interval = 1000;
		let duration = moment.duration(time * 1000, 'milliseconds');
		let remaining = '';

		const activationCountdownInterval = setInterval(() => {
			if(time <= moment().valueOf()) {
				clearInterval(activationCountdownInterval);
				duration = moment.duration(0, 'milliseconds');
				remaining = moment(duration.asMilliseconds()).format('h:mm:ss');
				return;
			}
			duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
			remaining = moment(duration.asMilliseconds()).format('h:mm:ss');
		}, interval);
		
		return remaining;
	};

	useEffect(() => {
		console.log('zap', selectedLocation);
	}, [selectedLocation]);

	useEffect(() => {
		const timer = setInterval(() => {
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
		}, 1000 * 5); // 60s
		return () => clearInterval(timer);
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
				activationCountdown
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