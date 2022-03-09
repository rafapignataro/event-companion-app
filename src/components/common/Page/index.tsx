import { Head } from 'next/document';

type PageProps = {
  title: string;
  children: React.ReactNode
}

export const Page = ({ title, children }: PageProps) => {
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