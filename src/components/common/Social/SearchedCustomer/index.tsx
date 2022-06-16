import { Avatar, Button, Card, Col, notification, Row, Typography } from "antd";
import Form from "antd/lib/form/Form";
import { useState } from "react";
import { MdFace } from "react-icons/md";
import { useUser } from "../../../../contexts/user";
import { SearchForCustomerType } from "../../../../services/customers/searchCustomers";
import { createFriendship } from "../../../../services/friendships/createFriendship";

type SearchedCustomerProps = {
	customer: SearchForCustomerType;
	refreshFriendships: () => void;
}

export const SearchedCustomer = ({ customer, refreshFriendships }: SearchedCustomerProps) => {
	const { user } = useUser();
	const [requestingFriendship, setRequestingFriendship] = useState(false);

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onRequestFriendship = async () => {
		try {
			setRequestingFriendship(true);

			await createFriendship({
				customerId: user.customerId,
				friendId: customer.id,
			});

			openNotification('success', 'Friendship requested!');
			refreshFriendships();
		} catch (err) {
			openNotification('error', err.message || 'There was an error in the friendship request, try again later!');
		} finally {
			setRequestingFriendship(false)
		}
	}

	return (
		<Card size="small" key={customer.id}>
			<Row>
				<Col span={6}>
					<Avatar shape="square" size={64} icon={<MdFace />} style={{ backgroundColor: customer.avatarColor, color: '#000' }} />
				</Col>
				<Col span={18}>
					<Row>
						<Col span={24} style={{ marginBottom: '5px' }}>
							<Typography.Title level={3} style={{ margin: 0 }}>{customer.user.name}</Typography.Title>
						</Col>
						<Col span={24}>
							<Button type="primary" onClick={() => onRequestFriendship()} loading={requestingFriendship}>Request friendship</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	)
}