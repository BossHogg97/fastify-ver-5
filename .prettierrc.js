/** @type {import('prettier').Config} **/
const config = {
  arrowParens: "always",
  printWidth: 160,
  singleQuote: true,
  singleAttributePerLine: false,
  trailingComma: "none",
  bracketSpacing: true,
  tabWidth: 2,
  semi: false,
  vueIndentScriptAndStyle: true,
  // plugins: [
  //   'prettier-plugin-tailwindcss'
  // ],
  endOfLine: "lf",
  quoteProps: "as-needed",
};

export default config;
