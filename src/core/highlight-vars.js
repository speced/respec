// Module core/highlight-vars
// Highlights occurrences of a <var> in an algorithm on click
// if a <var> is set only once (unused/undeclared), it's highlighted as 'var.bug'

export const name = "core/highlight-vars";

export function run(conf, doc, cb) {
  const vars = [...document.querySelectorAll('.algorithm var')];
  for (let i = 0, l = vars.length; i < l; ++i) {
    vars[i].addEventListener('click', highlightVars);
  }
  cb();
}

function highlightVars({ target }) {
  const value = target.innerText;
  const parent = target.closest('.algorithm');
  const toHightlight = [...parent.querySelectorAll('var')]
    .filter(el => el.innerText === value);
  const classToAdd = toHightlight.length === 1 ? 'bug' : 'active';
  toHightlight.map(el => el.classList.toggle(classToAdd));
}
