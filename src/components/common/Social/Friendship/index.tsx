import { Avatar, Button, Card, Col, notification, Popover, Row, Typography } from "antd";
import { useState } from "react";
import { MdFace } from "react-icons/md";
import { useUser } from "../../../../contexts/user";
import { Friendship as FriendshipType } from "../../../../services/friendships/findAllFriendships";
import { updateFriendship } from "../../../../services/friendships/updateFriendship";

type FriendshipProps = {
	friendship: FriendshipType
	refreshFriendships: () => void;
}

export const Friendship = ({ friendship, refreshFriendships }: FriendshipProps) => {
	const { user } = useUser();
	const [removingFriendship, setRemovingFriendship] = useState(false);

	const userTypeInFriendship = friendship.friend.id === user.customerId ? 'FRIEND' : 'CUSTOMER';

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onRemoveFriendship = async () => {
		try {
			setRemovingFriendship(true);

			await updateFriendship({
				customerId: userTypeInFriendship === 'FRIEND' ? friendship.customer.id : user.customerId,
				friendId: userTypeInFriendship === 'FRIEND' ? user.customerId : friendship.customer.id,
				status: 'REFUSED'
			});

			openNotification('success', 'Friendship removed!');
			refreshFriendships();
		} catch (err) {
			openNotification('error', err.message || 'There was an error removing this friendship, try again later!');
		} finally {
			setRemovingFriendship(false)
		}
	}

	let friendUserInfo = friendship.friend;
	if (friendship.friend.id === user.customerId) {
		friendUserInfo = friendship.customer;
	}

	return (
		<Popover content={() => <Button block type="primary" onClick={() => onRemoveFriendship()}>Remove</Button>} title="Remover amigo?">
			<Card size="small">
				<Row>
					<Col span={6}>
						<Avatar shape="square" size={64} icon={<MdFace />} style={{ backgroundColor: friendUserInfo.avatarColor }} />
					</Col>
					<Col span={18}>
						<Typography.Title level={3} style={{ margin: 0 }}>{friendUserInfo.user.name}</Typography.Title>
					</Col>
				</Row>
			</Card>
		</Popover>
	)
}