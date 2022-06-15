import React, { createContext, useContext, useEffect, useState } from 'react';
import { findAllFriendships, Friendship } from '../services/friendships/findAllFriendships';
import { useUser } from './user';

interface FriendshipsProviderProps {
	children: React.ReactNode;
}

interface FriendshipsContextProps {
	friendships: Friendship[];
	notAcceptedFriendships: Friendship[];
	refreshingFriendships: boolean;
	refreshFriendships: () => void;
}

const FriendshipsContext = createContext({} as FriendshipsContextProps);

export default function FriendshipsProvider({ children }: FriendshipsProviderProps) {
	const { user } = useUser();
	const { customerId } = user;

	const [refreshingFriendships, setRefreshinsFriendships] = useState<boolean>(true);

	const [friendships, setFriendships] = useState<Friendship[]>([]);
	const [notAcceptedFriendships, setNotAcceptedFriendships] = useState<Friendship[]>([]);

	const refreshFriendships = async () => {
		try {
			setRefreshinsFriendships(true);

			console.log(customerId)
			const friendships = await findAllFriendships({ customerId });

			setFriendships(friendships.filter(friendship => friendship.status === 'ACCEPTED'));
			setNotAcceptedFriendships(friendships.filter(friendship => friendship.status === 'NOT_ACCEPTED' && friendship.customer.id !== user.customerId));
		} catch (err) {

		} finally {
			setRefreshinsFriendships(false);
		}
	}

	useEffect(() => {
		(async () => await refreshFriendships())();
		const heartBeat = setInterval(async () => {
			await refreshFriendships();
		}, 1000 * 10); // 60s

		return () => clearInterval(heartBeat);
	}, []);

	return (
		<FriendshipsContext.Provider
			value={{
				friendships,
				notAcceptedFriendships,
				refreshingFriendships,
				refreshFriendships
			}}>
			{children}
		</FriendshipsContext.Provider>
	);
}

export function useFriendships() {
	const context = useContext(FriendshipsContext);

	if (!context) throw new Error('useFriendships must me used inside an FriendshipsProvider.');

	return context;
}