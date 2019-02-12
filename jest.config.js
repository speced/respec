module.exports = {
  "collectCoverage": true,
  "collectCoverageFrom": [
      "src/**/*.js",
      "!**/node_modules/**",
      "!**/vendor/**"
  ],
  "testRegex": "(/tests/spec/core/linter-rules/.*|(\\.|/)(test|spec))\\.js$",
  "testURL": "http://localhost/"
}
