import Head from 'next/head';
import Image from 'next/image';
import { setCookie } from 'nookies';

export const Home = () => {
	return (
		<div>
			<Head>
				<title>Dashboard | Event Companion</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				<h1>Dashboard</h1>
			</div>
		</div>
	);
};

