export default (conf, name, items = []) => {
  const html = hyperHTML;
  // stuff to handle RDFa
  const attr = Object.freeze(conf.doRDFa ? {
    re: (name === "Editor" ? "schema:editor" : "schema:contributor"),
    rp: "schema:Person",
    rn: "schema:name",
    rm: "foaf:mbox",
    ru: "schema:url"
  } : {});
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(getItem(items[i], i));
  }
  return results;

  function getItem(p, i) {
    const editorid = p.w3cid ? parseInt(p.w3cid, 10): null;
    const dd = html`<dd class='p-author h-card vcard'
      data-editor-id='${editorid}'></dd>`;
    const span = conf.doRDFa ?
      html`<span property='${attr.re}' typeof='${attr.rp}'></span>` :
      document.createDocumentFragment();
    const contents = [];
    if (p.url) {
      if (conf.doRDFa) {
        contents.push(html`<meta property='${attr.rn}' content='${p.name}' />`);
      }
      contents.push(html`<a class='u-url url p-name fn'
        property='${attr.ru}' href='${p.url}'>${p.name}</a>`);
    } else {
      contents.push(html`<span property='${attr.rn}' class='p-name fn'>${p.name}</span>`);
    }
    if (p.company) {
      if (p.companyURL) {
        if (conf.doRDFa) {
          contents.push(html`, <span property='schema:worksFor' typeof='schema:Organization'>
            <meta property='${attr.rn}' content='${p.company}' />
            <a property='${attr.ru}'
            class='p-org org h-org h-card' href='${p.companyURL}'>${p.company}</a>
            </span>`);
        } else {
          contents.push(html`, <a class='p-org org h-org h-card' href='${p.companyURL}'>${p.company}</a>`);
        }
      }
      else if (conf.doRDFa) {
        contents.push(html`, <span property='schema:worksFor' typeof='schema:Organization'>
          <span property='schema:name'>${p.company}</span>
          </span>`);
      } else {
        contents.push(document.createTextNode(`, ${p.company}`));
      }
    }
    if (p.mailto) {
      contents.push(html`, <span class='ed_mailto'><a class='u-email email'
        property='${attr.rm}' href='${`mailto:${p.mailto}`}'>${p.mailto}</a></span>`);
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
    const span = html`<span class='${extra.class || null}'></span>`
    let textContainer = span;
    if (extra.href) {
      textContainer = html`<a href='${extra.href}'></a>`;
      span.appendChild(textContainer);
    }
    textContainer.textContent = extra.name;
    return span;
  }
}
