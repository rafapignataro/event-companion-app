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
	production: {
		env: 'production',
		apiURL: 'http://localhost:3001'
	}
};

const globalConfig = config[process.env.NODE_ENV];

export { globalConfig };
