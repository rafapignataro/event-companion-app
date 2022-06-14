
import { Button } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { Event } from '../../../../services/events/types';
import { Carousel as AntdCarousel } from 'antd';

interface CarouselProps {
	eventList: Event[]
	changePage: Dispatch<SetStateAction<string>>
	selectEvent: Dispatch<SetStateAction<number | null>>
}

export const Carousel = ({ eventList, changePage, selectEvent }: CarouselProps) => {

	return (
		<div style={{ position: 'absolute', width: '100%', height: '100%', background: '#AAEFFF', overflow: 'hidden' }}>
			<div
				style={{ 
					zIndex: '1',
					position: 'absolute', 
					borderRadius: '50%',
					width: '250vw',
					height: '250vw',
					top: '50%',
					left: '-75%',
					background: 'radial-gradient(circle, rgba(88,72,226,1) 50%, rgba(58,43,162,1) 100%)' }}
			/>
			<div
				style={{ 
					zIndex: '2',
					position: 'absolute', 
					borderRadius: '50%',
					width: '150vw',
					height: '150vw',
					top: '85%',
					left: '-25%',
					background: '#9281EE' }}
			/>
			<div
				style={{ 
					zIndex: '3',
					position: 'absolute',
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{eventList.map((event) => {
					return (
						<div key={event.id}>
							<Button onClick={() => {
								selectEvent(event.id);
								changePage('event');
							}}
							>{event.name}</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
};