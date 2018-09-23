module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: ["react"],
	rules: {
		indent: ["error", "space"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
