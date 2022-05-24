import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { decode } from 'jsonwebtoken';
import { isAuthenticated } from '../services/authentication/isAuthenticated';
import { Location, LocationCategory } from '../services/locations/types';
import { findAllLocations } from '../services/locations/findAllLocations';
import moment from 'moment';

type LocationProviderProps = {
  children: React.ReactNode;
}

type LocationContextProps = {
	locationList: Location[];
	locationCategoryList: LocationCategory[];
  selectedLocation: Location | null;
  loading: boolean;
  selectLocation: (location: Location | null) => void
	refreshLocations: () => Promise<void>
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ children }: LocationProviderProps) {
	const [locationList, setLocationList] = useState<Location[]>([]);
	const [locationCategoryList, setLocationCategoryList] = useState<LocationCategory[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const refreshLocations = async () => {
		const locationList = await findAllLocations({ eventId: 1 });
		// .then((locationList) => locationList.map((location) => {
		// 	return {
		// 		...location,
		// 		activations: location.activations.map((activation) => {
		// 			const now = moment();
		// 			return {
		// 				...activation,
		// 				active: moment(activation.startDate) <= now && moment(activation.endDate) >= now
		// 			};
		// 		})
		// 	};
		// }));
		setLocationList(locationList);
	};

	const selectLocation = (receivedLocation: Location | null) => {
		setSelectedLocation(receivedLocation);
	};

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
			console.log('du dum');
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
				locationCategoryList,
				refreshLocations, 
				selectedLocation, 
				selectLocation, 
				loading 
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