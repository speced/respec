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

// See: core/linter-rules/a11y
interface AxeViolation {
  id: string;
  help: string;
  helpUrl: string;
  description: string;
  nodes: { failureSummary: string; element: HTMLElement }[];
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
  axe?: {
    run(context: Node, options: any): Promise<{ violations: AxeViolation[] }>;
  };
}

interface Document {
  respec: {
    readonly version: string;
    readonly ready: Promise<void>;
  };
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
    formatToParts(items: string[]): {
      type: "element" | "literal";
      value: string;
    }[];
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

interface BibliographyMap extends Record<string, BiblioData> {}

interface BiblioData {
  aliasOf?: string;
  id?: string;
  title: string;
  href?: string;
  authors?: string[];
  publisher?: string;
  date?: string;
  status?: string;
  etAl?: boolean;
  expires: number;
}
interface Conf {
  authors?: Person[];
  biblio: Record<string, BiblioData>;
  editors?: Person[];
  formerEditors?: Person[];
  informativeReferences: Set<string>;
  localBiblio?: Record<string, BiblioData>;
  normativeReferences: Set<string>;
  shortName: string;
}

type LicenseInfo = {
  /**
   * The name of the license.
   */
  name: string;
  /**
   * The URL of the license.
   */
  url: string;
  /**
   * The short linking text of license.
   */
  short: string;
};

type ResourceHintOption = {
  /**
   * The type of hint.
   **/
  hint: "preconnect" | "preload" | "dns-prefetch" | "prerender";
  /**
   * The URL for the resource or origin.
   **/
  href: string;
  /**
   * the CORS mode to use (see HTML spec).
   */
  corsMode?: "anonymous" | "use-credentials";
  /**
   * fetch destination type.
   */
  as?: "script" | "style" | "image";
  /**
   * If the hint should remain in the spec after processing.
   */
  dontRemove?: boolean;
};

module "core/xref" {
  import { IDBPDatabase, DBSchema } from "idb";

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

  interface XrefDBScheme extends DBSchema {
    xrefs: {
      key: string;
      value: { query: RequestEntry; result: SearchResultEntry[] };
      indexes: { byTerm: string };
    };
  }

  export type XrefDatabase = IDBPDatabase<XrefDBScheme>;
}

enum W3CGroupType {
  "bg",
  "cg",
  "ig",
  "wg",
}

type Person = {
  name: string;
  w3cid?: string | number;
  mailto?: string;
  url?: string;
  orcid?: string;
  company?: string;
  companyURL?: string;
  note?: string;
  retiredDate?: string;
  extras?: PersonExtras[];
};

type PersonExtras = {
  name: string;
  class?: string;
  href?: string;
};

type EventTopic =
  | "amend-user-config"
  | "beforesave"
  | "end-all"
  | "error"
  | "plugins-done"
  | "start-all"
  | "toc"
  | "warn";

type DefinitionValidator = (
  /** Text to validate. */
  text: string,
  /** The type of thing being validated. */
  type: string,
  /** The element from which the validation originated. */
  element: HTMLElement,
  /** The name of the plugin originating the validation. */
  pluginName: string
) => boolean;
