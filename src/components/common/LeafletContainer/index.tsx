import { Button, notification, Spin } from 'antd';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import L, { LatLng, latLngBounds, latLng as convertCoordinates } from 'leaflet';
import { useLocation } from '../../../contexts/location';
import { Location } from '../../../services/locations/types';
import { LoadingScreen } from '../LoadingScreen';
import 'leaflet/dist/leaflet.css';
import { BeaconIcon, Icon, UserIcon } from './components';
import { TbFocus2 } from 'react-icons/tb';
import { Visitor } from '../../../services/visitors/types';
import { Customer } from '../../../services/customers/types';

type AnimatedPanning = {
	animateRef: MutableRefObject<boolean>;
	setLocation: () => void;
}

type UserLocationProperties = {
	showUserLocation?: boolean;
	bounds: {
		boundStart: {
			lat: number;
			lng: number;
			alt?: number;
		}, 
		boundEnd: {
			lat: number;
			lng: number;
			alt?: number;
		}
	};
}

type BeaconMarkerProperties = {
	latLong: [number, number];
	customer: Customer;
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

const UserLocation = ({ showUserLocation, bounds }: UserLocationProperties) => {
	const leafletInstance = L;
	const mapInstance = useMap();
	const [position, setPosition] = useState<LatLng | null>(null);
	const [onPremises, setOnPremises] = useState(false);
	const [locationWarning, setLocationWarning] = useState(false);
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

	ReactDOM.hydrate(<UserIcon zoomLevel={zoomLevel} maxZoom={maxZoom} />, iconAnchor);

	const icon = leafletInstance.divIcon({
		html: iconAnchor,
		className: 'leaflet-user-marker',
	});

	const centerView = (latLng: LatLng) => {
		mapInstance.flyTo(latLng, mapInstance.getMaxZoom());
	};

	useEffect(() => {
		if (!showUserLocation) return;
		mapInstance.stopLocate();
		mapInstance.locate({
			setView: onPremises,
			watch: true,
		}).on('locationfound', (foundLocation) => {
			setPosition(foundLocation.latlng);
			// mapInstance.flyTo(e.latlng, mapInstance.getZoom());
		});

		return () => {
			mapInstance.stopLocate();
		};
	}, [onPremises]);

	useEffect(() => {
		if (!position) return;
		
		if(
			position.lat < bounds.boundStart.lat ||
			position.lat > bounds.boundEnd.lat ||
			position.lng < bounds.boundStart.lng ||
			position.lng > bounds.boundEnd.lng
		) {
			if(!locationWarning) {
				notification.warning({
					message: 'Get over here!',
					description: 'You are too far from the venue!'
				});
				setLocationWarning(true);
			}
			return setOnPremises(false);
		}
		if (!onPremises) return setOnPremises(true);
	}, [position]);

	return (position === null || !onPremises) ? null : (
		<>
			<div 
				style={{
					position: 'absolute',
					zIndex: 999,
					display: 'flex',
					justifyContent: 'center',
					bottom: '10.5rem',
					right: '0',
					transform: 'translateX(-50%)'
				}}
			>
				<Button
					onClick={() => centerView(position)}
					icon={<TbFocus2 size={'1.5em'} />}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '2.5em',
						height: '2.5em',
					}}
				/>
			</div>
			<Marker 
				position={position}
				icon={icon}
			/>
		</>
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

const BeaconMarker = ({ latLong, customer }: BeaconMarkerProperties) => {
	const leafletInstance = L;
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

	ReactDOM.hydrate(<BeaconIcon key={customer.id} zoomLevel={zoomLevel} maxZoom={maxZoom} color={customer.avatarColor || '#DCDCDC'} />, iconAnchor);

	const icon = leafletInstance.divIcon({
		html: iconAnchor,
		className: 'leaflet-marker-card'
	});

	return (
		<Marker
			icon={icon}
			position={latLong}
		/>
	);
};

const LeafletContainer = ({ showUserLocation, mapCornerStart, mapCornerEnd, mapTitle }: MapProperties) => {
	const [hasMounted, setHasMounted] = useState(false);
	const mapBounds = latLngBounds(convertCoordinates(mapCornerStart), mapCornerEnd);
	const animateRef = useRef(true);
	const { locationList, selectedLocation, selectLocation, selectedMarker, yourMarker, friendMarkers, loading } = useLocation();

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
			{hasMounted ? (
				<div id="map" style={{ height: '100%', width: '100%' }}>
					<MapContainer
						center={[-23.701, -46.697]}
						zoom={18}
						minZoom={17}
						maxZoom={19}
						zoomControl={false}
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
						<UserLocation showUserLocation={showUserLocation} bounds={{
							boundStart: mapCornerStart,
							boundEnd: mapCornerEnd
						}} />
						{/* <CenterOnUser animateRef={animateRef} /> */}
						{!loading ? (
							<>
								{locationList.map(location => (
									<LocationMarker
										key={location.id}
										latLong={[location.latitude, location.longitude]}
										location={location}
										setLocation={() => selectLocation(location)}
										selected={selectedLocation?.id === location.id}
									/>
								))}
								{yourMarker && (
									<BeaconMarker latLong={[yourMarker.latitude, yourMarker.longitude]} customer={yourMarker.visitor} />
								)}
								{friendMarkers.map((friendMarker) => {
									return(
										<BeaconMarker key={friendMarker.id} latLong={[friendMarker.latitude, friendMarker.longitude]} customer={friendMarker.visitor} />
									);
								})}
							</>
						) : <LoadingScreen />}
						{/* <ZoomControl position='bottomleft' /> */}
					</MapContainer>
				</div>
			) : (
				<Spin tip="Carregando..." />
			)}
		</div>
	);
};

export default LeafletContainer;
