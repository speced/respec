const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
.mdn {
  font-size: 0.75em;
  position: absolute;
  right: 0.3em;
  min-width: 0;
  margin-top: 3rem;
}

.mdn details {
  width: 100%;
  margin: 1px 0;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
  padding: 0.4em;
  padding-top: 0;
}

.mdn details[open] {
  min-width: 25ch;
  max-width: 32ch;
  background: #fff;
  background: var(--indextable-hover-bg, #fff);
  color: black;
  color: var(--indextable-hover-text, black);
  box-shadow:
    0 1em 3em -0.4em rgba(0, 0, 0, 0.3),
    0 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow:
    0 1em 3em -0.4em var(--tocsidebar-shadow, rgba(0, 0, 0, 0.3)),
    0 0 1px 1px var(--tocsidebar-shadow, rgba(0, 0, 0, 0.05));
  border-radius: 2px;
  z-index: 11;
  margin-bottom: 0.4em;
}

.mdn summary {
  text-align: right;
  cursor: default;
  margin-right: -0.4em;
}

.mdn summary span {
  font-family: zillaslab, Palatino, "Palatino Linotype", serif;
  color: #fff;
  color: var(--bg, #fff);
  background-color: #000;
  background-color: var(--text, #000);
  display: inline-block;
  padding: 3px;
}

.mdn a {
  display: inline-block;
  word-break: break-all;
}

.mdn p {
  margin: 0;
}

.mdn .engines-all {
  color: #058b00;
}
.mdn .engines-some {
  color: #b00;
}

.mdn table {
  width: 100%;
  font-size: 0.9em;
}

.mdn td {
  border: none;
}

.mdn td:nth-child(2) {
  text-align: right;
}

.mdn .nosupportdata {
  font-style: italic;
  margin: 0;
}

.mdn tr::before {
  content: "";
  display: table-cell;
  width: 1.5em;
  height: 1.5em;
  background: no-repeat center center / contain;
  font-size: 0.75em;
}

.mdn .no,
.mdn .unknown {
  color: #cccccc;
  filter: grayscale(100%);
}

.mdn .no::before,
.mdn .unknown::before {
  opacity: 0.5;
}

.mdn .chrome::before,
.mdn .chrome_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/chrome/chrome.svg);
}

.mdn .edge::before,
.mdn .edge_mobile::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/edge/edge.svg);
}

.mdn .firefox::before,
.mdn .firefox_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/firefox/firefox.svg);
}

.mdn .opera::before,
.mdn .opera_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/opera/opera.svg);
}

.mdn .safari::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/safari/safari.svg);
}

.mdn .safari_ios::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/safari-ios/safari-ios.svg);
}

.mdn .samsunginternet_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/samsung-internet/samsung-internet.svg);
}

.mdn .webview_android::before {
  background-image: url(https://www.w3.org/assets/logos/browser-logos/android-webview/android-webview.png);
}
`;
