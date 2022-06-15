import { Button, Menu, Popover } from 'antd';
import Title from 'antd/lib/typography/Title';
import { MdFace } from 'react-icons/md';
import { BsPinMapFill } from 'react-icons/bs';
import { useLocation } from '../../../../contexts/location';
import { useUser } from '../../../../contexts/user';


export const Markers = () => {
	const { user } = useUser();
	const { friendMarkers, selectedMarker, selectMarker, yourMarker, positionMarker, eventId } = useLocation();

	return (
		<>
			<div style={{ width: '100%', display: 'flex' }}>
				<BsPinMapFill size={'2em'} />
				<Title level={4} style={{ textTransform: 'uppercase', letterSpacing: '0.25em' , margin: '0 auto', transform: 'translateX(-0.5em)' }}>
					Marcadores
				</Title>
			</div>
			<Menu
				style={{ width: '100%' }}
				mode="inline"
				selectedKeys={[String(selectedMarker?.id)]}
			>
				{yourMarker && (
					<Popover content={() => <Button block type="primary" onClick={() => positionMarker(null)}>Confirm</Button>} title="Remove Marker?">
						<Menu.Item 
							key={yourMarker.id}
							style={{ height: '6em' }}
						>
							<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '2px' }}>
								<div style={{ 
									fontSize: '1.75em', 
									width: '1.75em', 
									height: '1.75em', 
									overflow: 'hidden', 
									padding: '0.25em', 
									borderRadius: '0.5em', 
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: yourMarker.visitor.avatarColor }}
								>
									<MdFace />
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '1em', lineHeight: '1.5em' }}>
									<Title level={4} style={{ margin: 0 }}>{yourMarker.visitor.user.name}</Title>
								</div>
							</div>
						</Menu.Item>
					</Popover>
				)}
				{friendMarkers.map((friendMarker) => {
					return (
						<Menu.Item 
							key={friendMarker.id} 
							onClick={() => {
								selectMarker(friendMarker);
							}}
							style={{ height: '6em' }}
						>
							<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '2px' }}>
								<div style={{ 
									fontSize: '1.75em', 
									width: '1.75em', 
									height: '1.75em', 
									overflow: 'hidden', 
									padding: '0.25em', 
									borderRadius: '0.5em', 
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: friendMarker.visitor.avatarColor }}
								>
									<MdFace />
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '1em', lineHeight: '1.5em' }}>
									<Title level={4} style={{ margin: 0 }}>{friendMarker.visitor.user.name}</Title>
								</div>
							</div>
						</Menu.Item>
					);
				})}
			</Menu>
			<Button
				block 
				disabled={!!yourMarker}
				type="primary" 
				onClick={() => {
					navigator.geolocation.getCurrentPosition((currPosition) => {
						positionMarker({
							latitude: currPosition.coords.latitude,
							longitude: currPosition.coords.longitude,
							eventId: eventId,
							visitorId: user.id
						});
					});
				}}
				style={{ marginTop: '1em' }}
			>
				Adicionar Marcador
			</Button>
		</>
	);
};