import { Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useLocation } from '../../../../contexts/location';
import Explore from '../../Menu/Explore';
import { Social } from './Social';

interface MainMenuProps {
	menu: string,
	setMenu: Dispatch<SetStateAction<string>>
}

export const MainEventMenu = ({ menu, setMenu }: MainMenuProps) => {
	const { selectedLocation, selectLocation, filterLocations } = useLocation();

	useEffect(() => {
		if (selectedLocation) {
			setMenu('nav');
			return;
		} else {
			setMenu('');
			selectLocation(null);
		}
	}, [selectedLocation]);

	return (
		<Modal
			centered
			visible={menu !== ''}
			onCancel={() => {
				setMenu('');
				selectLocation(null);
				filterLocations('');
			}}
			footer={null}
			closable={false}
			bodyStyle={{ overflow: 'auto', minHeight: '60vh', maxHeight: '70vh', borderRadius: '2em' }}
			className="main-modal"
		>
			{menu === 'nav' ? (
				<Explore />
			) : menu === 'social' ? (
				<Social />
			) : <>zap 3</>}
		</Modal>
	);
};