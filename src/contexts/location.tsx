import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { decode } from 'jsonwebtoken';
import { isAuthenticated } from '../services/authentication/isAuthenticated';
import { Location } from '../services/locations/types';

type LocationProviderProps = {
  children: React.ReactNode;
}

type LocationContextProps = {
  location: Location | null;
  loading: boolean;
  selectLocation: (location: Location | null) => void
}

const LocationContext = createContext({} as LocationContextProps);

export default function LocationProvider({ children }: LocationProviderProps) {
	const [location, setLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const selectLocation = (receivedLocation: Location | null) => {
		setLocation(receivedLocation);
		console.log(receivedLocation);
	};

	return (
		<LocationContext.Provider value={{ location, loading, selectLocation }}>
			{children}
		</LocationContext.Provider>
	);
}

export function useLocation() {
	const context = useContext(LocationContext);

	if (!context) throw new Error('useLocation must me used inside an LocationProvider.');

	return context;
}