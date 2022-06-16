import { ToolOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Radio, Row, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Title from 'antd/lib/typography/Title';
import { useState } from 'react';
import { useUser } from '../../../contexts/user';
import { updatePassword } from '../../../services/authentication/updatePassword';
import { Color } from '../../../services/customers/types';
import { updateCustomer } from '../../../services/customers/updateCustomer';

type UpdatePersonalFormFields = {
	name: string;
	email: string;
	avatarColor: Color;
}

type UpdatePasswordFormFields = {
	oldPassword: string;
	newPassword: string;
	newPasswordRepeated: string;
}

export const Settings = () => {
	const { user, logoutUser, saveUser } = useUser();
	const [personalForm] = useForm();
	const [passwordForm] = useForm();

	const [loadingUpdatePersonal, setLoadingUpdatePersonal] = useState(false);
	const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onFinishUpdatePersonal = async ({ name, email, avatarColor }: UpdatePersonalFormFields) => {
		try {
			setLoadingUpdatePersonal(true);

			const customer = await updateCustomer({
				id: user.customerId,
				data: {
					name,
					email,
					avatarColor
				}
			})

			saveUser(customer.token, customer.user);

			openNotification('success', 'Personal info updated!');
		} catch (err) {
			openNotification('error', err.message || 'There was an error trying to update personal info, try again later!');
		} finally {
			setLoadingUpdatePersonal(false);
		}
	}


	const onFinishUpdatePassword = async ({ oldPassword, newPassword, newPasswordRepeated }: UpdatePasswordFormFields) => {
		try {

			if (newPassword !== newPasswordRepeated) return passwordForm.setFields([
				{
					name: 'newPasswordRepeated',
					errors: ['The passwords provided must be the same.']
				}
			]);

			setLoadingUpdatePassword(true);

			await updatePassword({
				userId: user.id,
				oldPassword,
				newPassword,
				newPasswordRepeated
			});

			passwordForm.resetFields();
			openNotification('success', 'Password updated!');
		} catch (err) {
			openNotification('error', err.message || 'There was an error trying to update the password, try again later!');
		} finally {
			setLoadingUpdatePassword(false)
		}
	}

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
			<Col span={24} style={{ height: '400px', marginTop: '1rem', marginBottom: '1rem' }}>
				<Tabs defaultActiveKey="1" centered size="large">
					<Tabs.TabPane tab="Personal" key="1">
						<Form
							name="personalForm"
							layout="vertical"
							onFinish={onFinishUpdatePersonal}
							form={personalForm}
							initialValues={{
								name: user.name,
								email: user.email,
							}}
						>
							<Form.Item
								name="name"
								label="Name"
								required
								rules={[{ required: true, message: 'Please, provide your name!' }]}
							>
								<Input placeholder="Name" size="large" disabled={loadingUpdatePersonal} />
							</Form.Item>
							<Form.Item
								name="email"
								label="E-mail"
								required
								rules={[{ required: true, type: 'email', message: 'Please, provide your email!' }]}
							>
								<Input placeholder="Email" size="large" disabled={loadingUpdatePersonal} />
							</Form.Item>
							<Form.Item
								name="avatarColor"
								label="Avatar color"
								required
								rules={[{ required: true, message: 'Please, select an avatar color!' }]}
							>
								<Radio.Group defaultValue={user.avatarColor} style={{ width: '100%' }}>
									<Row justify="space-between" align="middle">
										<Col span={5}>
											<Radio.Button value="#59FFFF" style={{ backgroundColor: '#59FFFF', width: '100%' }}></Radio.Button>
										</Col>
										<Col span={5}>
											<Radio.Button value="#59FF7D" style={{ backgroundColor: '#59FF7D', width: '100%' }}></Radio.Button>
										</Col>
										<Col span={5}>
											<Radio.Button value="#FF9E59" style={{ backgroundColor: '#FF9E59', width: '100%' }}></Radio.Button>
										</Col>
										<Col span={5}>
											<Radio.Button value="#FF59BC" style={{ backgroundColor: '#FF59BC', width: '100%' }}></Radio.Button>
										</Col>
									</Row>
								</Radio.Group>
							</Form.Item>
							<Form.Item>
								<Button
									size="large"
									type="primary"
									block
									htmlType="submit"
									loading={loadingUpdatePersonal}
								>SAVE</Button>
							</Form.Item>
						</Form>
					</Tabs.TabPane>
					<Tabs.TabPane tab="Password" key="2">
						<Form
							name="passwordForm"
							layout="vertical"
							onFinish={onFinishUpdatePassword}
							form={passwordForm}
							initialValues={{
								name: user.name,
								email: user.email,
							}}
						>
							<Form.Item
								name="oldPassword"
								label="Old Password"
								required
								rules={[{ required: true, message: 'Please, provide your old password!' }]}
							>
								<Input.Password placeholder="Name" size="large" disabled={loadingUpdatePassword} />
							</Form.Item>
							<Form.Item
								name="newPassword"
								label="New Password"
								required
								rules={[{ required: true, message: 'Please, provide your new password!' }, { required: true, min: 6, message: 'The password must have more than 6 characters' }]}
							>
								<Input.Password placeholder="Name" size="large" disabled={loadingUpdatePassword} />
							</Form.Item>
							<Form.Item
								name="newPasswordRepeated"
								label="Repeat Password"
								required
								rules={[{ required: true, message: 'Please, confirm the new password again!' }, { required: true, min: 6, message: 'The password must have more than 6 characters' }]}
							>
								<Input.Password placeholder="Name" size="large" disabled={loadingUpdatePassword} />
							</Form.Item>
							<Form.Item>
								<Button
									size="large"
									type="primary"
									block
									htmlType="submit"
									loading={loadingUpdatePassword}
								>SAVE</Button>
							</Form.Item>
						</Form>
					</Tabs.TabPane>
				</Tabs>
			</Col>
			<Col span={24} style={{ marginBottom: '1rem' }}>
				<Button type="primary" size="large" block onClick={() => logoutUser()}>LOGOUT</Button>
			</Col>
		</Row>
	);
};