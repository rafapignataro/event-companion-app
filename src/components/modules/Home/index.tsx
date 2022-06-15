import { CompassFilled, CompassOutlined, ShoppingFilled, ShoppingOutlined, SmileFilled, SmileOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Col, Radio, Row, Typography } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import { Event } from '../../../services/events/types';
import { nameSwitch } from '../../../utils/functions/switches';
import { Page } from '../../common/Page';
import { Carousel } from './components/Carousel';
import { MainHomeMenu } from './components/MainMenu';

interface HomeProps {
	changePage: Dispatch<SetStateAction<string>>
	selectEvent: Dispatch<SetStateAction<number | null>>
	eventList: Event[]
}

export const Home = ({ changePage, selectEvent, eventList }: HomeProps) => {
	const [menu, setMenu] = useState('');
	const [filteredEventList, filterEventList] = useState<Event[]>(eventList);

	const filterEvents = (filter: string) => {
		const newEventList = eventList.filter((event) => {
			return event.name.toLowerCase().includes(String(filter).toLowerCase()) || nameSwitch(event.eventCategoryId).toLowerCase().includes(String(filter).toLowerCase());
		});
		filterEventList(newEventList);
	};

	return (
		<Page title="Home">
			<MainHomeMenu menu={menu} setMenu={setMenu} filterEvents={filterEvents} filteredEventList={filteredEventList} />
			<Carousel eventList={eventList} changePage={changePage} selectEvent={selectEvent} />
			<div id="ui-header" style={{
				position: 'absolute',
				zIndex: 2000,
				width: '90%',
				top: '1.5rem',
				left: '50%',
				transform: 'translateX(-50%)'
			}}>
				<Row justify="space-between" align="middle" style={{ width: '100%' }} >
					<Col span={4}>
					</Col>
					<Col span={16}>
						<Typography.Title level={3} style={{ textAlign: 'center', margin: 0 }}>
								EVENTOS
						</Typography.Title>
					</Col>
					<Col span={4}>
						<Button type="default" shape="round" icon={<ToolOutlined />} size={'large'} />
					</Col>
				</Row>
			</div>
			<div 
				id="ui-footer" 
				style={{
					position: 'absolute',
					zIndex: 2000,
					width: '90%',
					display: 'flex',
					justifyContent: 'center',
					bottom: '2.5rem',
					left: '50%',
					transform: 'translateX(-50%)'
				}}
			>
				<Radio.Group 
					size='large' 
					defaultValue="a" 
					buttonStyle="solid" 
					value={menu}
				>
					<Radio.Button disabled value="shop" onChange={(e) => setMenu(e.target.value)}>
						<div style={{ 
							display: 'flex', 
							justifyContent: 'center', 
							alignItems: 'center', 
							height: '100%',
						}}
						>
							{menu === 'shop' ? (
								<ShoppingFilled style={{ fontSize: '1.6em' }} />
							) : (
								<ShoppingOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
					<Radio.Button 
						value="nav" 
						onChange={(e) => setMenu(e.target.value)}
						onClick={() => {
							if(menu === 'nav') setMenu('');
						}}>
						<div style={{ 
							display: 'flex', 
							justifyContent: 'center', 
							alignItems: 'center', 
							height: '100%',
						}}
						>
							{menu === 'nav' ? (
								<CompassFilled style={{ fontSize: '1.6em' }} />
							) : (
								<CompassOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
					<Radio.Button
						value="social"
						onChange={(e) => setMenu(e.target.value)}
						onClick={() => {
							if(menu === 'social') setMenu('');
						}}
					>
						<div style={{ 
							display: 'flex', 
							justifyContent: 'center', 
							alignItems: 'center', 
							height: '100%',
						}}
						>
							{menu === 'social' ? (
								<SmileFilled style={{ fontSize: '1.6em' }} />
							) : (
								<SmileOutlined style={{ fontSize: '1.3em' }} />
							)}
						</div>
					</Radio.Button>
				</Radio.Group>
			</div>
		</Page>
	);
};