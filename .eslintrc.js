module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      'node': {
        'extensions': [
          '.js',
          '.json',
          '.ts'
        ]
      }
    }
  },
  rules: {
    'import/order': ['error'],
    'import/extensions': ['error', 'never'],
    "import/no-extraneous-dependencies": ["off"],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        endOfLine: 'lf',
        semi: true,
        singleQuote: true,
        printWidth: 80,
        tabWidth: 2,
      },
    ],
  },
};
