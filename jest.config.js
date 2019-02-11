module.exports = {
  "collectCoverage": true,
  "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/vendor/**"
  ],
  "testRegex": "(/tests/spec/.*|(\\.|/)(test|spec))\\.jsx?$",
  "testURL": "http://localhost/"
}
