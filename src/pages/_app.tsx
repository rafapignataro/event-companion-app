import type { AppProps } from 'next/app';

// import { LoadingScreen } from '../components/common/LoadingScreen';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
	// if(loading) return <LoadingScreen />;

	return <Component {...pageProps} />;
}

export default App;
