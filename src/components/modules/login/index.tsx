import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { setCookie } from 'nookies';

import { authenticate } from '../../../services/authentication/authenticate';
import { useUser } from '../../../contexts/user';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const { saveUser } = useUser(); 

	const handleLoginSubmit = async (event: FormEvent) => {
		try {
			event.preventDefault();
			setLoading(true);

			const { token, user } = await authenticate({ email, password });
			console.log('uhasuahsuha');
			saveUser(token, user);
		} catch (err) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Head>
				<title>Login | Event Companion</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				<Image src="/svg/logo.svg" width="150" height="150" />
				<form onSubmit={handleLoginSubmit}>
					<div>
						<label htmlFor="email">E-mail</label>
						<input id="email" type="email" value={email} onChange={event => setEmail(event.target.value)} />
					</div>
					<div>
						<label>Password</label>
						<input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
					</div>
					<button disabled={loading}>{loading ? 'Carregando...' : 'ENTRAR'}</button>
				</form>
			</div>
		</div>
	);
};

