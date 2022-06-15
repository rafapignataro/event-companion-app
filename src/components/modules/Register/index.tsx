import Image from 'next/image';
import Router from 'next/router';
import { useForm } from 'antd/lib/form/Form';

import Link from 'next/link';
import { Page } from '../../common/Page';
import { Button, Col, Form, Input, Row, notification, Typography } from 'antd';
import { createCustomer } from '../../../services/customers/createCustomer';
import { useState } from 'react';

type FormFields = {
	name: string;
	email: string;
	password: string;
	passwordRepeated: string;
}

export const Register = () => {
	const [registerForm] = useForm();
	const [loading, setLoading] = useState(false);

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onFinishRegister = async ({ name, email, password, passwordRepeated }: FormFields) => {
		try {
			if (password !== passwordRepeated) return registerForm.setFields([
				{
					name: 'passwordRepeated',
					errors: ['The passwords provided must be the same.']
				}
			]);

			setLoading(true);

			await createCustomer({ name, email, password, passwordRepeated });

			openNotification('success', 'Successfully registered!');
			Router.push('/login');
		} catch (err) {
			console.log(err)
			openNotification('error', err.message || 'There was an error, try again later!');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Page title="Register">
			<div style={{
				height: '100vh',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '1rem'
			}}>
				<Row>
					<Col span={24} style={{ marginBottom: '2rem' }}>
						<Row align="middle" justify="center">
							<Image src="/svg/logo.svg" width="150" height="150" />
						</Row>
					</Col>
					<Col span={24}>
						<Form
							name="registerForm"
							layout="vertical"
							onFinish={onFinishRegister}
							form={registerForm}
						>
							<Form.Item
								name="name"
								label="Name"
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
							<Form.Item
								name="password"
								label="Password"
								required
								rules={[
									{ required: true, message: 'Please, provide your password!' },
									{ required: true, min: 6, message: 'The password must have more than 6 characters' }
								]}
							>
								<Input.Password placeholder="Senha" size="large" disabled={loading} />
							</Form.Item>
							<Form.Item
								name="passwordRepeated"
								label="Repeat Password"
								required
								rules={[{ required: true, message: 'Please, provide your password!' }]}
							>
								<Input.Password placeholder="Senha" size="large" disabled={loading} />
							</Form.Item>
							<Form.Item>
								<Button
									size="large"
									type="primary"
									block
									htmlType="submit"
									loading={loading}
								>REGISTER</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col span={24}>
						<Row justify="center">
							<Link href="/login">
								<Typography.Link color="black">Already have an account?</Typography.Link>
							</Link>
						</Row>
					</Col>
				</Row>
			</div>
		</Page >
	);
};

