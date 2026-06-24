// @ts-check
if (document.respec) {
  document.respec.ready.then(setupSortableTable);
} else {
  setupSortableTable();
}

function setupSortableTable() {
  const ASC = "ascending";
  const DESC = "descending";

  /** @type {Record<string, "ascending" | "descending" | null>} */
  const NEXT_DIR = { [ASC]: DESC, [DESC]: null };

  /** @type {WeakMap<HTMLTableElement, WeakMap<HTMLTableCellElement, "ascending" | "descending">>} */
  const STATE = new WeakMap();

  /**
   * @param {HTMLTableCellElement} th
   * @param {"ascending" | "descending" | null} dir
   */
  const updateButton = (th, dir) => {
    // Cache original label before button text is appended.
    if (!th.dataset.label) {
      th.dataset.label = th.textContent.trim();
    }

    let button = th.querySelector("button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      th.append(button);
    }

    const icon = dir === ASC ? "▲" : dir === DESC ? "▼" : "⇕";
    const label = th.dataset.label;

    if (dir) {
      const opposite = dir === ASC ? DESC : ASC;
      button.setAttribute(
        "aria-label",
        `Sorted ${dir} by ${label}. Click to sort ${opposite}.`
      );
      th.setAttribute("aria-sort", dir);
    } else {
      button.setAttribute("aria-label", `Sort by ${label}`);
      th.removeAttribute("aria-sort");
    }
    button.textContent = icon;
  };

  /** @type {NodeListOf<HTMLTableElement>} */
  const tables = document.querySelectorAll("table.sortable");
  tables.forEach(table => {
    if (!table.tHead) return;
    table.tHead.querySelectorAll("th").forEach(th => updateButton(th, null));
  });

  /**
   * @param {MouseEvent} ev
   * @returns {HTMLTableCellElement | null}
   */
  const getTrigger = ev => {
    if (!(ev.target instanceof HTMLElement)) return null;
    const th = ev.target.closest("th");
    if (th instanceof HTMLTableCellElement && th.closest("table.sortable")) {
      return th;
    }
    return null;
  };

  /**
   * Stamps original row indices so the table can be reset to its initial order.
   * @param {HTMLTableRowElement[]} rows
   */
  const stampOriginalOrder = rows => {
    rows.forEach((row, i) => {
      if (!row.dataset.sortIndex) {
        row.dataset.sortIndex = String(i);
      }
    });
  };

  document.addEventListener("click", ev => {
    const th = getTrigger(ev);
    if (!th) return;

    /** @type {HTMLTableElement | null} */
    const table = th.closest("table.sortable");
    if (!table || !table.tBodies.length) return;

    let tableState = STATE.get(table);
    if (!tableState) {
      tableState = new WeakMap();
      STATE.set(table, tableState);
    }

    const current = tableState.get(th) ?? null;
    /** @type {"ascending" | "descending" | null} */
    const next = current === null ? ASC : NEXT_DIR[current];

    if (table.tHead) {
      table.tHead.querySelectorAll("th").forEach(otherTh => {
        if (otherTh !== th) {
          tableState.delete(otherTh);
          updateButton(otherTh, null);
        }
      });
    }

    if (next === null) {
      tableState.delete(th);
    } else {
      tableState.set(th, next);
    }
    updateButton(th, next);

    const tbody = table.tBodies[0];
    /** @type {HTMLTableRowElement[]} */
    const rows = Array.from(tbody.rows);
    stampOriginalOrder(rows);

    if (next === null) {
      rows.sort(
        (a, b) =>
          parseInt(/** @type {string} */ (a.dataset.sortIndex), 10) -
          parseInt(/** @type {string} */ (b.dataset.sortIndex), 10)
      );
    } else {
      /** @type {HTMLTableRowElement | null} */
      const headerRow = /** @type {HTMLTableRowElement | null} */ (
        th.closest("tr")
      );
      if (!headerRow) return;
      const colIndex = Array.from(headerRow.cells).indexOf(th);
      if (colIndex === -1) return;

      const isNumeric = rows.every(row => {
        const text = row.cells[colIndex]?.textContent?.trim() ?? "";
        return text !== "" && !isNaN(Number(text));
      });

      const dir = next === ASC ? 1 : -1;
      rows.sort((a, b) => {
        const x = a.cells[colIndex]?.textContent?.trim() ?? "";
        const y = b.cells[colIndex]?.textContent?.trim() ?? "";
        const cmp = isNumeric ? Number(x) - Number(y) : x.localeCompare(y);
        return dir * cmp;
      });
    }

    /** @type {typeof tbody} */
    const newTbody = tbody.cloneNode(false);
    for (const row of rows) newTbody.append(row);
    tbody.replaceWith(newTbody);
  });
}
