import { Col, Row, Button, Typography } from 'antd';
import dynamic from 'next/dynamic';
import { ArrowLeftOutlined, ToolOutlined } from '@ant-design/icons';

import LocationProvider from '../../../contexts/location';
import { Page } from '../../common/Page';

export const Event = () => {
	const MapWithNoSSR = dynamic(() => import('../../common/LeafletContainer'), {
		ssr: false
	});
	return (
		<Page title="Event">
			<LocationProvider>
				<MapWithNoSSR
					showUserLocation={true}
					mapCornerStart={
						{ lat: -23.707487913664902, lng: -46.70137882232666, alt: undefined }
					}
					mapCornerEnd={
						{ lat: -23.695954697016138, lng: -46.69165849685668, alt: undefined }
					}
				></MapWithNoSSR>
				<div id="ui-header" style={{ position: 'absolute', zIndex: 2000, width: '100%' }}>
					<Row justify="space-between" align="middle" style={{ width: '100%' }} >
						<Col span={4}>
							<Button type="primary" shape="round" icon={<ArrowLeftOutlined />} size={'large'} />
						</Col>
						<Col span={16}>
							<Typography.Title level={3} style={{ textAlign: 'center', margin: 0 }}>
								LOLLAPALOOZA
							</Typography.Title>
						</Col>
						<Col span={4}>
							<Button type="primary" shape="round" icon={<ToolOutlined />} size={'large'} />
						</Col>
					</Row>
				</div>
			</LocationProvider>
		</Page>
	);
};

