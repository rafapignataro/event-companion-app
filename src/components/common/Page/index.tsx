import Head from 'next/head';
import { useUser } from '../../../contexts/user';
import { LoadingScreen } from '../LoadingScreen';

type PageProps = {
  title: string;
  children: React.ReactNode
}

export const Page = ({ title, children }: PageProps) => {
	const { loading } = useUser();

	if(loading) return <LoadingScreen />;

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Head>
				<title>{title} | Event Companion</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{children}
		</div>
	);
};