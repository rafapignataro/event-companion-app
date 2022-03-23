import 'antd/dist/antd.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import UserProvider from '../contexts/user';
import { findAllLocations } from '../services/locations/findAllLocations';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		findAllLocations({ eventId: 1 }).then(response => console.log(response));
	}, []);
	
	return (
		<UserProvider>
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default App;
