import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import eslint from '@rollup/plugin-eslint';
import { babel } from '@rollup/plugin-babel';
import { name, version, author } from './package.json';

const path = require('path');
const resolve = (...relativePath) => path.resolve(__dirname, ...relativePath);

const PKG_NAME = 'rollupPluginIconfont';
const banner =
'/*!\n' +
` * ${name} v${version}\n` +
` * (c) 2021-${new Date().getFullYear()} ${author}\n` +
' * Released under the ISC License.\n' +
' */';

export default {
	input: resolve('./src/index.js'),
	output: [
		{
			name: PKG_NAME,
			file: resolve('dist', `${PKG_NAME}.esm.js`),
			format: 'esm',
			strict: true,
			banner
		},
		{
			name: PKG_NAME,
			file: resolve('dist', `${PKG_NAME}.esm.min.js`),
			format: 'esm',
			strict: true,
			banner,
			plugins: [terser()]
		},
		{
			name: PKG_NAME,
			file: resolve('dist', `${PKG_NAME}.cjs.js`),
			format: 'cjs',
			banner
		},
		{
			name: PKG_NAME,
			file: resolve('dist', `${PKG_NAME}.cjs.min.js`),
			format: 'cjs',
			banner,
			plugins: [terser()]
		}

	],
	plugins: [
		clear({
			targets: ['dist']
		}),
		nodeResolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		eslint({
			throwOnError: true,
			include: ['src/**'],
			exclude: ['node_modules/**']
		}),
		babel({
			babelHelpers: 'bundled'

		})

	]
};
