module.exports = {
	entry: {
		index: './index.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader' }
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: 'vendors',
			cacheGroups: {
				resq: {
					test: /[\\/]node_modules[\\/]resq[\\/]/,
					name: 'resq',
					enforce: true
				}
			}
		}
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
		'react-json-tree': 'ReactJsonTree',
		q: 'Q'
	},
	devServer: {
		publicPath: '/dist/'
	}
};
