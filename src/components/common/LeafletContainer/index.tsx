import { Card, Layout } from 'antd';
import Head from 'next/head';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { LatLng, latLngBounds, latLng as convertCoordinates } from 'leaflet';
import { LoadingScreen } from '../LoadingScreen';
import Title from 'antd/lib/typography/Title';

type AnimatedPanning = {
	animateRef: MutableRefObject<boolean>
}
type UserLocationProperties = {
	showUserLocation?: boolean
}
type MapProperties = {
	showUserLocation?: boolean
	mapCornerStart: {lat: number, lng: number, alt?: number | undefined}
	mapCornerEnd: {lat: number, lng: number, alt?: number | undefined}
	mapTitle?: string 
}

function SetViewOnClick({ animateRef }: AnimatedPanning) {
	const map = useMapEvent('click', (e) => {
		map.setView(e.latlng, map.getZoom(), {
			animate: animateRef.current || false,
		});
	});

	return null;
}

function UserLocation({ showUserLocation }: UserLocationProperties) {
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
}

const LeafletContainer = ({ showUserLocation, mapCornerStart, mapCornerEnd, mapTitle }: MapProperties) => {
	const [hasMounted, setHasMounted] = useState(false);
	const mapBounds = latLngBounds(convertCoordinates(mapCornerStart), mapCornerEnd);
	const animateRef = useRef(true);

	useEffect(() => {
		setHasMounted(true);
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
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<SetViewOnClick animateRef={animateRef} />
								<UserLocation showUserLocation={showUserLocation} />
							</MapContainer>
						</div>
					) : (
						<LoadingScreen/>
					)}
				</div>
			</Card>
		</>
	);
};

export default LeafletContainer;

