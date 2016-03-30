// Helpers for the GitHub API.
"use strict";
define([], function () {
  function findNext(link) {
    // Finds the next URL of paginated resources which
    // is available in the Link header. Link headers look like this:
    // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
    // More info here: https://developer.github.com/v3/#link-header
    if (!link) {
      return null;
    }
    var next = link.match(/<([^>]+)>\s*;\s*rel="next"/);
    return (next) ? next[1] : null;
  }

  function flattenResults(items) {
    return items.reduce(function (collector, item) {
      return collector.concat(item);
    }, []);
  }

  function fetchAll(url) {
    var ops = {
      headers: {
        "Accept": "application/vnd.github.v3.html+json",
      },
    };
    return fetch(url, ops)
      .then(function (resp) {
        var tasks = [resp.json()];
        var nextURL = findNext(resp.headers.get("Link"));
        if (nextURL) {
          tasks.push(fetchAll(nextURL, ops));
        }
        return Promise
          .all(tasks)
          .then(flattenResults);
      });
  }

  return {
    fetchOpenIssues: function (url) {
      // converts URLs of the form:
      // https://api.github.com/repos/user/repo/comments{/number}
      // into:
      // https://api.github.com/repos/user/repo/comments
      // which is what you need if you want to get the index.
      var indexURL = url.replace(/\{[^}]+\}/, "");
      return fetchAll(indexURL);
    },
  };
});

