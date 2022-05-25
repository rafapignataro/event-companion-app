import { Spin } from 'antd';

export const LoadingScreen = () => {
	return (
		<div style={{ 
			height: '100%', 
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			{/* <Image src="/svg/logo.svg" width="150" height="150" /> */}
			<Spin tip="Carregando..."/>
		</div>
	);
};

