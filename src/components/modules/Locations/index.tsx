import { Col, Row } from 'antd';
import dynamic from 'next/dynamic';
import LocationProvider from '../../../contexts/location';
import { Page } from '../../common/Page';
import { SideMenu } from '../../common/SideMenu';
import { LocationMenu } from './LocationMenu';

export const Locations = () => {
	const MapWithNoSSR = dynamic(() => import('../../common/LeafletContainer'), {
		ssr: false
	});
	return (
		<Page title="Locations">
			<LocationProvider>
				<Row>
					<Col span={24} xl={12}>
						<MapWithNoSSR
							showUserLocation={true}
							mapCornerStart={
								{ lat: -23.707487913664902, lng: -46.70137882232666, alt: undefined }
							}
							mapCornerEnd={
								{ lat: -23.695954697016138, lng: -46.69165849685668, alt: undefined }
							}
							mapTitle="LOCAIS"
						></MapWithNoSSR>
					</Col>
					<Col span={24} xl={12}>
						<SideMenu title='AÇÕES'>
							<LocationMenu />
						</SideMenu>
					</Col>
				</Row>
			</LocationProvider>
		</Page>
	);
};

