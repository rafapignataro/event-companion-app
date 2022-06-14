import { Badge, Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { useLocation } from '../../../../contexts/location';
import { LocationAvatar } from '../../../common/LeafletContainer/components';
import { BsCircleFill } from 'react-icons/bs';
import Search from 'antd/lib/input/Search';

const Explore = () => {
	const { selectedLocation, selectLocation, activationCountdown, filteredLocationList, filterLocations } = useLocation();

	if(selectedLocation) return (
		<>
			<div>
				<Title style={{ fontFamily: 'Gilroy-Extrabold', margin: 0 }}>{selectedLocation.name}</Title>
				<Title level={4} style={{ fontWeight: 400, margin: '0 0 1em 0' }}>{selectedLocation.locationCategory.name}</Title>
			</div>
			{selectedLocation.activations?.find((activation) => activation.active) && (
				<div>
					<Text>{activationCountdown(selectedLocation.activations?.find((activation) => activation.active)?.endDate || new Date())}</Text>
					<Text>{selectedLocation.activations?.find((activation) => activation.active)?.description}</Text>
				</div>
			)}
			<div style={{ lineHeight: '20px' }}>
				<Title level={4} style={{ margin: 0 }}>Descrição</Title>
				<Text style={{ fontSize: '20px' }}>{selectedLocation.description}</Text>
			</div>
		</>
	);

	return (
		<>
			<Search 
				placeholder="Locais ou categorias"
				onChange={(e) => filterLocations(e.target.value)}
				style={{ width: '100%' }}
			/>
			<Menu
				style={{ width: '100%' }}
				mode="inline"
			>
				{filteredLocationList.map((location) => {
					return (
						<Menu.Item 
							key={location.id} 
							onClick={() => {
								selectLocation(location);
							}}
							style={{ height: '6em' }}
						>
							<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '2px' }}>
								<div style={{ fontSize: '1.5em' }}>
									{location.activations?.find((activation) => activation.active) ? 
										(
											<Badge count={<BsCircleFill />} style={{ 
												color: '#f5222d',
												borderRadius: '50%',
												right: '.75em',
												top: '.75em',
												border: '.3em solid #fff',
												width: '1.8em',
												height:'1.8em',
											}}>
												<LocationAvatar category={location.locationCategory.code} zoomLevel={0} maxZoom={0} fixedSize={true} />
											</Badge>
										) : (
											<LocationAvatar category={location.locationCategory.code} zoomLevel={0} maxZoom={0} fixedSize={true} />
										)}
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '1em', lineHeight: '1.5em' }}>
									<Title level={4} style={{ margin: 0 }}>{location.name}</Title>
									<Text>{location.locationCategory.name}</Text>
								</div>
							</div>
						</Menu.Item>
					);
				})}
			</Menu>
		</>
	);	
};

export default Explore;