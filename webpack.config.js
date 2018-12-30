module.exports = {
	entry: {
		index: './index.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader' }
		]
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		q: 'Q'
	},
	devServer: {
		publicPath: '/dist/'
	}
};
