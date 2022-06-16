
import { Badge } from 'antd';
import { BsCircleFill } from 'react-icons/bs';
import { LocationBadge } from './types';

export default function ActivationBadge({ active, near, children }: LocationBadge) {
	if (!active) return (
		<>{children}</>
	);

	return (
		<Badge count={<BsCircleFill />} style={{
			color: '#f5222d',
			borderRadius: '50%',
			right: '.75em',
			top: '.75em',
			border: '.3em solid #fff',
			width: near ? '1.8em' : '1.5em',
			height: near ? '1.8em' : '1.5em',
		}}>
			{children}
		</Badge>
	);
}