import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import Events from '../../Menu/Events';
import { Event } from '../../../../services/events/types';
import { Social } from '../../../common/Social';
import { Settings } from '../../../common/Settings';

interface MainMenuProps {
	menu: string,
	setMenu: Dispatch<SetStateAction<string>>,
	filterEvents: (filter: string) => void,
	filteredEventList: Event[],
	selectEvent: Dispatch<SetStateAction<number | null>>
	changePage: Dispatch<SetStateAction<string>>
}

export const MainHomeMenu = ({ menu, setMenu, filterEvents, filteredEventList, selectEvent, changePage }: MainMenuProps) => {
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
			{menu === 'nav' && <Events filterEvents={filterEvents} filteredEventList={filteredEventList} selectEvent={selectEvent} changePage={changePage} />}
			{menu === 'social' && <Social />}
			{menu === 'settings' && <Settings />}
		</Modal>
	);
};