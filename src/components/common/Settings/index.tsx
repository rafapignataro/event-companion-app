import { ToolOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Title from 'antd/lib/typography/Title';
import { useState } from 'react';
import { useUser } from '../../../contexts/user';


export const Settings = () => {
	const { user, logoutUser } = useUser();
	const [settingsForm] = useForm();
	const [loading, setLoading] = useState(false);

	return (
		<Row>
			<Col span={24}>
				<Row>
					<Col span={8}>
						<ToolOutlined style={{ fontSize: '1.5rem' }} />
					</Col>
					<Col>
						<Title level={4} style={{ textTransform: 'uppercase', letterSpacing: '0.25em', margin: '0 auto', transform: 'translateX(-0.5em)' }}>
							Settings
						</Title>
					</Col>
				</Row>
			</Col>
			<Col span={24} style={{ height: '400px', marginTop: '1rem' }}>
				<Form
					name="settingsForm"
					layout="vertical"
					onFinish={() => { }}
					form={settingsForm}
					initialValues={{
						name: user.name,
						email: user.email,
					}}
				>
					<Form.Item
						name="name"
						label="name"
						required
						rules={[{ required: true, message: 'Please, provide your name!' }]}
					>
						<Input placeholder="Name" size="large" disabled={loading} />
					</Form.Item>
					<Form.Item
						name="email"
						label="E-mail"
						required
						rules={[{ required: true, type: 'email', message: 'Please, provide your email!' }]}
					>
						<Input placeholder="Email" size="large" disabled={loading} />
					</Form.Item>
					<Form.Item>
						<Button
							size="large"
							type="primary"
							block
							htmlType="submit"
							loading={loading}
						>SAVE</Button>
					</Form.Item>
				</Form>
			</Col>
			<Col span={24} style={{ height: '400px', marginBottom: '1rem' }}>
				<Button type="primary" size="large" block onClick={() => logoutUser()}>LOGOUT</Button>
			</Col>
		</Row>
	);
};