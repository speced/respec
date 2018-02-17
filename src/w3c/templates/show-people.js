export default (conf, name, items = []) => {
  const html = hyperHTML;
  // stuff to handle RDFa
  const attr = Object.freeze(conf.doRDFa ? {
    ...name === "Editor" ? {
      rp1: "rdf:first",
      rp2: "foaf:Person"
    } : name === "Author" ? {
      rp1: "dc:contributor",
      rp2: "foaf:Person"
    } : {},
    rn: "foaf:name",
    rm: "foaf:mbox",
    rwu: "foaf:workplaceHomepage",
    rpu: "foaf:homepage",
    propSeeAlso: "rdfs:seeAlso"
  } : {});
  const bns = [];
  if (conf.doRDFa && name === "Editor") {
    bns.push(...Array.from({ length: items.length }, (_, i) => `_:editor${i}`));
    bns[items.length] = "rdf:nil";
  }
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(getItem(items[i], i));
  }
  return results;

  function getItem(p, i) {
    const bn = bns[i];
    const re = (bn && !i) ? "bibo:editor" : null;
    const editorid = p.w3cid ? parseInt(p.w3cid, 10): null;
    const dd = html`<dd class='p-author h-card vcard'
      property='${re}' resource='${bn}' data-editor-id='${editorid}'></dd>`;
    const span = conf.doRDFa ?
      html`<span property='${attr.rp1}' typeof='${attr.rp2}'></span>` :
      document.createDocumentFragment();
    const contents = [];
    if (p.url) {
      if (conf.doRDFa) {
        contents.push(html`<meta property='${attr.rn}' content='${p.name}' />`);
      }
      contents.push(html`<a class='u-url url p-name fn'
        property='${attr.rpu}' href='${p.url}'>${p.name}</a>`);
    } else {
      contents.push(html`<span property='${attr.rn}' class='p-name fn'>${p.name}</span>`);
    }
    if (p.company) {
      if (p.companyURL) {
        contents.push(html`, <a property='${attr.rwu}'
          class='p-org org h-org h-card' href='${p.companyURL}'>${p.company}</a>`);
      }
      else contents.push(document.createTextNode(`, ${p.company}`));
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
    if (conf.doRDFa && name === "Editor") {
      dd.appendChild(html`\n<span property='rdf:rest' resource='${bns[i + 1]}'></span>\n`);
    }
    return dd;
  }

  function getExtra(extra) {
    const span = html`<span class='${extra.class || null}'></span>`
    let textContainer = span;
    if (extra.href) {
      textContainer = html`<a
        href='${extra.href || null}'
        property='${conf.doRDFa ? "rdfs:seeAlso" : null}'
      ></a>`;
      span.appendChild(textContainer);
    }
    textContainer.textContent = extra.name;
    return span;
  }
}
