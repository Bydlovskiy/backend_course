import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'migrations/', '**/*.{js,mjs,cjs}']
  },
  ...tsEslint.config(pluginJs.configs.recommended, {
    extends: [...tsEslint.configs.recommended],
    plugins: {
      '@typescript-eslint': tsEslint.plugin
    },
    languageOptions: {
      globals: globals.node,
      parser: tsEslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2022
      }
    },
    rules: {
      semi: ['error', 'always'],
      'max-len': [
        'warn',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: ',^\\s*import\\s.+\\sfrom\\s.+;$'
        }
      ],
      'max-depth': ['error', 3],
      quotes: [2, 'single', { avoidEscape: true }],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'object-shorthand': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'dot-notation': 'error',
      'no-console': 'off',
      'constructor-super': 'error',
      'object-curly-spacing': ['error', 'always'],
      curly: 'error',
      'no-async-promise-executor': ['error'],
      'comma-dangle': ['error', 'never']
    }
  })
];
