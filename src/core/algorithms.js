/**
Currently used only for adding 'assert' class to algorithm lists  
*/

export const name = "core/algorithms";

export async function run() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.innerText.startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
}
