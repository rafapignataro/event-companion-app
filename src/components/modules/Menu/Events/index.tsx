import { Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { LocationAvatar } from '../../../common/LeafletContainer/components';
import Search from 'antd/lib/input/Search';
import { Event } from '../../../../services/events/types';

interface EventsMenuProps {
	filterEvents: (filter: string | number, filterByCategory?: boolean) => void,
	filteredEventList: Event[]
}

const EventsMenu = ({ filterEvents, filteredEventList }: EventsMenuProps) => {
	return (
		<>
			<Search 
				placeholder="Locais ou categorias"
				onChange={(e) => filterEvents(e.target.value)}
				style={{ width: '100%' }}
			/>
			<Menu
				style={{ width: '100%' }}
				mode="inline"
			>
				{filteredEventList.map((event) => {
					return (
						<Menu.Item 
							key={event.id} 
							// onClick={() => {
							// 	selectLocation(location);
							// }}
							style={{ height: '6em' }}
						>
							<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '2px' }}>
								<div style={{ fontSize: '1.5em' }}>
									<div>{event.eventCategoryId}</div>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '1em', lineHeight: '1.5em' }}>
									<Title level={4} style={{ margin: 0 }}>{event.name}</Title>
									<Text>{event.eventCategoryId}</Text>
								</div>
							</div>
						</Menu.Item>
					);
				})}
			</Menu>
		</>
	);	
};

export default EventsMenu;