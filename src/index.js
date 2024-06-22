/*
 * @Author: daipeng7
 * @Date: 2021-07-15 17:01:59
 * @LastEditTime: 2024-05-22 10:50:41
 * @LastEditors: DaiPeng
 * @Description: iconfont rollup plugin
 */
const nodify = require('nodeify');
const path = require('path');
const fs = require('fs');
const generate = require('./generate');
const writeFiles = require('./writeFiles');
const thro_debs = require('thro-debs');
const globby = require('globby');
const defaultOptions = require('./defaultOptions');

module.exports = function rollupPluginIconfont(options = {}) {
	const required = ['svgs', 'fontsOutput'];

	for (const r of required) {
		if (!options[r]) {
			throw new Error(`Require '${r}' option`);
		}
	}
	if (!options.cssOutput) {
		options.cssOutput = path.resolve(options.fontsOutput, options.fontName + '.css');
	}
	options = Object.assign({}, defaultOptions, options);
	const build = () => {
		return generate.byGlobby(options).then(result => {
			return writeFiles(result);
		}).then(ret => {
			console.log('iconfont + css have been built with ' + ret.glyphDatas.length + ' svg-icons.');
			options.success && options.success();
			return ret;
		}).catch(console.error.bind(console));
	};
	const watch = () => {
		if (process.env.NODE_ENV !== 'production') {
			let watchers1;
			let watchers2;

			const svgs = [].concat(options.svgs);
			const comileDebounce = thro_debs.debounce(800, build.bind(this));

			// 只有一个文件夹时，监视文件夹。支持新增。/ab/c/*.svg
			if (svgs.length === 1) {
				const dir = path.dirname(svgs[0]).replace('*.svg', '');
				if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
					watchers1 = fs.watch(dir, (event, filename) => {
						if (filename.length > 4 && filename.slice(-4) === '.svg') {
							comileDebounce();
						}
					});
					return;
				}
			}

			// 监视每个文件。/ab/c/**/*.svg
			globby(svgs).then(files => {
				files.forEach(file => {
					watchers2 = fs.watch(file, (event, filename) => {
						comileDebounce();
					});
				});
			});

			process.on('SIGHUP', function () {
				watchers1?.close();
				watchers2?.close();
				process.exit();
			});
		}
	};
	return {
		name: 'rollupPluginIconfont',
		buildStart() {
			return build().then((result) => {
				options.watch && watch();
				return result;
			});
		}
	};
};
