
import { LogoutOutlined, MenuOutlined, ScheduleFilled, ShopFilled, SoundFilled } from '@ant-design/icons';
import { Layout, Menu, Typography, Grid, Drawer, Button } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsVinylFill } from 'react-icons/bs';
import { useUser } from '../../../../contexts/user';
import styles from './styles.module.css';

const { Text } = Typography;
const { useBreakpoint } = Grid;

type NavigationProps = {
  selectedPage: string;
}

const routes = [
	{ 
		name: 'Locais', 
		path: '/locations', 
		icon: <ShopFilled style={{fontSize: '1em', marginRight: '0.8em'}} />
	},
	{ 
		name: 'Ativações', 
		path: '/activations',
		icon: <SoundFilled style={{fontSize: '1em', marginRight: '0.8em'}} />
	},
	// { 
	// 	name: 'Atrações', 
	// 	path: '/attractions',
	// 	icon: <BsVinylFill style={{fontSize: '1em', marginRight: '0.8em'}} />
	// },
	// { 
	// 	name: 'Line-ups', 
	// 	path: '/line-ups',
	// 	icon: <ScheduleFilled style={{fontSize: '1em', marginRight: '0.8em'}} />
	// },
];

export const Navigation = ({ selectedPage }: NavigationProps) => {
	const screens = useBreakpoint();
	const router = useRouter();
	const { logoutUser } = useUser();

	const [collapsed, setCollapsed] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	const showDrawer = () => {
		setDrawerVisible(true);
	};

	const onClose = () => {
		setDrawerVisible(false);
	};

	const onCollapse = (collapsed: boolean) => {
		setCollapsed(collapsed);
	};

	return (
		<>
			{screens.lg ? (
				<Layout.Sider 
					collapsible
					collapsed={collapsed}
					onCollapse={onCollapse}
					style={{background: '#ffffff'}}
					breakpoint='xxl'
				>
					{!collapsed && (
						<Layout className={`${styles.menuHeader}`}>
							<Text strong style={{fontSize: '1.5em', textTransform: 'uppercase'}}>Lollapalooza</Text>
							<Text style={{fontSize: '1.2em', textTransform: 'uppercase'}}>Edição 2022</Text>
						</Layout>
					)}
					<Menu defaultSelectedKeys={[selectedPage]} mode="inline" inlineCollapsed={collapsed}>
						{routes.map((route) => {
							return (
								<Menu.Item 
									key={route.path} 
									style={{fontSize: '1.2em'}} 
									icon={route.icon}
									onClick={() => router.push(route.path)}
								>
									{route.name}
								</Menu.Item>
							);
						})}
						<Menu.Item 
							key={'biruliru'} 
							style={{fontSize: '1.2em', marginTop: 'auto'}} 
							icon={<LogoutOutlined style={{fontSize: '1em', marginRight: '0.8em'}} />}
							onClick={() => logoutUser()}
						>
								Logout
						</Menu.Item>
					</Menu>
				</Layout.Sider>
			) : (
				<Header style={{padding: '0 1em'}}>
					<Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} />
					<Drawer 
						bodyStyle={{padding: 0}}
						title={
							<Layout className={`${styles.menuHeader}`}>
								<Text strong style={{fontSize: '1.5em', textTransform: 'uppercase'}}>Lollapalooza</Text>
								<Text style={{fontSize: '1.2em', textTransform: 'uppercase'}}>Edição 2022</Text>
							</Layout>
						} 
						placement="left" 
						onClose={onClose} 
						visible={drawerVisible}
					>
						<Menu defaultSelectedKeys={[selectedPage]} mode="inline">
							{routes.map((route) => {
								return (
									<Menu.Item 
										key={route.path} 
										style={{fontSize: '1.2em'}} 
										icon={route.icon}
										onClick={() => router.push(route.path)}
									>
										{route.name}
									</Menu.Item>
								);
							})}
							<Menu.Item 
								key={'biruliru'} 
								style={{fontSize: '1.2em'}} 
								icon={<LogoutOutlined style={{fontSize: '1em', marginRight: '0.8em'}} />}
								onClick={() => logoutUser()}
							>
								Logout
							</Menu.Item>
						</Menu>
					</Drawer>
				</Header>
			)}
		</>
	);
};