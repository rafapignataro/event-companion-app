import { Badge, Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { useLocation } from '../../../../contexts/location';
import { LocationAvatar } from '../../../common/LeafletContainer/components';
import { BsCircleFill } from 'react-icons/bs';
import Search from 'antd/lib/input/Search';
import { Counter } from './components/Counter';

const Explore = () => {
	const { selectedLocation, selectLocation, filteredLocationList, filterLocations, locationList } = useLocation();

	if (selectedLocation) return (
		<>
			<div>
				<Title style={{ fontFamily: 'Gilroy-Extrabold', margin: 0 }}>{selectedLocation.name}</Title>
				<Title level={4} style={{ fontWeight: 400, margin: '0 0 1em 0' }}>{selectedLocation.locationCategory.name}</Title>
			</div>
			{locationList.find((location) => location.id === selectedLocation.id)?.activations?.find((activation) => activation.active) && (
				<div style={{ margin: '1em 0', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
					<Counter endDate={selectedLocation.activations?.find((activation) => activation.active)?.endDate || new Date()} />
					<div style={{
						border: '4px solid #F50359',
						borderRadius: '0 8px 8px 8px',
						padding: '1em .75em 1.2em .75em',
						width: '100%'
					}}>
						<Text style={{ fontSize: '1.2em' }}>{selectedLocation.activations?.find((activation) => activation.active)?.description}</Text>
					</div>
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
				placeholder="Locations ou categories"
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
												right: '.4em',
												top: '.4em',
												border: '.2em solid #fff',
												width: '1.3em',
												height: '1.3em',
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