export default (conf, name, items = []) => {
  const html = hyperHTML;
  // stuff to handle RDFa
  const rp = (name === "Editor" ? 'schema:editor' : 'schema:contributor');
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
      html`<span property='${rp}' typeof='schema:Person'></span>` :
      document.createDocumentFragment();
    const contents = [];
    if (p.url) {
      if (conf.doRDFa) {
        contents.push(html`<meta property='schema:name' content='${p.name}' />
          <a class='u-url url p-name fn'
          property='schema:url' href='${p.url}'>${p.name}</a>`);
      } else {
        contents.push(html`<a class='u-url url p-name fn'
          href='${p.url}'>${p.name}</a>`);
      }
    } else if (conf.doRDFa) {
      contents.push(html`<span property='schema:name' class='p-name fn'>${p.name}</span>`);
    } else {
      contents.push(html`<span class='p-name fn'>${p.name}</span>`);
    }
    if (p.company) {
      if (p.companyURL) {
        if (conf.doRDFa) {
          contents.push(html`, <span property='schema:worksFor' typeof='schema:Organization'>
            <meta property='schema:name' content='${p.company}' />
            <a property='schema:url'
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
      if (conf.doRDFa) {
        contents.push(html`, <span class='ed_mailto'><a class='u-email email'
          property='foaf:mbox' href='${`mailto:${p.mailto}`}'>${p.mailto}</a></span>`);
      } else {
        contents.push(html`, <span class='ed_mailto'><a class='u-email email'
          href='${`mailto:${p.mailto}`}'>${p.mailto}</a></span>`);
      }
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
