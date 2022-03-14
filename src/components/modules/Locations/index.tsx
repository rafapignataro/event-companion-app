import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Page } from '../../common/Page';

export const Locations = () => {
	const MapWithNoSSR = dynamic(() => import('../../common/LeafletContainer'), {
		ssr: false
	});
	return (
		<Page title="Locations">
			<MapWithNoSSR></MapWithNoSSR>
		</Page>
	);
};

