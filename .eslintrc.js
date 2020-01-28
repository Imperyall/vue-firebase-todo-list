module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'newline-before-return': 'error',
    semi: [1, 'never'],
    'default-case': 2,
    quotes: [2, 'single', { avoidEscape: true }],
    indent: ['error', 2]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: []
}
