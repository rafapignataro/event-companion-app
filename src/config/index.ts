type Config = {
	env: string;
	apiURL: string;
}

type ConfigOptions = {
	[key: string]: Config
}

const config: ConfigOptions = {
	development: {
		env: 'development',
		apiURL: 'http://localhost:3001'
	},
	staging: {
		env: 'staging',
		apiURL: 'http://ec2-15-228-77-86.sa-east-1.compute.amazonaws.com:3000'
	}
};

const globalConfig = config[process.env.NEXT_PUBLIC_NODE_ENV || 'development'];

export { globalConfig };
