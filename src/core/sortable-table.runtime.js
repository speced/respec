// @ts-check
if (document.respec) {
  document.respec.ready.then(setupSortableTable);
} else {
  setupSortableTable();
}

function setupSortableTable() {
  /**
   * Maps each table to a map of th -> current sort direction.
   * "ascending" | "descending" | null (not sorted)
   * @type {WeakMap<HTMLTableElement, WeakMap<HTMLTableCellElement, "ascending" | "descending">>}
   */
  const STATE = new WeakMap();

  /**
   * Returns the visible label of the <th> cell, excluding any button text.
   * @param {HTMLTableCellElement} th
   * @returns {string}
   */
  const getThLabel = th => {
    return th.dataset.label ?? th.textContent.trim();
  };

  /**
   * Creates or updates the sort button inside a <th>.
   * dir: null = unsorted, "ascending" = A→Z, "descending" = Z→A
   *
   * @param {HTMLTableCellElement} th
   * @param {"ascending" | "descending" | null} dir
   */
  const updateButton = (th, dir) => {
    // Cache the original label on first call so the button text is not
    // included in subsequent label reads.
    if (!th.dataset.label) {
      th.dataset.label = th.textContent.trim();
    }

    let button = th.querySelector("button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      th.append(button);
    }

    const icon = dir === "ascending" ? "▲" : dir === "descending" ? "▼" : "⇕";
    const label = getThLabel(th);

    if (dir) {
      button.setAttribute(
        "aria-label",
        `Sorted ${dir} by ${label}. Click to sort ${dir === "ascending" ? "descending" : "ascending"}.`
      );
    } else {
      button.setAttribute("aria-label", `Sort by ${label}`);
    }
    button.textContent = icon;

    if (dir) {
      th.setAttribute("aria-sort", dir);
    } else {
      th.removeAttribute("aria-sort");
    }
  };

  /** @type {NodeListOf<HTMLTableElement>} */
  const tables = document.querySelectorAll("table.sortable");
  for (const table of tables) {
    if (!table.tHead) continue;
    for (const th of table.tHead.querySelectorAll("th")) {
      updateButton(th, null);
    }
    STATE.set(table, new WeakMap());
  }

  /**
   * Returns the <th> that triggered the sort, or null.
   * Handles both direct clicks on <th> and clicks on the button inside.
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
    // Toggle: null→ascending, ascending→descending, descending→null (reset)
    /** @type {"ascending" | "descending" | null} */
    const next =
      current === null
        ? "ascending"
        : current === "ascending"
          ? "descending"
          : null;

    // Reset all other headers in this table
    if (table.tHead) {
      for (const otherTh of table.tHead.querySelectorAll("th")) {
        if (otherTh !== th) {
          tableState.delete(otherTh);
          updateButton(otherTh, null);
        }
      }
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

    if (next === null) {
      // Restore original order — rows carry their original index
      rows.sort(
        (a, b) =>
          (a.dataset.sortIndex ? parseInt(a.dataset.sortIndex) : 0) -
          (b.dataset.sortIndex ? parseInt(b.dataset.sortIndex) : 0)
      );
    } else {
      // Record original order on first sort
      rows.forEach((row, i) => {
        if (!row.dataset.sortIndex) {
          row.dataset.sortIndex = String(i);
        }
      });

      /** @type {HTMLTableRowElement | null} */
      const headerRow = /** @type {HTMLTableRowElement | null} */ (
        th.closest("tr")
      );
      if (!headerRow) return;
      const colIndex = Array.from(headerRow.cells).indexOf(th);
      if (colIndex === -1) return;

      rows.sort((a, b) => {
        const x = a.cells[colIndex]?.textContent?.trim() ?? "";
        const y = b.cells[colIndex]?.textContent?.trim() ?? "";

        // Numeric sort when both cells look like numbers
        const numX = parseFloat(x);
        const numY = parseFloat(y);
        if (!isNaN(numX) && !isNaN(numY)) {
          return next === "ascending" ? numX - numY : numY - numX;
        }

        return next === "ascending" ? x.localeCompare(y) : y.localeCompare(x);
      });
    }

    /** @type {typeof tbody} */
    const newTbody = tbody.cloneNode(false);
    newTbody.append(...rows);
    tbody.replaceWith(newTbody);
  });
}
