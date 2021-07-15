/*
 * @Author:
 * @Date: 2019-11-19 12:00:22
 * @LastEditors  : VSCode
 * @LastEditTime : 2019-12-19 14:24:57
 * @Description:
 */
// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	env: {
		browser: false,
		es2021: true,
		jest: true // 支持jest
	},
	extends: [
		// 'plugin:jest/recommended',
		'standard'
	],
	// required to lint *.vue files
	plugins: [],
	// add your custom rules here
	rules: {
		'array-bracket-spacing': ['error', 'never'],
		'new-cap': 'off',
		'jest/no-jest-import': 'off',
		'no-tabs': 'off',
		'no-new': 'off',
		'no-unused-vars': 'off',
		'no-mixed-operators': 'off',
		'no-useless-return': 'off',
		'no-useless-constructor': 'off',
		'no-useless-catch': 'off',
		'no-useless-escape': 'off',
		indent: ['error', 'tab', { VariableDeclarator: 1 }],
		// 语句强制分号结尾
		semi: [2, 'always'],
		// 语句强制分号结尾
		'semi-spacing': [0, { before: false, after: true }],
		// 不在function前面加空格
		'space-before-function-paren': 0,
		// allow async-await
		'generator-star-spacing': 'off',
		// 禁止空格和 tab 的混合缩进
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		// 要求尽可能使用
		quotes: ['error', 'single', { allowTemplateLiterals: true }],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// 禁止使用没有必要的三元操作符，因为用些三元操作符可以使用其他语句替换,0不禁止，2禁止
		'no-unneeded-ternary': [0, { defaultAssignment: true }],
		camelcase: 0,
		// 对象字面量属性是否使用引号
		'quote-props': ['error', 'as-needed'],
		'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }]
	}
};
