import { useEffect, useState } from 'react';
import { useLocation } from '../../../../contexts/location';
import { Location, LocationCategory } from '../../../../services/locations/types';

import { RiRainbowFill } from 'react-icons/ri';
import { MdFace } from 'react-icons/md';
import { GiHotDog } from 'react-icons/gi';
import { BiStore } from 'react-icons/bi';
import { GrStatusPlaceholderSmall } from 'react-icons/gr';
import ActivationBadge from '../../ActivationBadge';

interface LocationMarkerIconProperties {
	location: Location;
	zoomLevel: number;
	maxZoom: number;
	selected: boolean;
}

interface UserMarkerIconProperties {
	zoomLevel: number;
	maxZoom: number;
}

interface BeaconMarkerIconProperties {
	zoomLevel: number;
	maxZoom: number;
	color: string;
}

interface LocationAvatarProperties {
	category: string
	zoomLevel: number
	maxZoom: number
	fixedSize?: boolean
}

export const LocationCard = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			style={{
				borderRadius: '1em',
				background: '#ffffff',
				boxShadow: '0 1px 3px 0 rgba(0,0,0,0.25)',
				display: 'flex',
				alignItems: 'center',
				transform: 'translateX(-50%)'
			}}
		>
			{children}
		</div>
	);
};

export const LocationAvatar = ({ category, zoomLevel, maxZoom, fixedSize }: LocationAvatarProperties) => {
	const iconSwitch = (categoryCode: string) => {
		switch (categoryCode) {
			case 'FOOD':
				return <GiHotDog />;
			case 'ATTRACTION':
				return <RiRainbowFill />;
			case 'SHOPPING':
				return <BiStore />;
			default:
				return <GrStatusPlaceholderSmall />;
		}
	};

	const colorSwitch = (categoryCode: string) => {
		switch (categoryCode) {
			case 'FOOD':
				return '#59FF7D';
			case 'ATTRACTION':
				return '#FFE459';
			case 'SHOPPING':
				return '#FF9E59';
			default:
				return '#C7C7C7';
		}
	};

	return (
		<div
			style={{
				borderRadius: '50%',
				boxShadow: '0 1px 3px 0 rgba(0,0,0,0.25)',
				border: '.25em solid #ffffff',
				padding: '.25em',
				background: colorSwitch(category) || '#C7C7C7',
				fontSize: !fixedSize ? 30 - ((maxZoom - zoomLevel) * 5) : '1em',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{iconSwitch(category)}
		</div>
	);
};

export const Icon = ({ location, zoomLevel, maxZoom }: LocationMarkerIconProperties) => {
	const [activationVisible, setActivationVisible] = useState(false);

	useEffect(() => {
		setActivationVisible(!!location.activations?.find((activation) => activation.active));
	}, [location]);

	const near = zoomLevel >= maxZoom - 1;

	return (
		<>
			<LocationCard>
				<h2 style={{
					marginRight: '1em',
					marginBottom: '0',
					whiteSpace: 'nowrap',
					fontFamily: 'Gilroy-Extrabold',
					fontSize: 16 - ((maxZoom - zoomLevel) * 3),
					padding: near ? '0.75em 2em' : '0'
				}}>
					{near && location.name}
				</h2>
				<div style={{
					position: 'absolute',
					right: 0,
					transform: 'translateX(50%)'
				}}>
					<ActivationBadge active={activationVisible} near={near}>
						<LocationAvatar zoomLevel={zoomLevel} maxZoom={maxZoom} category={location.locationCategory.code} />
					</ActivationBadge>
				</div>
			</LocationCard>
			{!near && (
				<div style={{
					position: 'absolute',
					bottom: 0,
					transform: 'translate(0, 200%)',
					width: 0,
					height: 0,
					borderLeft: '10px solid transparent',
					borderRight: '10px solid transparent',
					borderTop: '15px solid #ffffff',
					zIndex: -2,
				}} />
			)}
		</>
	);
};
export const UserIcon = ({ zoomLevel, maxZoom }: UserMarkerIconProperties) => {
	return (
		<>
			<div className='leaflet-user-picture-wrapper' style={{ fontSize: `${0.6 - ((maxZoom - zoomLevel) * 0.2)}em` }}>
				<div className='leaflet-user-picture'>
					<MdFace />
				</div>
			</div>
			<div className='leaflet-user-circles' style={{ fontSize: `${0.7 - ((maxZoom - zoomLevel) * 0.2)}em` }} />
		</>
	);
};
export const BeaconIcon = ({ zoomLevel, maxZoom, color }: BeaconMarkerIconProperties) => {

	const hex2rgba = (hex: string, alpha = 1) => {
		const matched = hex.match(/\w\w/g);

		if (!matched) return;

		const [r, g, b] = matched.map(x => parseInt(x, 16));
		return `rgba(${r},${g},${b},${alpha})`;
	};

	return (
		<>
			<div className='leaflet-beacon-user-picture-wrapper' style={{ fontSize: `${0.6 - ((maxZoom - zoomLevel) * 0.2)}em` }}>
				<div className='leaflet-user-picture'>
					<MdFace />
				</div>
			</div>
			<div className='leaflet-beacon-user-circles'
				style={{
					fontSize: `${0.7 - ((maxZoom - zoomLevel) * 0.2)}em`,
					backgroundColor: `${hex2rgba(color)}`,
					border: `1.5em solid ${hex2rgba(color, 0.6)}`,
					outline: `1.5em solid ${hex2rgba(color, 0.3)}`,
				}}
			/>
		</>
	);
};