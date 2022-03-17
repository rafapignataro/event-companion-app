import { Layout, Typography } from 'antd';

const { Title } = Typography;

type SideMenuProps = {
  title: string;
  children: React.ReactNode
}

export const SideMenu = ({ title, children }: SideMenuProps) => {
	return (
		<>
			<Layout style={{ minHeight: '100vh' }}>
				<Title style={{textAlign: 'center'}}>{title}</Title>
				<Layout style={{padding: '0 1em'}}>
					{children}
				</Layout>
			</Layout>
		</>
	);
};