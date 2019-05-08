const { resolve } = require('path')
const Copy = require('copy-webpack-plugin')
const ChromeExtensionLauncher = require('../src/main')

const src = (path = '') => resolve(__dirname, 'src', path)
const dist = resolve(__dirname, 'dist')

/** @return {import('webpack').Configuration} */
module.exports = (env, argv) => {
	const isProd = env === 'prod' || Boolean(env && env.prod)
	const isDev = !isProd

	return {
		entry: {
			background: src('background.js'),
			'content-script': src('content-script.js'),
			popup: src('popup.js'),
			options: src('options.js'),
		},
		output: {
			filename: '[name].js',
			path: dist,
		},
		resolve: { extensions: ['.js'] },
		mode: isProd ? 'production' : 'development',
		devtool: isDev ? 'inline-source-map' : false,
		watch: isDev,
		plugins: [
			new ChromeExtensionLauncher({ launchURL: 'https://github.com', autoDevtools: true }),
			new Copy([src('options.html'), src('popup.html'), src('manifest.json')]),
		],
	}
}
