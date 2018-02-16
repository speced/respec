export default link => {
  if (!link.key) {
    return;
  }
  const html = hyperHTML;
  return html`
    <dt class="${link.class ? [link.class] : null}">${link.key}:</dt>
    ${link.data ? html`
        ${link.data.map(item => html`
          ${item.value ? html`
            <dd class="${item.class ? [item.class] : null}">
              ${item.href ? html`<a href="${item.href}">${item.value}</a>` : ""}
            </dd>
          ` : html`
            ${item.href ? html`
              <dd><a href="${item.href}">${item.href}</a></dd>
            ` : ""}
          `}
        `)}
    ` : html`
      ${link.value ? html`
        <dd class="${link.class ? [link.class] : null}">
          ${link.href ? html`<a href="${link.href}">${link.value}</a>` : ""}
        </dd>
      ` : html`
        ${link.href ? html`
          <dd class="${link.class ? [link.class] : null}">
            <a href="${link.href}">${link.href}</a>
          </dd>
        ` : ""}
      `}
    `}
  `;
}
