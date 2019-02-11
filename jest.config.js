module.exports = {
  "collectCoverage": true,
  "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/vendor/**"
  ],
  "testRegex": "(/tests/spec/core/linter-rules/.*|(\\.|/)(test|spec))\\.jsx?$",
  "testURL": "http://localhost/"
}
