import { Avatar, Button, Card, Col, Modal, Popover, Row, Space, Tabs, Typography } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { MdFace } from 'react-icons/md';
import { useLocation } from '../../../../contexts/location';
import { useUser } from '../../../../contexts/user';
import Explore from '../../Menu/Explore';

export const Social = () => {
	const { user } = useUser();

	return (
		<div>
			<Row>
				<Col span={24}>
					<Row justify="center" align="middle">
						<Avatar size={96} style={{ backgroundColor: '#35e67f' }} icon={<MdFace />} />
					</Row>
				</Col>
				<Col span={24} >
					<Typography.Title level={2} style={{ textAlign: 'center', marginTop: '0.5rem' }}>
						{user.name}
					</Typography.Title>
				</Col>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Row justify="center" align="middle">
						<Col span={8}>
							<Row justify="center" align="middle">
								<Col span={24}>
									<Typography.Title level={4} style={{ margin: 0 }}>9</Typography.Title>
								</Col>
								<Col span={24}>
									<Typography.Title level={4}>Eventos</Typography.Title>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row justify="center" align="middle">
								<Col span={24}>
									<Typography.Title level={4} style={{ margin: 0 }}>12</Typography.Title>
								</Col>
								<Col span={24}>
									<Typography.Title level={4}>Amigos</Typography.Title>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row>
						<Col span={24}>
							<Tabs defaultActiveKey="1" onChange={() => { }} centered size="large">
								<Tabs.TabPane tab="Geral (12)" key="1">
									<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
										<Popover content={() => <Button>Remover</Button>} title="Remover amigo?">
											<Card size="small">
												<Row>
													<Col span={6}>
														<Avatar shape="square" size={64} icon={<MdFace />} />
													</Col>
													<Col span={18}>
														<Typography.Title level={3} style={{ margin: 0 }}>Vinicius Junqueira</Typography.Title>
													</Col>
												</Row>
											</Card>
										</Popover>
										<Popover content={() => <Button>Remover</Button>} title="Remover amigo?">
											<Card size="small">
												<Row>
													<Col span={6}>
														<Avatar shape="square" size={64} icon={<MdFace />} />
													</Col>
													<Col span={18}>
														<Typography.Title level={3} style={{ margin: 0 }}>Vinicius Junqueira</Typography.Title>
													</Col>
												</Row>
											</Card>
										</Popover>
										<Popover content={() => <Button>Remover</Button>} title="Remover amigo?">
											<Card size="small">
												<Row>
													<Col span={6}>
														<Avatar shape="square" size={64} icon={<MdFace />} />
													</Col>
													<Col span={18}>
														<Typography.Title level={3} style={{ margin: 0 }}>Vinicius Junqueira</Typography.Title>
													</Col>
												</Row>
											</Card>
										</Popover>
									</Space>
								</Tabs.TabPane>
								<Tabs.TabPane tab="Pedidos (2)" key="2">
									<Row>
										<Col span={24}>Amigo 1</Col>
										<Col span={24}>Amigo 2</Col>
									</Row>
								</Tabs.TabPane>
							</Tabs>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};