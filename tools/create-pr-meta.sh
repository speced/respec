# array of environment variables to write
vars=(
  TRAVIS_BRANCH
  TRAVIS_BUILD_WEB_URL
  TRAVIS_EVENT_TYPE
  TRAVIS_JOB_WEB_URL
  TRAVIS_PULL_REQUEST_SLUG
  TRAVIS_PULL_REQUEST
  TRAVIS_COMMIT
  TRAVIS_COMMIT_MESSAGE
)
# body will contain newline separated strings like: "var": "var_value_from_env",
body=$(
  printf "%s\n" "${vars[@]}" | \
  xargs -i sh -c 'echo "  \"{}\": \"${}\"",'
)
# create json output (prepend `{`, remove trailing comma and append `}`)
# and write to file
printf "{\n%s\n}" "${body%?}" > ./builds/meta.json
