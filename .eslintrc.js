module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      impliedStrict: true,
    },
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': ['error', { functions: false }],
    'no-continue': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
};
