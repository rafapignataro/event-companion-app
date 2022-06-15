const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
	reactStrictMode: true,
	modifyVars: { '@primary-color': '#000' },
	essVarsFilePath: './src/styles/variables.less',

	webpack(config) {
		return config;
	},
});
