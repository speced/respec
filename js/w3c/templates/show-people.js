define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = (conf, name, items = []) => {
    const html = hyperHTML;
    const results = [];
    for (let i = 0; i < items.length; i++) {
      results.push(getItem(items[i], i));
    }
    return results;

    function getItem(p, i) {
      const editorid = p.w3cid ? parseInt(p.w3cid, 10) : null;
      const dd = html`<dd class='p-author h-card vcard'
      data-editor-id='${editorid}'></dd>`;
      const span = document.createDocumentFragment();
      const contents = [];
      if (p.url) {
        contents.push(html`<a class='u-url url p-name fn'
        href='${p.url}'>${p.name}</a>`);
      } else {
        contents.push(html`<span class='p-name fn'>${p.name}</span>`);
      }
      if (p.company) {
        if (p.companyURL) {
          contents.push(html`, <a class='p-org org h-org h-card' href='${p.companyURL}'>${p.company}</a>`);
        } else {
          contents.push(document.createTextNode(`, ${p.company}`));
        }
      }
      if (p.mailto) {
        contents.push(html`, <a class='ed_mailto u-email email'
        href='${`mailto:${p.mailto}`}'>${p.mailto}</a>`);
      }
      if (p.note) contents.push(document.createTextNode(` (${p.note})`));
      if (p.extras) {
        const results = p.extras
        // Remove empty names
        .filter(extra => extra.name && extra.name.trim())
        // Convert to HTML
        .map(getExtra);
        for (const result of results) {
          contents.push(document.createTextNode(", "), result);
        }
      }
      hyperHTML.bind(span)`${contents}`;
      dd.appendChild(span);
      return dd;
    }

    function getExtra(extra) {
      const span = html`<span class='${extra.class || null}'></span>`;
      let textContainer = span;
      if (extra.href) {
        textContainer = html`<a href='${extra.href}'></a>`;
        span.appendChild(textContainer);
      }
      textContainer.textContent = extra.name;
      return span;
    }
  };
});
//# sourceMappingURL=show-people.js.map