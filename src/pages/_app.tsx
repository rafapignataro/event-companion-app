import 'antd/dist/antd.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import FriendshipsProvider from '../contexts/friendships';
import UserProvider from '../contexts/user';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<FriendshipsProvider>
				<Component {...pageProps} />
			</FriendshipsProvider>
		</UserProvider>
	);
}

export default App;
