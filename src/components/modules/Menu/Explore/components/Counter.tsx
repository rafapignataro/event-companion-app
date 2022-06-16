import moment from 'moment';
import { IoMdStopwatch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography/Text';

interface CounterProps {
	endDate: Date
}

export const Counter = ({ endDate }: CounterProps) => {
	const [timeLeft, setTimeLeft] = useState('-:--:--');

	useEffect(() => {
		const endTime = moment(endDate);
		const currTime = moment(new Date());
		const difference = moment.duration(endTime.diff(currTime));
		setTimeLeft(`
			${difference.hours()}:${difference.minutes() < 10 ? `0${difference.minutes()}` : difference.minutes()}:${difference.seconds() < 10 ? `0${difference.seconds()}` : difference.seconds()}
		`);

		const loop = setInterval(() => {
			const endTime = moment(endDate);
			const currTime = moment(new Date());
			const difference = moment.duration(endTime.diff(currTime));
			setTimeLeft(`
				${difference.hours()}:${difference.minutes() < 10 ? `0${difference.minutes()}` : difference.minutes()}:${difference.seconds() < 10 ? `0${difference.seconds()}` : difference.seconds()}
			`);
		}, 1000);

		return () => clearInterval(loop);

	}, []);

	return (
		<div style={{
			backgroundColor: '#F50359',
			display: 'flex',
			alignItems: 'center',
			borderRadius: '1em 1em 0 0',
			padding: '0.1em 1em 0.1em 0.5em',
		}}>
			<IoMdStopwatch size={'2em'} color={'#ffffff'} />
			<Text style={{
				fontSize: '1.3em',
				fontWeight: '600',
				color: '#ffffff',
				margin: '0 0 0 0.5em',
				letterSpacing: '0.15em'
			}}>
				{timeLeft}
			</Text>
		</div>
	);
};