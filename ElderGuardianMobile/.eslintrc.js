module.exports = {
  extends: ["taro/react"],
  parserOptions: {
    requireConfigFile: false,
  },
  globals: {
    defineAppConfig: "readonly",
    definePageConfig: "readonly",
  },
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "warn",
  },
  ignorePatterns: ["**/*.config.js"],
};
