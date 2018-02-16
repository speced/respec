const html = hyperHTML;

export default link => {
  if (!link.key) {
    return;
  }
  return html`
    <dt class="${link.class ? link.class : null}">${link.key}:</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
}

function showLinkData(data) {
  return html`
    <dd class="${data.class ? data.class : null}">
      ${data.href ? html`
        <a href="${data.href}">${data.value || data.href}</a>
      ` : ""}
    </dd>
  `
}
