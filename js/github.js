// Helpers for the GitHub API.

define(
    [],
    function () {
        function findNext(header) {
            var m = (header||"").match(/<([^>]+)>\s*;\s*rel="next"/);
            return (m && m[1]) || null;
        }
        
        function fetch(url) {
            return $.ajax(url);
        }
        function fetchAll(url) {
            return _fetchAll(url, []);
        }
        
        function _fetchAll(url, output) {
            var request = fetch(url);
            return request.then(function(resp) {
                output.push.apply(output, resp);
                var next = findNext(request.getResponseHeader("Link"));
                return next ? req(next, output) : output;
            });
        }
        
        return {
            fetch: fetch,
            fetchAll: fetchAll,
            fetchIndex: function(url) {
                // converts URLs of the form:
                // https://api.github.com/repos/user/repo/comments{/number}
                // into:
                // https://api.github.com/repos/user/repo/comments
                // which is what you need if you want to get the index.
                return fetchAll(url.replace(/\{[^}]+\}/, ""));
            }
        };
    }
);
