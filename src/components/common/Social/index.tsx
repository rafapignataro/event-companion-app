import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, Modal, Popover, Row, Space, Tabs, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { MdFace } from 'react-icons/md';
import { useFriendships } from '../../../contexts/friendships';
import { useUser } from '../../../contexts/user';
import { searchForCustomers, SearchForCustomersResponse } from '../../../services/customers/searchCustomers';
import { Friendship } from './Friendship';
import { FriendshipRequest } from './FriendshipRequest';
import { SearchedCustomer } from './SearchedCustomer';

type FormFields = {
	text: string;
}

export const Social = () => {
	const { user } = useUser();
	const { friendships, notAcceptedFriendships, refreshingFriendships, refreshFriendships } = useFriendships();
	const [screenState, setScreenState] = useState<'FRIENDS_LIST' | 'ADD_FRIEND'>('FRIENDS_LIST');
	const [searching, setSearching] = useState(false);
	const [searchedCustomers, setSearchedCustomers] = useState<SearchForCustomersResponse>([]);

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

	return (
		<Row style={{ height: '100%' }}>
			<Col span={24}>
				<Row align="middle" justify="space-between">
					<Col span={6} style={{ marginRight: '0.1rem' }}>
						<Avatar size={80} style={{ backgroundColor: user.avatarColor, color: '#000' }} icon={<MdFace />} />
					</Col>
					<Col span={17}>
						<Row>
							<Col span={24}>
								<Typography.Title level={3} style={{ margin: 0 }}>
									{user.name}
								</Typography.Title>
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
									<Tabs.TabPane tab={`Friends (${friendships.length})`} key="1" style={{ maxHeight: '250px', overflow: 'auto' }}>
										<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
											{friendships.map(friendship => <Friendship friendship={friendship} refreshFriendships={refreshFriendships} />)}
										</Space>
									</Tabs.TabPane>
									<Tabs.TabPane tab={`Requests (${notAcceptedFriendships.length})`} key="2">
										<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
											{notAcceptedFriendships.map(friendship =>
												<FriendshipRequest
													key={friendship.id}
													friendship={friendship}
													refreshFriendships={refreshFriendships}
												/>)}
										</Space>
									</Tabs.TabPane>
								</Tabs>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Button size="large" block type="primary" icon={<PlusOutlined />} onClick={() => setScreenState('ADD_FRIEND')}>Add new friend</Button>
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
							{searchedCustomers.map(customer => <SearchedCustomer key={customer.id} customer={customer} refreshFriendships={refreshFriendships} />)}
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