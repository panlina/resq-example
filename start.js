process.env.NODE_ENV = "development";

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
webpackConfig.mode = "development";
webpackConfig.entry.index = [webpackConfig.entry.index, 'webpack-dev-server/client/'];

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    publicPath: "/dist/",
});

server.listen(8080);
