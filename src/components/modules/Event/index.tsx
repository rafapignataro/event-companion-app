import { Col, Row, Button, Typography, Radio } from 'antd';
import dynamic from 'next/dynamic';
import { CompassOutlined, ShoppingOutlined, SmileOutlined, ArrowLeftOutlined, ToolOutlined, ShoppingFilled, CompassFilled, SmileFilled, FlagFilled } from '@ant-design/icons';

import LocationProvider, { useLocation } from '../../../contexts/location';
import { Page } from '../../common/Page';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MainEventMenu } from './components/MainMenu';
import { createVisitor } from '../../../services/visitors/createVisitor';
import { useUser } from '../../../contexts/user';

interface EventProps {
	eventId: number;
	changePage: Dispatch<SetStateAction<string>>;
	selectEvent: Dispatch<SetStateAction<number | null>>;
}

const MapWithNoSSR = dynamic(() => import('../../common/LeafletContainer'), {
	ssr: false
});

const EventContent = () => {
	const [menu, setMenu] = useState<string>('');
	const { positioningMarker, togglePositioningMarker, selectedMarkerPosition, createCustomerMarker } = useLocation();

	return (
		<>
			<MapWithNoSSR
				showUserLocation={true}
				mapCornerStart={
					{ lat: -23.707487913664902, lng: -46.70137882232666, alt: undefined }
				}
				mapCornerEnd={
					{ lat: -23.695954697016138, lng: -46.69165849685668, alt: undefined }
				}
			>
			</MapWithNoSSR>
			<div id="ui-open-markers"
				style={{
					position: 'absolute',
					zIndex: 999,
					display: 'flex',
					justifyContent: 'center',
					bottom: '14rem',
					right: '0',
					transform: 'translateX(-50%)'
				}}
			>
				<Button
					onClick={() => setMenu('marker')}
					icon={<FlagFilled />}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '2.5em',
						height: '2.5em',
					}}
				/>
			</div>
			{positioningMarker && <div id="ui-positioning-marker-header" style={{
				position: 'absolute',
				zIndex: 998,
				width: '90%',
				top: '4.5rem',
				left: '50%',
				transform: 'translateX(-50%)',
				backgroundColor: '#fff',
				padding: '0.5rem'
			}}>
				<Typography.Title level={3} style={{ margin: 0 }}>Select the marker position!</Typography.Title>
			</div>}
			{positioningMarker && <div id="ui-positioning-marker-button" style={{
				position: 'absolute',
				zIndex: 998,
				width: '90%',
				bottom: '5.5rem',
				left: '50%',
				transform: 'translateX(-50%)',
				padding: '0.5rem'
			}}>
				<Row justify="space-between" align="middle">
					<Col span={10}>
						<Button size="large" block onClick={() => {
							togglePositioningMarker()
						}}>CANCEL</Button>
					</Col>
					<Col span={10}>
						<Button type="primary" size="large" block onClick={() => createCustomerMarker()} disabled={!selectedMarkerPosition}>CREATE</Button>
					</Col>
				</Row>
			</div>}
			<MainEventMenu menu={menu} setMenu={setMenu} />
			<div id="ui-header" style={{
				position: 'absolute',
				zIndex: 998,
				width: '90%',
				top: '1.5rem',
				left: '50%',
				transform: 'translateX(-50%)'
			}}>
				<Row justify="space-between" align="middle" style={{ width: '100%' }} >
					<Col span={4}>
						<Button
							type="default"
							shape="round"
							icon={<ArrowLeftOutlined />}
							size={'large'}
							onClick={() => {
								changePage('home');
								selectEvent(null);
							}}
						/>
					</Col>
					<Col span={16}>
						<Typography.Title level={3} style={{ textAlign: 'center', margin: 0 }}>
							LOLLAPALOOZA
						</Typography.Title>
					</Col>
					<Col span={4}>
						<Button type="default" shape="round" icon={<ToolOutlined />} size={'large'} />
					</Col>
				</Row>
			</div>
			<div
				id="ui-footer"
				style={{
					position: 'absolute',
					zIndex: 998,
					width: '90%',
					display: 'flex',
					justifyContent: 'center',
					bottom: '2.5rem',
					left: '50%',
					transform: 'translateX(-50%)'
				}}
			>
				<Radio.Group
					size='large'
					defaultValue="a"
					buttonStyle="solid"
					value={menu}
				>
					<Radio.Button disabled value="shop" onChange={(e) => setMenu(e.target.value)}>
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
						>
							{menu === 'shop' ? (
								<ShoppingFilled style={{ fontSize: '1.6em' }} />
							) : (
								<ShoppingOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
					<Radio.Button
						value="nav"
						onChange={(e) => setMenu(e.target.value)}
						onClick={() => {
							if (menu === 'nav') setMenu('');
						}}>
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
						>
							{menu === 'nav' ? (
								<CompassFilled style={{ fontSize: '1.6em' }} />
							) : (
								<CompassOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
					<Radio.Button
						value="social"
						onChange={(e) => setMenu(e.target.value)}
						onClick={() => {
							if (menu === 'social') setMenu('');
						}}
					>
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
						>
							{menu === 'social' ? (
								<SmileFilled style={{ fontSize: '1.6em' }} />
							) : (
								<SmileOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
				</Radio.Group>
			</div>
		</>
	)
}

export const Event = ({ eventId, changePage, selectEvent }: EventProps) => {
	const { user } = useUser();

	useEffect(() => {
		(async () => {
			await createVisitor({
				eventId,
				customerId: user.customerId
			});
		})();
	}, []);

	return (
		<Page title="Event">
			<LocationProvider eventId={eventId}>
				<EventContent />
			</LocationProvider>
		</Page >
	);
};

