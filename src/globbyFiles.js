/**
 * @description 根据glob文件规范解析指定目录文件路径
*/
const globby = require('globby');
const path = require('path');

module.exports = function (svgsGlobbyOrFileNames) {
	const arr = [].concat(svgsGlobbyOrFileNames);
	if (arr.join('|').indexOf('*') === -1) {
		return Promise.resolve(filterFiles(arr));
	}
	return globby(arr).then(filterFiles);

	function filterFiles(foundFiles) {
		const filteredFiles = foundFiles.filter(
			foundFile => path.extname(foundFile).toLowerCase() === '.svg'
		);

		if (filteredFiles.length === 0) {
			throw new Error(
				'Svg glob patterns specified did not match any svgs:\n' + svgsGlobbyOrFileNames
			);
		}
		return filteredFiles;
	}
};
