import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '../../../contexts/user';
import { LoadingScreen } from '../LoadingScreen';
import { Navigation } from './Navigation';

type PageProps = {
  title: string;
  children: React.ReactNode
}

export const Page = ({ title, children }: PageProps) => {
	const { loading } = useUser();
	const router = useRouter();

	const currentPage = router.pathname || '/';

	if(loading) return <LoadingScreen />;

	return (
		<>
			<Head>
				<title>{title} | Event Companion</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout style={{ minHeight: '100vh' }}>
				<Navigation selectedPage={currentPage} />
				<Content style={{position: 'relative'}}>
					{children}
				</Content>
			</Layout>
		</>
	);
};