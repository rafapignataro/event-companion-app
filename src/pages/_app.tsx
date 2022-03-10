import type { AppProps } from 'next/app';
import UserProvider from '../contexts/user';

// import { LoadingScreen } from '../components/common/LoadingScreen';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default App;
