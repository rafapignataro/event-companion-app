import type { NextPage } from 'next';

import { Home } from '../components/modules/Home';
import { Event as EventPage } from '../components/modules/Event';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { Event } from '../services/events/types';
import { findAllEvents } from '../services/events/findAllEvents';

const MainPage: NextPage = () => {
	const [page, setPage] = useState('home');
	const [event, setEvent] = useState<{ id: number, name: string } | null>(null);
	const [eventList, setEventList] = useState<Event[]>([]);
	const [eventListLoading, setEventListLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const newEventList = await findAllEvents();
				setEventList(newEventList);
			} catch (e) {
				console.log('Erro', e);
			} finally {
				setEventListLoading(false);
			}
		})();
	}, []);

	return (
		<>
			{eventListLoading ? (
				<LoadingScreen />
			) : page === 'home' ? (
				<Home changePage={setPage} selectEvent={setEvent} eventList={eventList} />
			) : page === 'event' && event ? (
				<EventPage event={event} changePage={setPage} selectEvent={setEvent} />
			) : null}
		</>
	);
};

export default MainPage;
