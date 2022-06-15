import { Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Search from 'antd/lib/input/Search';
import { Event } from '../../../../services/events/types';
import { colorSwitch, nameSwitch } from '../../../../utils/functions/switches';

interface EventsMenuProps {
	filterEvents: (filter: string) => void,
	filteredEventList: Event[]
}

const EventsMenu = ({ filterEvents, filteredEventList }: EventsMenuProps) => {
	return (
		<>
			<Search 
				placeholder="Eventos ou categorias"
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
								<div style={{ 
									fontSize: '1.75em', 
									width: '1.75em', 
									height: '1.75em', 
									overflow: 'hidden', 
									padding: '0.25em', 
									borderRadius: '0.5em', 
									display: 'flex',
									backgroundColor: colorSwitch(event.eventCategoryId) }}
								>
									<img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={event.logoURL || 'https://i.imgur.com/myhmEJH.png'} />
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '1em', lineHeight: '1.5em' }}>
									<Title level={4} style={{ margin: 0 }}>{event.name}</Title>
									<Text>{nameSwitch(event.eventCategoryId)}</Text>
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