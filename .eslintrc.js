module.exports = {
  parser: "@typescript-eslint/parser",
  root: true,
  env: {
    node: true,
    es6: true,
    "jest/globals": true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true,
    },
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["jest", "react-hooks"],
  extends: [
    "tui",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "dot-notation": ["error", { allowKeywords: true }],
    "no-sync": "off",
    "no-process-env": "warn",
    "no-nested-ternary": "off",
    "no-unused-expressions": "off",
    "no-useless-escape": "off",
    "default-case": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "accessor-pairs": ["off"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: false },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "new-cap": ["error", { capIsNewExceptions: ["NumberFormat"] }],
  },
}
