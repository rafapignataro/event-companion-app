import Head from 'next/head';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LoadingScreen } from '../LoadingScreen';

const LeafletContainer = () => {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);
	
	return (
		<div style={{position: 'absolute', width: '100%', top: 0, bottom: 0}}>
			<Head>
				<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
					integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
					crossOrigin=""
				/>
			</Head>
			{ hasMounted ? (
				<div id="map" style={{ height: '100%'}}>
					<MapContainer center={[-23.701, -46.697]} zoom={15} style={{height: '100%'}}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[-23.701, -46.697]}>
							<Popup>
								A pretty CSS3 popup. <br /> Easily customizable.
							</Popup>
						</Marker>
					</MapContainer>
				</div>
			) : (
				<LoadingScreen/>
			)}
		</div>
	);
};

export default LeafletContainer;

