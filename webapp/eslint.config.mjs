// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig(
	{
		languageOptions: {
			globals: globals['shared-node-browser'],
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@angular-eslint/component-class-suffix': 'error',
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: ['app', 'cc'],
					style: 'kebab-case',
				},
			],
			'@angular-eslint/directive-class-suffix': 'error',
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: ['app', 'cc'],
					style: 'camelCase',
				},
			],
			'@angular-eslint/no-input-rename': 'error',
			'@angular-eslint/no-output-rename': 'error',
			'@angular-eslint/use-lifecycle-interface': 'error',
			'@angular-eslint/use-pipe-transform-interface': 'error',
			'@angular-eslint/no-output-on-prefix': 'off',
			'@angular-eslint/no-output-native': 'off',
			'@angular-eslint/prefer-standalone': 'warn',
			'@typescript-eslint/consistent-type-definitions': 'error',
			'@typescript-eslint/dot-notation': 'off',
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/explicit-member-accessibility': [
				'off',
				{
					accessibility: 'explicit',
				},
			],
			'@stylistic/member-delimiter-style': [
				'error',
				{
					multiline: {
						requireLast: true,
					},
					singleline: {
						delimiter: 'comma',
						requireLast: false,
					},
				},
			],
			'@typescript-eslint/member-ordering': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-inferrable-types': 'warn',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unsafe-call': 'warn',
			'@typescript-eslint/no-unsafe-member-access': 'warn',
			'@typescript-eslint/no-unsafe-assignment': 'warn',
			'@typescript-eslint/no-unsafe-return': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-misused-promises': 'warn',
			'@typescript-eslint/require-await': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/type-annotation-spacing': 'error',
			'@typescript-eslint/unified-signatures': 'error',
			'brace-style': ['error', '1tbs'],
			camelcase: 'off',
			'constructor-super': 'error',
			curly: 'error',
			'eol-last': 'error',
			eqeqeq: ['error', 'smart'],
			'guard-for-in': 'error',
			'id-blacklist': 'off',
			'id-match': 'off',
			'no-bitwise': 'error',
			'no-caller': 'error',
			'no-debugger': 'error',
			'no-empty': 'off',
			'no-eval': 'error',
			'no-fallthrough': 'error',
			'no-new-wrappers': 'error',
			'no-restricted-imports': 'error',
			'no-throw-literal': 'error',
			'no-trailing-spaces': 'off',
			'no-undef-init': 'error',
			'no-underscore-dangle': 'off',
			'no-unused-labels': 'error',
			'no-unused-vars': 'off',
			'no-var': 'error',
			'no-constant-condition': 'off',
			'prefer-const': 'error',
			radix: 'error',
			'quote-props': 'off',
			'max-len': ['error', 180],
		},
	},
	{
		files: ['src/app/**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {},
	},
	eslintPluginPrettierRecommended,
);
