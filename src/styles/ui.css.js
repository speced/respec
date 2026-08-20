const css = String.raw;

// Prettier ignore only to keep code indented from level 0.
// prettier-ignore
export default css`
.respec-modal .close-button {
  position: absolute;
  z-index: inherit;
  padding: 0.2em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;
  border: none;
  background: transparent;
}

#respec-ui {
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  top: 20px;
  right: 20px;
  width: 202px;
  text-align: right;
  z-index: 9000;
}


#respec-pill,
.respec-info-button {
  height: 2.4em;
  background: #fff;
  background: var(--bg, #fff);
  color: rgb(120, 120, 120);
  color: var(--tocnav-normal-text, rgb(120, 120, 120));
  border: 1px solid #ccc;
  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
  box-shadow: 1px 1px 8px 0 var(--tocsidebar-shadow, rgba(100, 100, 100, 0.5));
  padding: 0.2em 0em;
}

.respec-info-button {
  border: none;
  opacity: 0.75;
  border-radius: 2em;
  margin-right: 1em;
  min-width: 3.5em;
  will-change: opacity;
}

.respec-info-button:focus,
.respec-info-button:hover {
  opacity: 1;
  transition: opacity 0.2s;
}

#respec-pill {
  width: 4.8em;
}

#respec-pill:not(:disabled) {
  animation: respec-fadein 0.6s ease-in-out;
}

@keyframes respec-fadein {
  from {
    margin-top: -1.2em;
    border-radius: 50%;
    border: 0.2em solid rgba(100, 100, 100, 0.5);
    box-shadow: none;
    height: 4.8em;
  }
  to {
    margin-top: 0;
    border: 1px solid #ccc;
    border-radius: 0;
    box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
    height: 2.4em;
  }
}

#respec-pill:disabled {
  margin-top: -1.2em;
  position: relative;
  border: none;
  box-shadow: none;
  border-radius: 50%;
  width: 4.8em;
  height: 4.8em;
  padding: 0;
}

#respec-pill:disabled::after {
  position: absolute;
  content: '';
  inset: -0.2em;
  border-radius: 50%;
  border: 0.2em solid rgba(100, 100, 100, 0.5);
  border-left: 0.2em solid transparent;
  animation: respec-spin 0.5s infinite linear;
}

@media (prefers-reduced-motion) {
  #respec-pill:not(:disabled) {
    animation: none;
  }

  #respec-pill:disabled::after {
    animation: none;
    border-left: 0.2em solid rgba(100, 100, 100, 0.5);
  }
}

@keyframes respec-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.respec-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}

.respec-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s linear;
}

#respec-pill:hover,
#respec-pill:focus {
  color: rgb(0, 0, 0);
  background-color: rgb(245, 245, 245);
  transition: color 0.2s;
}

#respec-menu {
  position: absolute;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: var(--bg, #fff);
  color: var(--text, black);
  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
  width: 200px;
  display: none;
  text-align: left;
  margin-top: 32px;
  font-size: 0.8em;
}

#respec-menu:not([hidden]) {
  display: block;
}

#respec-menu li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.respec-save-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(47%, 2fr));
  grid-gap: 0.5cm;
  padding: 0.5cm;
}

.respec-save-button:link {
  padding-top: 16px;
  color: var(--def-text, white);
  background: var(--def-bg, rgb(42, 90, 168));
  justify-self: stretch;
  height: 1cm;
  text-decoration: none;
  text-align: center;
  font-size: inherit;
  border: none;
  border-radius: 0.2cm;
}

.respec-save-button:link:hover {
  color: var(--def-text, white);
  background: var(--defrow-border, rgb(42, 90, 168));
  padding: 0;
  margin: 0;
  border: 0;
  padding-top: 16px;
}

.respec-save-button:link:focus {
  background: var(--tocnav-active-bg, #193766);
  color: var(--tocnav-active-text, black);
}

#respec-ui button:focus,
#respec-pill:focus,
.respec-option:focus {
  outline: 0;
  outline-style: none;
}

#respec-pill-error {
  background-color: red;
  color: white;
}

#respec-pill-warning {
  background-color: orange;
  color: white;
}

.respec-warning-list,
.respec-error-list {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  font-size: 0.85em;
}

.respec-warning-list {
  background-color: rgb(255, 251, 230);
}

:is(.respec-warning-list,.respec-error-list) > li {
  list-style-type: none;
  margin: 0;
  padding: .5em 0;
  padding-left: 2em;
  padding-right: .5em;
}

:is(.respec-warning-list,.respec-error-list) > li + li {
  margin-top: 0.5rem;
}

:is(.respec-warning-list,.respec-error-list) > li:before {
  position: absolute;
  left: .4em;
}

:is(.respec-warning-list,.respec-error-list) p {
  padding: 0;
  margin: 0;
}

.respec-warning-list > li {
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 245, 194);
}

.respec-error-list,
.respec-error-list li {
  background-color: rgb(255, 240, 240);
}

.respec-warning-list > li::before {
  content: "⚠️";
}

.respec-error-list > li::before {
  content: "💥";
}

.respec-error-list > li {
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 215, 215);
}

:is(.respec-warning-list,.respec-error-list) > li li {
  list-style: disc;
}

#respec-overlay {
  display: block;
  position: fixed;
  z-index: 10000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: #000;
}

.respec-show-overlay {
  transition: opacity 0.2s linear;
  opacity: 0.5;
}

.respec-hide-overlay {
  transition: opacity 0.2s linear;
  opacity: 0;
}

.respec-modal {
  display: block;
  position: fixed;
  z-index: 11000;
  top: 10%;
  background: var(--bg, #fff);
  color: var(--text, black);
  border: 5px solid #666;
  border-color: var(--tocsidebar-shadow, #666);
  min-width: 20%;
  padding: 0;
  max-height: 80%;
  overflow-y: auto;
  margin: 0 -0.5cm;
  left: 20%;
  max-width: 75%;
  min-width: 60%;
}


.respec-modal h3 {
  margin: 0;
  padding: 0.2em;
  left: 0 !important;
  text-align: center;
  background: var(--tocsidebar-shadow, #ddd);
  color: var(--text, black);
  font-size: 1em;
}

#respec-menu button.respec-option {
  background: var(--bg, white);
  color: var(--text, black);
  border: none;
  width: 100%;
  text-align: left;
  font-size: inherit;
  padding: 1.2em 1.2em;
}

#respec-menu button.respec-option:hover {
  background-color: var(--tocnav-hover-bg, #eee);
  color: var(--tocnav-hover-text, black);
}

.respec-cmd-icon {
  padding-right: 0.5em;
}

#respec-ui button.respec-option:first-child {
  margin-top: 0;
}
#respec-ui button.respec-option:last-child {
  border: none;
  border-radius: inherit;
  margin-bottom: 0;
}

.respec-button-copy-paste {
  position: absolute;
  height: 28px;
  width: 40px;
  cursor: pointer;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid rgb(144, 184, 222);
  border-left: 0;
  border-radius: 0px 0px 3px 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  top: 0;
  left: 127px;
}

/* Copy acknowledgement: the check swaps in, a popover appears beside it. */
.respec-copy-check {
  display: none;
}

.respec-copied .respec-copy-check {
  display: inline;
}

.respec-copied > svg:not(.respec-copy-check) {
  display: none;
}

/* Colored on the path, not inherited: a :hover rule on the button would
   otherwise repaint the check to match the toolbar and hide it. The plain
   value first, for browsers without light-dark(). */
.respec-copy-check path {
  fill: #1a7f37;
  fill: light-dark(#1a7f37, #3fb950);
}

.respec-copy-toast {
  /* In the top layer, so no ancestor's overflow, border radius or 3D transform
     can clip it. The UA sheet centres popovers with inset: 0 and margin: auto;
     anchor positioning replaces that with "beside the button just clicked". */
  position-anchor: --respec-copy-anchor;
  position-area: inline-end center;
  position-try-fallbacks: flip-inline;
  inset: auto;
  margin: 0;
  margin-inline-start: 0.5em;
  padding: 0.4em 0.6em;
  border: 0;
  border-radius: 6px;
  /* light-dark() follows both the system preference and ReSpec's own theme
     toggle, which sets the color-scheme property on the body. */
  background: #24292f;
  background: light-dark(#24292f, #e6e6e6);
  color: #fff;
  color: light-dark(#fff, #1c1c1c);
  font: normal 12px/1 system-ui, sans-serif;
  white-space: nowrap;
  pointer-events: none;
}

/* Announces the copy for screen readers; the popover is decorative. */
.respec-copy-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media print {
  #respec-ui {
    display: none;
  }
}

.respec-iframe {
  width: 100%;
  min-height: 550px;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border: 0;
}

.respec-iframe:not(.ready) {
  background: url("https://respec.org/xref/loader.gif") no-repeat center;
}

.respec-iframe + a[href] {
  font-size: 0.9rem;
  float: right;
  margin: 0 0.5em 0.5em;
  border-bottom-width: 1px;
}

p:is(.respec-hint,.respec-occurrences) {
  display: block;
  margin-top: 0.5em;
}

.respec-plugin {
  text-align: right;
  color: rgb(120, 120, 120, .5);
  font-size: 0.6em;
}
`;
