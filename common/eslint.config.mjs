// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';
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
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
		],
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'quotes': [
				'error',
				'single'
			],
			'semi': [
				'error',
				'always'
			]
		},
	},
	eslintPluginPrettierRecommended,
);
