import { Avatar, Button, Card, Col, notification, Row, Typography } from "antd";
import { useState } from "react";
import { MdFace } from "react-icons/md";
import { useUser } from "../../../../contexts/user";
import { updateFriendship } from "../../../../services/friendships/updateFriendship";

type FriendshipRequestProps = {
	friendshipRequest: {
		id: number;
		customer: {
			id: number;
			avatarColor: string;
			user: {
				id: number;
				name: string;
				email: string;
			}
		}
		friend: {
			id: number;
			avatarColor: string;
			user: {
				id: number;
				name: string;
				email: string;
			}
		}
	}
	refreshFriendships: () => void;
}

export const FriendshipRequest = ({ friendshipRequest, refreshFriendships }: FriendshipRequestProps) => {
	const { user } = useUser();
	const [updatingFriendship, setUpdatingFriendship] = useState(false);

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onUpdateFriendship = async (status: 'ACCEPTED' | 'REFUSED') => {
		try {
			setUpdatingFriendship(true);
			await updateFriendship({
				customerId: friendshipRequest.customer.id,
				friendId: friendshipRequest.friend.id,
				status,
			});

			openNotification('success', `Friendship ${status === 'ACCEPTED' ? 'accepted!' : 'refused!'}`);
			refreshFriendships();
		} catch (err) {
			openNotification('error', err.message || 'There was an error in friendship update, try again later!');
		} finally {
			setUpdatingFriendship(false)
		}
	}

	return (
		<Card size="small">
			<Row>
				<Col span={6}>
					<Avatar shape="square" size={64} icon={<MdFace />} style={{ backgroundColor: friendshipRequest.customer.avatarColor }} />
				</Col>
				<Col span={18}>
					<Row>
						<Col span={24} style={{ marginBottom: '5px' }}>
							<Typography.Title level={3} style={{ margin: 0 }}>{friendshipRequest.customer.user.name}</Typography.Title>
						</Col>
						<Col span={24}>
							<Button type="link" onClick={() => onUpdateFriendship('REFUSED')} loading={updatingFriendship}>Refuse</Button>
							<Button type="primary" onClick={() => onUpdateFriendship('ACCEPTED')} loading={updatingFriendship}>Accept</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	)
}