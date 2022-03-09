import Head from 'next/head';
import Image from 'next/image';

export const Loading = () => {
	return (
		<div>
			<Head>
				<title>Loading | Event Companion</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				<div>
					<Image src="/svg/logo.svg" width="150" height="150" />
					<h1>Carregando ...</h1>
				</div>
			</div>
		</div>
	);
};

