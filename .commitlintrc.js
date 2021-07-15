module.exports = {
	extends: [
		'@commitlint/config-conventional'
	],
	rules: {
		'type-enum': [ 2, 'always', [
			'update', 'feature', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'init'
		]]
	}
}
