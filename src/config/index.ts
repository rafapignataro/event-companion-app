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
		apiURL: 'https://event-companion-api.herokuapp.com'
	}
};

const globalConfig = config[process.env.NODE_ENV];

export { globalConfig };
