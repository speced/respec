// Helpers for the GitHub API.

define(
    [],
    function () {
        function findNext(header) {
            // Finds the next URL of paginated resources which
            // is available in the Link header. Link headers look like this:
            // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
            // More info here: https://developer.github.com/v3/#link-header
            var m = (header||"").match(/<([^>]+)>\s*;\s*rel="next"/);
            return (m && m[1]) || null;
        }
        
        function fetch(url, options) {
            if (options) {
                options.url = url;
                url = options;
            }
            return $.ajax(url);
        }
        function fetchAll(url, options) {
            return _fetchAll(url, options, []);
        }
        
        function _fetchAll(url, options, output) {
            var request = fetch(url, options);
            return request.then(function(resp) {
                output.push.apply(output, resp);
                var next = findNext(request.getResponseHeader("Link"));
                return next ? _fetchAll(next, options, output) : output;
            });
        }
        
        return {
            fetch: fetch,
            fetchAll: fetchAll,
            fetchIndex: function(url, options) {
                // converts URLs of the form:
                // https://api.github.com/repos/user/repo/comments{/number}
                // into:
                // https://api.github.com/repos/user/repo/comments
                // which is what you need if you want to get the index.
                return fetchAll(url.replace(/\{[^}]+\}/, ""), options);
            }
        };
    }
);
