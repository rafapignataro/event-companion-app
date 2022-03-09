import Image from 'next/image';

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
			<Image src="/svg/logo.svg" width="150" height="150" />
			<h1>Carregando ...</h1>
		</div>
	);
};

