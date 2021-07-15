/**
 * @description 批量生成字体图标数据
*/
const createThrottle = require('async-throttle');
const defaultMetadataProvider = require('svgicons2svgfont/src/metadata');
const fs = require('fs');

module.exports = function getGlyphDatas(files, options) {
	const throttle = createThrottle(options.maxConcurrency);

	const orderedFiles = files.sort((f1, f2) => f1 > f2 ? 1 : -1);

	return Promise.all(
		orderedFiles.map((srcPath, index) => {
			return throttle(() => {
				// 读取svg数据
				return new Promise((resolve, reject) => {
					let glyphContents = '';

					fs.createReadStream(srcPath).on('error', glyphError => reject(glyphError))
						.on('data', data => {
							glyphContents += data.toString();
						})
						.on('end', () => {
							if (glyphContents.length === 0) {
								reject(new Error(`Empty file ${srcPath}`));
								return;
							}

							const glyphData = {
								contents: glyphContents,
								srcPath
							};

							resolve(glyphData);
						});
				});
			}).then(glyphData =>
				new Promise((resolve, reject) => {
					// 转换
					const metadataProvider = options.metadataProvider ||
                        defaultMetadataProvider({ prependUnicode: options.prependUnicode, startUnicode: options.startUnicode + index });
					metadataProvider(glyphData.srcPath, (error, metadata) => {
						if (error) {
							return reject(error);
						}
						glyphData.metadata = metadata;
						return resolve(glyphData);
					});
				})
			);
		})
	);
};
