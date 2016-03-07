// Helpers for the GitHub API.
"use strict";
define(
    ["core/jquery-enhanced", "fetch"],
    function ($) {
        function findNext(header) {
            // Finds the next URL of paginated resources which
            // is available in the Link header. Link headers look like this:
            // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
            // More info here: https://developer.github.com/v3/#link-header
            var m = (header||"").match(/<([^>]+)>\s*;\s*rel="next"/);
            return (m && m[1]) || null;
        }

        function fetch(url, headers) {
            var options = {}
            if (headers) {
                options.headers = headers;
            }
            return fetch(url, options)
                .then(function(resp){
                    return resp.json()
                });
        }
        function fetchAll(url, headers) {
            return _fetchAll(url, headers, []);
        }

        function _fetchAll(url, headers, output) {
            var request = fetch(url, headers);
            return request.then(function(resp) {
                output.push.apply(output, resp);
                var next = findNext(request.getResponseHeader("Link"));
                return next ? _fetchAll(next, headers, output) : output;
            });
        }

        return {
            fetch: fetch,
            fetchAll: fetchAll,
            fetchIndex: function(url, headers) {
                // converts URLs of the form:
                // https://api.github.com/repos/user/repo/comments{/number}
                // into:
                // https://api.github.com/repos/user/repo/comments
                // which is what you need if you want to get the index.
                return fetchAll(url.replace(/\{[^}]+\}/, ""), headers);
            }
        };
    }
);
