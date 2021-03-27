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
  background: #fff;
  height: 2.5em;
  color: rgb(120, 120, 120);
  border: 1px solid #ccc;
  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);
}

.respec-info-button {
  border: none;
  opacity: 0.75;
  border-radius: 2em;
  margin-right: 1em;
  min-width: 3.5em;
}

.respec-info-button:focus,
.respec-info-button:hover {
  opacity: 1;
  transition: opacity 0.2s;
}

#respec-pill:disabled {
  font-size: 2.8px;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(40, 40, 40, 0.2);
  border-right: 1.1em solid rgba(40, 40, 40, 0.2);
  border-bottom: 1.1em solid rgba(40, 40, 40, 0.2);
  border-left: 1.1em solid #ffffff;
  transform: translateZ(0);
  animation: respec-spin 0.5s infinite linear;
  box-shadow: none;
}

#respec-pill:disabled,
#respec-pill:disabled:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
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
  background: #fff;
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
  color: rgb(240, 240, 240);
  background: rgb(42, 90, 168);
  justify-self: stretch;
  height: 1cm;
  text-decoration: none;
  text-align: center;
  font-size: inherit;
  border: none;
  border-radius: 0.2cm;
}

.respec-save-button:link:hover {
  color: white;
  background: rgb(42, 90, 168);
  padding: 0;
  margin: 0;
  border: 0;
  padding-top: 16px;
}

.respec-save-button:link:focus {
  background: #193766;
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
  list-style: none;
  font-family: sans-serif;
  background-color: rgb(255, 251, 230);
  font-size: 0.85em;
}

.respec-warning-list > li,
.respec-error-list > li {
  padding: 0.4em 0.7em;
}

.respec-warning-list > li::before {
  content: "⚠️";
  padding-right: 0.5em;
}
.respec-warning-list p,
.respec-error-list p {
  padding: 0;
  margin: 0;
}

.respec-warning-list li {
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 245, 194);
}

.respec-error-list,
.respec-error-list li {
  background-color: rgb(255, 240, 240);
}

.respec-error-list li::before {
  content: "💥";
  padding-right: 0.5em;
}

.respec-error-list li {
  padding: 0.4em 0.7em;
  color: rgb(92, 59, 0);
  border-bottom: thin solid rgb(255, 215, 215);
}

.respec-error-list li > p {
  margin: 0;
  padding: 0;
  display: inline-block;
}

.respec-error-list li > p:first-child,
.respec-warning-list li > p:first-child {
  display: inline;
}

.respec-warning-list > li li,
.respec-error-list > li li {
  margin: 0;
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
  margin: auto;
  top: 10%;
  background: #fff;
  border: 5px solid #666;
  min-width: 20%;
  width: 79%;
  padding: 0;
  max-height: 80%;
  overflow-y: auto;
  margin: 0 -0.5cm;
}

@media screen and (min-width: 78em) {
  .respec-modal {
    width: 62%;
  }
}

.respec-modal h3 {
  margin: 0;
  padding: 0.2em;
  text-align: center;
  color: black;
  background: linear-gradient(
    to bottom,
    rgba(238, 238, 238, 1) 0%,
    rgba(238, 238, 238, 1) 50%,
    rgba(204, 204, 204, 1) 100%
  );
  font-size: 1em;
}

.respec-modal .inside div p {
  padding-left: 1cm;
}

#respec-menu button.respec-option {
  background: white;
  padding: 0 0.2cm;
  border: none;
  width: 100%;
  text-align: left;
  font-size: inherit;
  padding: 1.2em 1.2em;
}

#respec-menu button.respec-option:hover,
#respec-menu button:focus {
  background-color: #eeeeee;
}

.respec-cmd-icon {
  padding-right: 0.5em;
}

#respec-ui button.respec-option:last-child {
  border: none;
  border-radius: inherit;
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
`;
