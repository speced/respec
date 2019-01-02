interface Element {
  /*
   * This signature helps JSDoc to assert types in a separate line:
   * / @type {HTMLElement} /
   * const parent = child.closest(selector);
   * 
   * Rather than:
   * const parent = / @type {HTMLElement} / (child.closest(selector));
   */
  closest<T extends Element>(selector: string): T | null;
}

declare module "text!*" {
  const value: string;
  export default value;
}
