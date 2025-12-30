// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		rules: {
			// Angular selectors with custom prefixes
			'@angular-eslint/component-selector': [
				'error',
				{type: 'element', prefix: ['app', 'cc'], style: 'kebab-case'},
			],
			'@angular-eslint/directive-selector': [
				'error',
				{type: 'attribute', prefix: ['app', 'cc'], style: 'camelCase'},
			],
			'@angular-eslint/no-output-on-prefix': 'off',
			'@angular-eslint/no-output-native': 'off',
			
			// TypeScript rules - relaxed from defaults
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-inferrable-types': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-ignore': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/prefer-for-of': 'off',
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			
			// Code style
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'brace-style': ['error', '1tbs'],
			curly: 'error',
			eqeqeq: ['error', 'smart'],
			'guard-for-in': 'error',
			'no-bitwise': 'error',
			'no-caller': 'error',
			'no-eval': 'error',
			'no-new-wrappers': 'error',
			'no-throw-literal': 'error',
			radix: 'error',
			'max-len': ['error', 180],
			
			// Relaxed from defaults
			'no-empty': 'off',
			'no-constant-condition': 'off',
			'no-unused-vars': 'off',
			
			
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {
			// Disable due to bug in angular-eslint with certain template expressions
			'@angular-eslint/template/eqeqeq': 'off',
		},
	},
);
