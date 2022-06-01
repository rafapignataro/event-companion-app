import { Col, Row } from 'antd';
import dynamic from 'next/dynamic';
import LocationProvider from '../../../contexts/location';
import { Page } from '../../common/Page';

export const Event = () => {
	const MapWithNoSSR = dynamic(() => import('../../common/LeafletContainer'), {
		ssr: false
	});
	return (
		<Page title="Event">
			<LocationProvider>
				<Row style={{ height: '100%' }}>
					<Col span={24} xl={12}>
						<MapWithNoSSR
							showUserLocation={true}
							mapCornerStart={
								{ lat: -23.707487913664902, lng: -46.70137882232666, alt: undefined }
							}
							mapCornerEnd={
								{ lat: -23.695954697016138, lng: -46.69165849685668, alt: undefined }
							}
						></MapWithNoSSR>
					</Col>
				</Row>
			</LocationProvider>
		</Page>
	);
};

