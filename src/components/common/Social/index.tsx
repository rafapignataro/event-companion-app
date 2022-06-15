import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, Modal, Popover, Row, Space, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { MdFace } from 'react-icons/md';
import { useUser } from '../../../contexts/user';
import { searchForCustomers, SearchForCustomersResponse } from '../../../services/customers/searchCustomers';
import { findAllFriendships, FindAllFriendshipsResponse } from '../../../services/friendships/findAllFriendships';
import { FriendshipRequest } from './FriendshipRequest';
import { SearchedCustomer } from './SearchedCustomer';

type FormFields = {
	text: string;
}

export const Social = () => {
	const { user } = useUser();
	const [screenState, setScreenState] = useState<'FRIENDS_LIST' | 'ADD_FRIEND'>('FRIENDS_LIST');
	const [searching, setSearching] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [searchedCustomers, setSearchedCustomers] = useState<SearchForCustomersResponse>([]);
	const [friends, setFriends] = useState<FindAllFriendshipsResponse>([]);
	const [friendshipRequests, setFriendshipRequests] = useState<FindAllFriendshipsResponse>([]);

	useEffect(() => {
		(async () => {
			const friendships = await findAllFriendships({ customerId: user.customerId });
			setFriends(friendships.filter(friendship => friendship.status === 'ACCEPTED'))
			setFriendshipRequests(friendships.filter(friendship => friendship.status === 'NOT_ACCEPTED' && friendship.customer.id !== user.customerId))
		})();
	}, [])

	const onFinishSearch = async ({ text }: FormFields) => {
		try {
			setSearching(true);
			const customers = await searchForCustomers({ text });

			setSearchedCustomers(customers.filter(c => c.id !== user.customerId));
		} catch (err) {
			console.log(err)
		} finally {
			setSearching(false);
		}
	}

	const onRefreshFriendships = async () => {
		try {
			setRefreshing(true);

			const friendships = await findAllFriendships({ customerId: user.customerId });

			setFriends(friendships.filter(friendship => friendship.status === 'ACCEPTED'))
			setFriendshipRequests(friendships.filter(friendship => friendship.status === 'NOT_ACCEPTED' && friendship.customerId !== user.customerId))
		} catch (err) {

		} finally {
			setRefreshing(false);
		}
	}

	return (
		<Row style={{ height: '100%' }}>
			<Col span={24}>
				<Row align="middle" justify="space-between">
					<Col span={6} style={{ marginRight: '0.1rem' }}>
						<Avatar size={80} style={{ backgroundColor: user.avatarColor }} icon={<MdFace />} />
					</Col>
					<Col span={17}>
						<Row>
							<Col span={24}>
								<Typography.Title level={3} style={{ margin: 0 }}>
									{user.name}
								</Typography.Title>
							</Col>
							<Col span={24}>
								<Row align="middle">
									<Col span={24}>
										<Typography.Title level={3} style={{ margin: 0 }}>
											5
											<Typography.Text type="secondary" style={{ margin: 0, fontSize: '1.2rem', marginLeft: '.25rem', marginRight: '.5rem' }}>
												Events
											</Typography.Text>
											&nbsp;
											{friends.length}
											<Typography.Text type="secondary" style={{ margin: 0, fontSize: '1.2rem', marginLeft: '.25rem' }}>
												Friends
											</Typography.Text>
										</Typography.Title>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
			{screenState === 'FRIENDS_LIST' && (
				<>
					<Col span={24} style={{ marginBottom: '1rem' }}>
						<Row align="stretch">
							<Col span={24}>
								<Tabs defaultActiveKey="1" onChange={() => { }} centered size="large">
									<Tabs.TabPane tab={`Friends (${friends.length})`} key="1" style={{ maxHeight: '250px', overflow: 'auto' }}>
										<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
											{friends.map(friend => {
												console.log(friend)
												let friendUserInfo = friend.friend;

												if (friend.friend.id === user.customerId) {
													friendUserInfo = friend.customer;
												}

												return (
													<Popover content={() => <Button block type="primary">Remove</Button>} title="Remover amigo?">
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
											})}
										</Space>
									</Tabs.TabPane>
									<Tabs.TabPane tab={`Requests (${friendshipRequests.length})`} key="2">
										<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
											{friendshipRequests.map(friendshipRequest =>
												<FriendshipRequest
													key={friendshipRequest.id}
													friendshipRequest={friendshipRequest}
													refreshFriendships={onRefreshFriendships}
												/>)}
										</Space>
									</Tabs.TabPane>
								</Tabs>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Button size="large" block type="primary" icon={<PlusOutlined />} onClick={() => setScreenState('ADD_FRIEND')}>Adicionar amigo</Button>
					</Col>
				</>
			)}
			{screenState === 'ADD_FRIEND' && (
				<>
					<Col span={24} style={{ margin: '1rem 0' }}>
						<Form
							name="customized_form_controls"
							onFinish={onFinishSearch}
						>
							<Row align="middle" justify="space-between">
								<Col span={16}>
									<Form.Item name="text" style={{ margin: 0 }}>
										<Input disabled={searching} placeholder="Search for friends" />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item style={{ margin: 0 }}>
										<Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={searching} block>
											Search
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col span={24}>
						<Space direction="vertical" size="middle" style={{ display: 'flex', maxHeight: '250px', overflow: 'auto', marginBottom: '1rem' }}>
							{searchedCustomers.map(customer => <SearchedCustomer key={customer.id} customer={customer} refreshFriendships={onRefreshFriendships} />)}
						</Space>
					</Col>
					<Col span={24}>
						<Button size="large" block type="primary" icon={<CloseOutlined />} onClick={() => setScreenState('FRIENDS_LIST')}>CANCEL</Button>
					</Col>
				</>
			)}
		</Row>
	);
};