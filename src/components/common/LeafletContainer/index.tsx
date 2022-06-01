import { Card, Spin } from 'antd';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import L, { LatLng, latLngBounds, latLng as convertCoordinates } from 'leaflet';
import Title from 'antd/lib/typography/Title';
import { useLocation } from '../../../contexts/location';
import { Location } from '../../../services/locations/types';
import { LoadingScreen } from '../LoadingScreen';
import 'leaflet/dist/leaflet.css';
import { Icon } from './components';

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
	selected: boolean;
}

type MapProperties = {
	showUserLocation?: boolean;
	mapCornerStart: { lat: number, lng: number, alt?: number | undefined };
	mapCornerEnd: { lat: number, lng: number, alt?: number | undefined };
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
		<Marker position={position} />
	);
};

const LocationMarker = ({ latLong, location, setLocation, selected }: LocationMarkerProperties) => {
	const leafletInstance = L;
	const mapInstance = useMap();
	const [zoomLevel, setZoomLevel] = useState(18);
	const [maxZoom, setMaxZoom] = useState(19);

	const map = useMapEvents({
		load: () => {
			setZoomLevel(map.getZoom());
			setMaxZoom(map.getMaxZoom());
		},
		zoom: () => {
			setZoomLevel(map.getZoom());
		},
	});

	const iconAnchor = document.createElement('div');

	ReactDOM.hydrate(<Icon key={location.name} location={location} zoomLevel={zoomLevel} maxZoom={maxZoom} selected={selected} />, iconAnchor);

	const icon = leafletInstance.divIcon({
		html: iconAnchor,
		className: 'leaflet-marker-card'
		// iconSize: [100, (75-(maxZoom-zoomLevel)*35)],
		// iconAnchor: [32, 64],
		// popupAnchor: undefined,
		// shadowUrl: undefined,
		// shadowSize: undefined,
		// shadowAnchor: undefined
	});

	return (
		<Marker
			icon={icon}
			title={location.name}
			position={latLong}
			eventHandlers={{
				click: () => {
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
	const { locationList, selectedLocation, selectLocation, loading } = useLocation();

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<>
			<Card style={{ minHeight: '100%' }}>
				<div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
					{hasMounted ? (
						<div id="map" style={{ height: '100%', width: '100%' }}>
							<MapContainer
								center={[-23.701, -46.697]}
								zoom={18}
								minZoom={17}
								maxZoom={19}
								style={{ height: '100%' }}
								maxBoundsViscosity={1.0}
								maxBounds={mapBounds}
								layers={[
									L.tileLayer('')
								]}
							>
								<TileLayer
									maxZoom={19}
									maxNativeZoom={19}
									minZoom={17}
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

								/>
								<SetViewOnClick animateRef={animateRef} setLocation={() => selectLocation(null)} />
								<UserLocation showUserLocation={showUserLocation} />
								{!loading ? (
									locationList.map(location => (
										<LocationMarker
											key={location.id}
											latLong={[location.latitude, location.longitude]}
											location={location}
											setLocation={() => selectLocation(location)}
											selected={selectedLocation?.id === location.id}
										/>
									))
								) : <LoadingScreen />}
							</MapContainer>
						</div>
					) : (
						<Spin tip="Carregando..." />
					)}
				</div>
			</Card>
		</>
	);
};

export default LeafletContainer;
