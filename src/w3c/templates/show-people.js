// @ts-check
import html from "../../../js/html-template";

export default (items = []) => {
  return items.map(getItem);

  function getItem(p) {
    const personName = [p.name]; // treated as opt-in HTML by hyperHTML
    const company = [p.company];
    const editorid = p.w3cid ? parseInt(p.w3cid, 10) : null;
    /** @type {HTMLElement} */
    const dd = html`
      <dd class="p-author h-card vcard" data-editor-id="${editorid}"></dd>
    `;
    /** @type {(string | Node)[]} */
    const contents = [];
    if (p.mailto) {
      contents.push(html`
        <a class="ed_mailto u-email email p-name" href="${`mailto:${p.mailto}`}"
          >${personName}</a
        >
      `);
    } else if (p.url) {
      contents.push(html`
        <a class="u-url url p-name fn" href="${p.url}">${personName}</a>
      `);
    } else {
      contents.push(
        html`
          <span class="p-name fn">${personName}</span>
        `
      );
    }
    if (p.company) {
      if (p.companyURL) {
        contents.push(
          html`
            (<a class="p-org org h-org h-card" href="${p.companyURL}"
              >${company}</a
            >)
          `
        );
      } else {
        contents.push(
          html`
            (${company})
          `
        );
      }
    }
    if (p.note) contents.push(` (${p.note})`);
    if (p.extras) {
      const results = p.extras
        // Remove empty names
        .filter(extra => extra.name && extra.name.trim())
        // Convert to HTML
        .map(getExtra);
      for (const result of results) {
        contents.push(", ", result);
      }
    }
    dd.append(...contents);
    return dd;
  }

  function getExtra(extra) {
    const span = html`
      <span class="${extra.class || null}"></span>
    `;
    let textContainer = span;
    if (extra.href) {
      textContainer = html`
        <a href="${extra.href}"></a>
      `;
      span.appendChild(textContainer);
    }
    textContainer.textContent = extra.name;
    return span;
  }
};
