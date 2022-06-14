import type { NextPage } from 'next';

import { Home } from '../components/modules/Home';
import { Event as EventPage } from '../components/modules/Event';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { Event } from '../services/events/types';
import { findAllEvents } from '../services/events/findAllEvents';

const MainPage: NextPage = () => {
	const [page, setPage] = useState('home');
	const [eventId, setEventId] = useState<number | null>(null);
	const [eventList, setEventList] = useState<Event[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const newEventList = await findAllEvents();
				setEventList(newEventList);
			} catch (e) {
				console.log('Erro', e);
			}
		})();
	}, []);

	if(page === 'home') return <Home changePage={setPage} selectEvent={setEventId} eventList={eventList} />;

	if(page === 'event' && eventId) return <EventPage eventId={eventId} changePage={setPage} selectEvent={setEventId} />;

	return <LoadingScreen/>;
};

export default MainPage;
