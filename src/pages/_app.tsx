import 'antd/dist/antd.css';

import type { AppProps } from 'next/app';
import UserProvider from '../contexts/user';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default App;
