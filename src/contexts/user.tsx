import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { decode } from 'jsonwebtoken';
import { isAuthenticated } from '../services/authentication/isAuthenticated';
import { LoadingScreen } from '../components/common/LoadingScreen';
import Router from 'next/router';

type UserProviderProps = {
	children: React.ReactNode;
}

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	customerId: number;
	avatarColor: number;
}

type UserContextProps = {
	user: User;
	loading: boolean;
	saveUser: (token: string, user: User) => void;
	logoutUser: () => void;
}

const UserContext = createContext({} as UserContextProps);

export default function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User>({} as User);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			try {
				await isAuthenticated();

				const cookies = parseCookies();
				const token = cookies['companion_token'];

				const user = decode(token, { json: true });

				if (user) {
					setUser({
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						customerId: user.customerId,
						avatarColor: user.avatarColor
					});
				}
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const saveUser = (token: string, user: User) => {
		setUser(user);

		setCookie(undefined, 'companion_token', token, {
			maxAge: 60 * 60,
		});

		Router.push('/');
	};

	const logoutUser = () => {
		setUser({} as User);

		destroyCookie(undefined, 'companion_token');

		Router.push('/login');
	};

	if (loading) return <LoadingScreen />;

	return (
		<UserContext.Provider value={{ user, loading, saveUser, logoutUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) throw new Error('useUser must me used inside an UserProvider.');

	return context;
}