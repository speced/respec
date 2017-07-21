// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.

import { fetch as ghFetch, fetchIndex } from "core/github";
import { pub } from "core/pubsubhub";
export const name = "core/contrib";

function prop(prop) {
  return function(o) {
    return o[prop];
  };
}

function findUsers(...thingsToFind) {
  var users = {};
  thingsToFind.forEach(function(things) {
    things.forEach(function(thing) {
      if (thing.user) {
        users[thing.user.url] = true;
      }
    });
  });
  return Object.keys(users);
}

function join(things) {
  if (!things.length) {
    return "";
  }
  things = things.slice(0);
  var last = things.pop();
  var length = things.length;
  if (length === 0) {
    return last;
  }
  if (length === 1) {
    return things[0] + " and " + last;
  }
  return things.join(", ") + ", and " + last;
}

function toHTML(urls, editors, element) {
  return $.when
    .apply(
      $,
      urls.map(function(url) {
        return ghFetch(url);
      })
    )
    .then(function(...args) {
      var names = args
        .map(function(user) {
          user = user[0];
          return user.name || user.login;
        })
        .filter(function(name) {
          return editors.indexOf(name) < 0;
        });
      names.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      $(element).html(join(names)).attr("id", null);
    });
}

export async function run(conf, doc, cb) {
  var $commenters = doc.querySelector("#gh-commenters");
  var $contributors = doc.querySelector("#gh-contributors");

  if (!$commenters && !$contributors) {
    return cb();
  }

  if (!conf.githubAPI) {
    var elements = [];
    if ($commenters) elements.push("#" + $commenters.id);
    if ($contributors) elements.push("#" + $contributors.id);
    pub(
      "error",
      "Requested list of contributors and/or commenters from GitHub (" +
        elements.join(" and ") +
        ") but config.githubAPI is not set."
    );
    cb();
    return;
  }

  ghFetch(conf.githubAPI)
    .then(function(json) {
      return $.when(
        fetchIndex(json.issues_url),
        fetchIndex(json.issue_comment_url),
        fetchIndex(json.contributors_url)
      );
    })
    .then(function(issues, comments, contributors) {
      var editors = respecConfig.editors.map(prop("name"));
      var commenters = findUsers(issues, comments);
      contributors = contributors.map(prop("url"));
      return $.when(
        toHTML(commenters, editors, $commenters),
        toHTML(contributors, editors, $contributors)
      );
    })
    .then(cb, function(error) {
      pub(
        "error",
        "Error loading contributors and/or commenters from  Error: " + error
      );
      cb();
    });
}
