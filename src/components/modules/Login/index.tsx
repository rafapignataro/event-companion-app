import Image from 'next/image';

import { authenticate } from '../../../services/authentication/authenticate';
import { useUser } from '../../../contexts/user';
import { Page } from '../../common/Page';
import { Button, Col, Form, Input, Row, notification, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Link from 'next/link';
import { useState } from 'react';

type FormFields = {
	email: string;
	password: string;
}

export const Login = () => {
	const [loginForm] = useForm();
	const [loading, setLoading] = useState(false);

	const { saveUser } = useUser();

	const openNotification = (type: string, message: string, err?: string) => {
		if (type == 'success' || type == 'error')
			notification[type]({ message: message, description: err });
		return;
	};

	const onFinishLogin = async ({ email, password }: FormFields) => {
		try {
			setLoading(true);
			const { token, user } = await authenticate({ email, password });

			saveUser(token, user);
			openNotification('success', 'Welcome back!');
		} catch (err: any) {
			console.log(err);
			openNotification('error', err.message || 'There was an error, try again later!');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Page title="Login">
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
							name="loginForm"
							layout="vertical"
							onFinish={onFinishLogin}
							form={loginForm}
						>
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
								>ENTER</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col span={24}>
						<Row justify="center">
							<Link href="/register">
								<Typography.Link color="black">Not a member yet?</Typography.Link>
							</Link>
						</Row>
					</Col>
				</Row>
			</div>
		</Page >
	);
};

