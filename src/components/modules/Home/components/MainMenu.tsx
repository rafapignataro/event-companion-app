import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import Events from '../../Menu/Events';
import { Event } from '../../../../services/events/types';

interface MainMenuProps {
	menu: string,
	setMenu: Dispatch<SetStateAction<string>>,
	filterEvents: (filter: string) => void,
	filteredEventList: Event[]
}

export const MainHomeMenu = ({menu, setMenu, filterEvents, filteredEventList}: MainMenuProps) => {
	return (
		<Modal 
			centered 
			visible={menu !== ''} 
			onCancel={() => {
				setMenu('');
				filterEvents('');
			}}
			footer={null} 
			closable={false}
			bodyStyle={{ overflow: 'auto', maxHeight: '70vh', borderRadius: '2em' }}
			className="main-modal"
		>
			{menu === 'nav' ? (
				<Events filterEvents={filterEvents} filteredEventList={filteredEventList} />
			) : menu === 'social' ? (
				<>zap 2</>
			) : <>zap 3</>}
		</Modal>
	);
};