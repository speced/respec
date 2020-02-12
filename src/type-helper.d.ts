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

declare var respecConfig: any;
interface Window {
  respecVersion: string;
  respecUI: {
    show(): void;
    hide(): void;
    enable(): void;
    addCommand(
      label: string,
      handler: () => void,
      keyShort?: string,
      icon?: string
    ): any;
    error(msg: string): void;
    warning(msg: string): void;
    closeModal(owner?: Element): void;
    freshModal(title: string, content: string, currentOwner: Element): void;
  };
  require?: {
    (deps: string[], callback: (...modules: any[]) => void): void;
    modules: { [dep: string]: any };
  };
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

interface Document {
  respecIsReady: Promise<void>;
  createNodeIterator<T>(
    root: Node,
    whatToShow?: number,
    filter?: (node: T) => number | null
  ): NodeIterator<T>;
  createTreeWalker<T>(
    root: Node,
    whatToShow?: number,
    filter?: (node: T) => boolean | null
  ): TreeWalker<T>;
}

interface NodeIterator<T extends Node> {}
interface TreeWalker<T extends Node> {}

interface Node {
  cloneNode<T extends Node = this>(deep?: boolean): T;
}

declare function fetch(input: URL, init?: RequestInit): Promise<Response>;

declare namespace Intl {
  class ListFormat {
    constructor(
      locales?: string | string[],
      options?: {
        localeMatcher?: "lookup" | "best fit";
        style: "long" | "narrow";
        type: "conjunction" | "disjunction" | "unit";
      }
    );

    format(items: Iterable<string>): string;
  }
}

interface JQuery {
  renameElement(name: string): JQuery<any>;
  getDfnTitles(): string[];
  linkTargets(): import("./core/utils.js").LinkTarget[];
  makeID(pfx?: string, txt?: string, noLC?: boolean): string;
  allTextNodes(exclusions: string[]): Text[];
}

interface BiblioData {
  aliasOf?: string;
  id?: string;
  title: string;
  href?: string;
  authors?: string[];
}
interface Conf {
  informativeReferences: Set<string>;
  normativeReferences: Set<string>;
  localBiblio?: Record<string, BiblioData>;
  biblio: Record<string, BiblioData>;
}

module "core/xref" {
  export interface RequestEntry {
    term: string;
    id: string;
    types: string[];
    specs?: string[][];
    for?: string;
  }

  export interface SearchResultEntry {
    uri: string;
    shortname: string;
    spec: string;
    type: string;
    normative: boolean;
    for?: string[];
  }

  export interface Response {
    result: {
      [id: string]: SearchResultEntry[];
    };
    query?: RequestEntry[];
  }
}
