import { Button, Col, Menu, Popover, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { MdFace } from 'react-icons/md';
import { BsPinMapFill } from 'react-icons/bs';
import { useLocation } from '../../../../contexts/location';
import Avatar from 'antd/lib/avatar/avatar';


export const Markers = () => {
	const { friendMarkers, selectedMarker, selectMarker, customerMarker, createCustomerMarker, removeMarker, togglePositioningMarker } = useLocation();

	const onActivatePositioningMarker = async () => {
		togglePositioningMarker();
	};

	return (
		<Row>
			<Col span={24}>
				<Row>
					<Col span={8}>
						<BsPinMapFill size={'2em'} />
					</Col>
					<Col>
						<Title level={4} style={{ textTransform: 'uppercase', letterSpacing: '0.25em', margin: '0 auto', transform: 'translateX(-0.5em)' }}>
							Markers
						</Title>
					</Col>
				</Row>
			</Col>
			<Col span={24} style={{ height: '400px', marginBottom: '1rem' }}>
				<Menu
					style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'clip', padding: '1rem 0' }}
					mode="inline"
					selectedKeys={[String(selectedMarker?.id)]}
					inlineIndent={0}
				>
					{customerMarker && (
						<Menu.Item
							key={customerMarker.id}
							style={{ height: '64px' }}
						>
							<Popover content={() => <Button block type="primary" onClick={() => removeMarker()}>Remove</Button>} title="Remove Marker?">
								<Row align="middle">
									<Col span={4}>
										<Avatar shape="circle" size={48} icon={<MdFace />} style={{ backgroundColor: customerMarker.visitor.customer.avatarColor, color: '#000' }} />
									</Col>
									<Col style={{ marginLeft: '0.5rem' }}>
										<Title level={4} style={{ margin: 0 }}>{customerMarker.visitor.customer.user.name}</Title>
									</Col>
								</Row>
							</Popover>
						</Menu.Item>
					)}
					{friendMarkers.map((friendMarker) => (
						<Menu.Item
							key={friendMarker.id}
							onClick={() => selectMarker(friendMarker)}
							style={{ height: '64px' }}
						>
							<Row align="middle">
								<Col span={4}>
									<Avatar shape="circle" size={48} icon={<MdFace />} style={{ backgroundColor: friendMarker.visitor.customer.avatarColor, color: '#000' }} />
								</Col>
								<Col style={{ marginLeft: '0.5rem' }}>
									<Title level={4} style={{ margin: 0 }}>{friendMarker.visitor.customer.user.name}</Title>
								</Col>
							</Row>
						</Menu.Item>
					))}
				</Menu>
			</Col>
			<Col span={24}>
				<Button
					type="primary"
					size="large"
					disabled={!!customerMarker}
					onClick={() => onActivatePositioningMarker()}
					block
				>
					Add Marker
				</Button>
			</Col>
		</Row>
	);
};