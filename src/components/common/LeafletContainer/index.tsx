import { Card, Spin } from 'antd';
import Head from 'next/head';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLng, latLngBounds, latLng as convertCoordinates } from 'leaflet';
import Title from 'antd/lib/typography/Title';
import { useLocation } from '../../../contexts/location';
import { Location } from '../../../services/locations/types';
import { findAllLocations } from '../../../services/locations/findAllLocations';

const test = {
	id: 1,
	eventId: 1,
	brandId: 1,
	name: 'Local de teste',
	description: '',
	latitude: 0,
	longitude: 0,
	locationCategoryId: 1,
};

type AnimatedPanning = {
	animateRef: MutableRefObject<boolean>;
	setLocation: () => void;
}
type UserLocationProperties = {
	showUserLocation?: boolean;
}
type LocationMarkerProperties = {
	latLong: [number, number];
	location: Location;
	setLocation: () => void;
}
type MapProperties = {
	showUserLocation?: boolean;
	mapCornerStart: {lat: number, lng: number, alt?: number | undefined};
	mapCornerEnd: {lat: number, lng: number, alt?: number | undefined};
	mapTitle?: string;
}

const SetViewOnClick = ({ animateRef, setLocation }: AnimatedPanning) => {
	const map = useMapEvents({
		click: (e) => {
			map.setView(e.latlng, map.getZoom(), {
				animate: animateRef.current || false,
			});
			setLocation();
		},
		drag: () => {
			setLocation();
		}
	});
	return null;
};

const UserLocation = ({ showUserLocation }: UserLocationProperties) => {
	const [position, setPosition] = useState<LatLng | null>(null);
	const mapInstance = useMap();
	useEffect(() => {
		if (!showUserLocation) return;
		mapInstance.locate().on('locationfound', (e) => {
			setPosition(e.latlng);
			mapInstance.flyTo(e.latlng, mapInstance.getZoom());
		});
	}, [mapInstance]);
	return position === null ? null : (
		<Marker position={position}/>
	);
};

const LocationMarker = ({ latLong, location, setLocation }: LocationMarkerProperties) => {
	const mapInstance = useMap();
	return (
		<Marker 
			position={latLong}
			eventHandlers={{
				click: () => { 
					console.log(location);
					mapInstance.flyTo(latLong, mapInstance.getMaxZoom());
					setLocation(); 
				},
			}}
		/>
	);
};

const LeafletContainer = ({ showUserLocation, mapCornerStart, mapCornerEnd, mapTitle }: MapProperties) => {
	const [hasMounted, setHasMounted] = useState(false);
	const mapBounds = latLngBounds(convertCoordinates(mapCornerStart), mapCornerEnd);
	const animateRef = useRef(true);
	const { selectLocation } = useLocation();


	const [locations, setLocations] = useState<Location[]>([]);

	useEffect(() => {
		setHasMounted(true);

		findAllLocations({ eventId: 1}).then(locations => setLocations(locations));
	}, []);
	
	return (
		<>
			<Title style={{textAlign: 'center'}}>{mapTitle}</Title>
			<Card style={{minHeight: '600px'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
					<Head>
						<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
							integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
							crossOrigin=""
						/>
					</Head>
					{ hasMounted ? (
						<div id="map" style={{ height: '100%'}}>
							<MapContainer 
								center={[-23.701, -46.697]} 
								zoom={18}
								minZoom={17}
								style={{height: '100%'}}
								maxBoundsViscosity={1.0}
								maxBounds={mapBounds}
								layers={[
									L.tileLayer('')
								]}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									
								/>
								<SetViewOnClick animateRef={animateRef} setLocation={() => selectLocation(null)} />
								<UserLocation showUserLocation={showUserLocation} />
								{locations.map(location => (
									<LocationMarker
										key={location.id}
										latLong={[location.latitude, location.longitude]}
										location={location}
										setLocation={() => selectLocation(location)}
									/>
								))}
								
							</MapContainer>
						</div>
					) : (
						<Spin tip="Carregando..."/>
					)}
				</div>
			</Card>
		</>
	);
};

export default LeafletContainer;
