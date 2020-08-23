module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    // 'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'linebreak-style': 0,
    'no-param-reassign': 0,
    eqeqeq: 0,
    'no-throw-literal': 0,
    'no-plusplus': 0,
    'max-classes-per-file': 0,
    'arrow-parens': 0,
    'class-methods-use-this': 0,
    'no-useless-escape': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
