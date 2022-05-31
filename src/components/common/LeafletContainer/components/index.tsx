import { useEffect, useState } from 'react';
import { useLocation } from '../../../../contexts/location';
import { Location, LocationCategory } from '../../../../services/locations/types';

import { RiRainbowFill } from 'react-icons/ri';
import { GiHotDog } from 'react-icons/gi';
import { BiStore } from 'react-icons/bi';
import { GrStatusPlaceholderSmall } from 'react-icons/gr';
import ActivationBadge from '../../ActivationBadge';

type LocationMarkerIconProperties = {
	location: Location;
	zoomLevel: number;
	maxZoom: number;
	selected: boolean;
}

type LocationAvatarProperties = {
	category: string
	zoomLevel: number
	maxZoom: number
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

export const LocationAvatar = ({ category, zoomLevel, maxZoom }: LocationAvatarProperties) => {
	const { locationCategoryList } = useLocation();
	const [avatarProperties, setAvatarProperties] = useState<LocationCategory>({} as LocationCategory);

	useEffect(() => {
		setAvatarProperties(
			locationCategoryList?.find(listCategory => listCategory.code === category) ||
			{} as LocationCategory
		);
	}, [locationCategoryList]);

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

	return (
		<div
			style={{
				borderRadius: '50%',
				boxShadow: '0 1px 3px 0 rgba(0,0,0,0.25)',
				border: '.25em solid #ffffff',
				padding: '.25em',
				background: avatarProperties.color || '#C7C7C7',
				fontSize: 30 - ((maxZoom - zoomLevel) * 5),
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