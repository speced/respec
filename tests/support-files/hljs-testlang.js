var module = module ? module : {};

function testLang() {
  return {
    aliases: ["test"],
    keywords: ["funkyFunction"],
  };
}

module.exports = function (hljs) {
  hljs.registerLanguage("funkytest", testLang);
};

module.exports.definer = testLang;
