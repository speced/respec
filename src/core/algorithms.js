/**
Currently used only for adding 'assert' class to algorithm lists  
*/

export const name = "core/algorithms";

export async function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.innerText.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  const css = `.assert {
    border-color: #AAA;
    background: #EEE;
    border-left: .5em solid;
    padding: 0.3em;
  }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
