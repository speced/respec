if (document.respec) {
  document.respec.ready.then(setupSortableTable);
} else {
  setupSortableTable();
}

function setupSortableTable() {
  /** @type {WeakMap<HTMLTableElement, WeakMap<HTMLTableCellElement, -1 | 1>>} */
  const STATE = new WeakMap();

  /**
   * @param {HTMLTableCellElement} th
   * @param {-1 | 0 | 1} dir
   */
  const createOrUpdateButton = (th, dir) => {
    const textValue = [" descending", "", " ascending"][dir + 1];
    const iconValue = ["▼", "▲/▼", "▲"][dir + 1]; // TODO: fix these mappings
    const label = th.dataset.text || th.textContent;
    if (!th.dataset.text) th.dataset.text = label;

    const button =
      th.querySelector("button") || document.createElement("button");
    const text = `Sort${textValue} by ${label}`;
    button.title = text;
    button.setAttribute("aria-label", text);
    button.textContent = iconValue;
    return button;
  };

  /** @type {NodeListOf<HTMLTableElement>} */
  const tables = document.querySelectorAll("table.sortable");
  for (const table of tables) {
    for (const th of table.tHead.querySelectorAll("th")) {
      th.append(createOrUpdateButton(th, 0));
    }
  }

  /** @type {(el: MouseEvent)=> HTMLTableCellElement | null}  */
  const getTrigger = ev => {
    if (!(ev.target instanceof HTMLElement)) return null;
    const el = ev.target;
    if (el.localName === "th") {
      return el;
    }
    if (el.localName === "button" && el.parentElement.localName === "th") {
      return el.parentElement;
    }
    return null;
  };

  document.addEventListener("click", ev => {
    const th = getTrigger(ev);
    if (!th) return;

    /** @type {HTMLTableElement | null}  */
    const table = th.closest("table.sortable");
    if (!table) return;

    ev.preventDefault();

    const state =
      STATE.get(table) || STATE.set(table, new WeakMap()).get(table);
    const direction = state.get(th) === 1 ? -1 : 1; // -1: ascending, 1: descending
    state.set(th, direction);

    createOrUpdateButton(th, direction);

    const tbody = table.tBodies[0];
    const headers = th.closest("tr").cells;
    const colIndex = Array.from(headers).findIndex(node => node === th);
    const rows = Array.from(tbody.rows).sort((a, b) => {
      const x = a.cells[colIndex].textContent.trimStart();
      const y = b.cells[colIndex].textContent.trimStart();
      return direction * x.localeCompare(y);
    });

    /** @type {typeof tbody}  */
    const tbodyCone = tbody.cloneNode(false);
    tbodyCone.append(...rows);
    tbody.replaceWith(tbodyCone);
  });
}
