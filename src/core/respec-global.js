// @ts-check
/**
 * This module adds a `respec` object to the `document` with the following
 * readonly properties:
 *  - version: returns version of ReSpec Script.
 *  - ready: returns a promise that settles when ReSpec finishes processing.
 *
 */
import { serialize } from "../core/exporter.js";
import { sub } from "./pubsubhub.js";

export const name = "core/respec-global";

class ReSpec {
  constructor() {
    /** @type {Promise<void>} */
    this._respecDonePromise = new Promise(resolve => {
      sub("end-all", resolve, { once: true });
    });

    this.errors = [];
    this.warnings = [];

    sub("error", rsError => {
      console.error(rsError, rsError.toJSON());
      this.errors.push(rsError);
    });
    sub("warn", rsError => {
      console.warn(rsError, rsError.toJSON());
      this.warnings.push(rsError);
    });
  }

  get version() {
    return window.respecVersion;
  }

  get ready() {
    return this._respecDonePromise;
  }

  async toHTML() {
    return serialize("html", document);
  }
}

export function init() {
  const respec = new ReSpec();
  Object.defineProperty(document, "respec", { value: respec });
}
