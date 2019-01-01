/**
Currently used only for adding 'assert' class to algorithm lists  
*/

export const name = "core/algorithms";

export async function run() {
  const elements = document.querySelectorAll("ol.algorithm");
  elements.forEach(element => {
    const children = Array.from(element.children);
    children.forEach(item => {
      if (item.innerHTML.startsWith("Assert: ")) {
        item.classList.add("assert");
      }
    });
  });
}
