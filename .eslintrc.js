module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",//qdo o prettier encontrar um erro, ele notifica (apenas qdo o prettier estiver instalado)
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelCase": "off",//Desabilita a regra q proíbe a criação de variaveis q não sejam camelCase
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
  },
};
