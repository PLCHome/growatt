
module.exports = {
  files: ["**/*.js"],
  /*env: {
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
  },*/
  rules: {
    'no-use-before-define': ['error', { functions: false }],
    'no-continue': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
  ignores: ["docs",
    "test",
    "lib/env/tools.js",
    "gulpfile.js",
    "test.json",
    "test.js",
    "test2.js",
    "test_plants.json",
    "testSharePlant.json"
    ],
   
};
