/*
 * @Author: daipeng7
 * @Date: 2021-07-15 17:01:59
 * @LastEditTime: 2023-12-28 16:06:38
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

module.exports = function rollupPluginIconfont(options = {}) {
	const required = ['svgs', 'fontsOutput', 'cssOutput'];

	for (const r of required) {
		if (!options[r]) {
			throw new Error(`Require '${r}' option`);
		}
	}
	options = Object.assign({}, options);
	const build = (callback) => {
		return nodify(
			generate.byGlobby(options).then(result => {
				return writeFiles(result);
			}).then(ret => {
				console.log('iconfont + css have been built with ' + ret.glyphDatas.length + ' svg-icons.');
				options.success && options.success();
				return ret;
			}).catch(console.error.bind(console)),
			error => callback && callback(error)
		);
	};
	const watch = () => {
		const comileDebounce = thro_debs.debounce(800, build.bind(this));
		const svgs = [].concat(options.svgs);

		// 只有一个文件夹时，监视文件夹。支持新增。/ab/c/*.svg
		if (svgs.length === 1) {
			const dir = path.dirname(svgs[0]).replace('*.svg', '');
			if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
				fs.watch(dir, (event, filename) => {
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
				fs.watch(file, (event, filename) => {
					comileDebounce();
				});
			});
		});
	};
	return {
		name: 'rollupPluginIconfont',
		buildStart() {
			return build().then(() => {
				options.watch && watch();
			});
		}
	};
};
