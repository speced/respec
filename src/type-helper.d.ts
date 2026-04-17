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

/**
 * A case-insensitive Set<string> that also exposes getCanonicalKey().
 * Corresponds to the InsensitiveStringSet class in core/utils.js.
 */
interface InsensitiveStringSet extends Set<string> {
  getCanonicalKey(key: string): string | undefined;
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

declare var respecConfig: Conf;
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
    error(msg: any): void;
    warning(msg: any): void;
    closeModal(owner?: Element): void;
    freshModal(title: string, content: Node, currentOwner: Element): void;
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
}

interface Node {
  cloneNode<T extends Node = this>(deep?: boolean): T;
}

declare function fetch(input: URL, init?: RequestInit): Promise<Response>;

interface BibliographyMap extends Record<string, BiblioData> {}

interface BiblioData {
  aliasOf?: string;
  id?: string;
  title: string;
  href?: string;
  authors?: string[];
  publisher?: string;
  date?: string;
  rawDate?: string;
  isbn?: string;
  status?: string;
  etAl?: boolean;
  expires: number;
}

/** A BiblioData entry stored in IndexedDB (always has an id). */
interface StoredBiblioEntry extends BiblioData {
  id: string;
}

/**
 * Linting configuration for ReSpec.
 * Can be `false` to disable all linting, or an object mapping rule names to
 * `true`, `false`, or `"warn"` / `"error"`.
 * Supports string indexing so linter-rule files can look up individual rules.
 */
type LintConfig = false | ({ [ruleName: string]: boolean | string });

type ProcessFn = (config: Conf, doc: Document, utils?: unknown) => Promise<void> | void;

/** Configuration object type */
interface Conf {
  authors?: Person[];
  /** Object containing bibliographic data */
  biblio: Record<string, BiblioData>;
  editors?: Person[];
  formerEditors?: Person[];
  /** Set of informative references */
  informativeReferences: InsensitiveStringSet;
  localBiblio?: Record<string, BiblioData>;
  /** Set of normative references */
  normativeReferences: InsensitiveStringSet;
  shortName: string;
  preProcess?: ProcessFn[];
  postProcess?: ProcessFn[];
  afterEnd?: ProcessFn;
  specStatus?: string;
  wgId?: string;
  noToc?: boolean;
  noTOC?: boolean;
  /** Disables injecting ReSpec styles */
  noReSpecCSS?: boolean;

  /** Indicates whether the document is a preview */
  isPreview?: boolean;
  /** The pull request number, if applicable */
  prNumber?: number;
  /** The URL of the pull request, if applicable */
  prUrl?: string;
  /** The GitHub configuration object */
  github?: string | {
    /** The URL of the GitHub repository */
    repoURL: string;
    /** The default branch name */
    branch?: string;
    /** Optional custom pulls URL (for monorepo scenarios) */
    pullsURL?: string;
    /** Optional custom commit history URL (for monorepo scenarios) */
    commitHistoryURL?: string;
    /** The API base URL */
    apiBase?: string;
    /** The full name of the repo (e.g. "w3c/my-spec") */
    fullName?: string;
    /** The issues URL */
    issuesURL?: string;
    /** The new issues URL */
    newIssuesURL?: string;
  };
  /** The title of the document */
  title?: string;

  /** W3C Group - see https://respec.org/w3c/groups */
  group?: string | string[];

  // Boolean flags set by w3c/headers.js
  /** True when specStatus is "base" */
  isBasic?: boolean;
  /** True when specStatus is a CG or BG status */
  isCGBG?: boolean;
  /** True when this is a Final CG or BG report */
  isCGFinal?: boolean;
  /** True when specStatus is "CR" or "CRD" */
  isCR?: boolean;
  /** True when specStatus is "CRD" (Candidate Recommendation Draft) */
  isCRDraft?: boolean;
  /** True when specStatus is "CRY" or "CRYD" (Candidate Registry) */
  isCRY?: boolean;
  /** True when specStatus is "ED" */
  isEd?: boolean;
  /** True when specStatus is "Member-SUBM" */
  isMemberSubmission?: boolean;
  /** True when specStatus is "MO" (Member-Only) */
  isMO?: boolean;
  /** True when specStatus is a W3C Note */
  isNote?: boolean;
  /** True when the document is not on the W3C Recommendation track */
  isNoTrack?: boolean;
  /** True when specStatus is "PR" */
  isPR?: boolean;
  /** True when specStatus is on the Recommendation track */
  isRecTrack?: boolean;
  /** True when specStatus is "REC" */
  isRec?: boolean;
  /** True when specStatus is a Registry track status */
  isRegistry?: boolean;
  /** True when document is neither CGBG nor base */
  isRegular?: boolean;
  /** True when specStatus is "editor-draft-finding" */
  isTagEditorFinding?: boolean;
  /** True when specStatus is a TAG Finding status */
  isTagFinding?: boolean;
  /** True when specStatus is "unofficial" */
  isUnofficial?: boolean;

  // Multi-person/group boolean flags
  /** True when there are multiple editors */
  multipleEditors?: boolean;
  /** True when there are multiple former editors */
  multipleFormerEditors?: boolean;
  /** True when there are multiple authors */
  multipleAuthors?: boolean;
  /** True when wg is an array with more than one entry */
  multipleWGs?: boolean;
  /** Whether to show the previous version link */
  showPreviousVersion?: boolean;
  /** Whether to prepend "W3C" to the status */
  prependW3C?: boolean;
  /** Set to true if the document is not intended to be on the Recommendation track */
  noRecTrack?: boolean;

  // String properties
  /** License for the document */
  license?: string;
  /** The canonical URI for the document */
  canonicalURI?: string | null;
  /** The URI for the history of the document */
  historyURI?: string | null;
  /** The URI to the dated current version of the specification */
  thisVersion?: string;
  /** The URI to the latest version of the specification */
  latestVersion?: string | null;
  /** The URI to the previous version of the specification */
  prevVersion?: string;
  /** The URI of the Editor's Draft */
  edDraftURI?: string;
  /** A subtitle for the specification */
  subtitle?: string;
  /** The name of the mailing list where discussion takes place */
  wgPublicList?: string;
  /** The URI to the test suite */
  testSuiteURI?: string;
  /** The URI to the implementation report */
  implementationReportURI?: string;
  /** The subject prefix for mailing list messages */
  subjectPrefix?: string;
  /** Additional copyright holder(s) */
  additionalCopyrightHolders?: string;
  /** The URI of the previous Editor's Draft */
  prevED?: string;
  /** The short name of the previous Recommendation (if name changed) */
  prevRecShortname?: string;
  /** The URI of the previous Recommendation */
  prevRecURI?: string;
  /** The URI of the errata document */
  errata?: string;
  /** Short human-readable status text */
  textStatus?: string;
  /** Long human-readable status text */
  longStatus?: string;
  /** Human-readable publication date */
  publishHumanDate?: string;
  /** ISO 8601 publication date string */
  publishISODate?: string;
  /** Publication date in YYYY-MM-DD dash format */
  dashDate?: string;
  /** Short ISO date (YYYY-MM-DD) */
  shortISODate?: string;
  /** Working group name(s) */
  wg?: string | string[];
  /** Working group URI(s) */
  wgURI?: string | string[];
  /** Working group patent URI(s) */
  wgPatentURI?: string | string[];
  /** Working group patent policy */
  wgPatentPolicy?: string | string[];
  /** HTML string for working group patent disclosures */
  wgPatentHTML?: string | unknown[];
  /** Type of W3C group */
  groupType?: string | string[];
  /** Base URL for linking to issues */
  issueBase?: string;
  /** URL to the issue tracker */
  issueTracker?: string;
  /** Publication mode (e.g. "LS" for Living Standard) */
  pubMode?: string;
  /** The specStatus of the previous version */
  previousMaturity?: string;
  /** End date of the PR period (for PR documents) */
  prEnd?: string | Date;
  /** End date of the CR period */
  crEnd?: string | Date;
  /** End date of the revised Recommendation review period */
  revisedRecEnd?: string | Date;
  /** Human-readable end of CR period */
  humanCREnd?: string;
  /** Human-readable end of PR period */
  humanPREnd?: string;
  /** Git revision hash */
  gitRevision?: string;
  /** Base URL for at-risk feature links */
  atRiskBase?: string;
  /** Override for the document status */
  overrideStatus?: string;
  /** Override for the document copyright notice */
  overrideCopyright?: string;
  /** URL to the GitHub API for issues */
  githubAPI?: string;
  /** The format of the source document (e.g. "markdown") */
  format?: string;
  /** URI to the charter disclosure for IGs */
  charterDisclosureURI?: string;

  // Number properties
  /** The year the document was published */
  publishYear?: number;
  /** The year the copyright starts */
  copyrightStart?: number | string;
  /** The level number of the specification */
  level?: number;
  /** Maximum table of contents depth */
  maxTocLevel?: number;
  /** Member Submission comment number */
  submissionCommentNumber?: number;

  // Date properties
  /** The publication date */
  publishDate?: Date;
  /** The modification date */
  modificationDate?: Date;
  /** The date on which the previous version was published */
  previousPublishDate?: Date;

  // Array properties
  /** Logos to display in the header */
  logos?: ReSpecLogo[];
  /** Other links to include in the header */
  otherLinks?: Array<{
    key: string;
    value?: string;
    href?: string;
    class?: string;
  }>;
  /** Alternate formats for the document */
  alternateFormats?: Array<{
    uri: string;
    label: string;
    lang?: string;
    type?: string;
  }>;
  /** Functions to call before saving the document */
  beforeSave?: Array<(doc: Document) => void | Promise<void>>;

  // Complex properties
  /** License information */
  licenseInfo?: LicenseInfo;
  /** Linting configuration */
  lint?: LintConfig;
  /** caniuse.com feature configuration */
  caniuse?: string | {
    feature?: string;
    browsers?: string[] | Record<string, string[]>;
    maxAge?: number;
    removeOnSave?: boolean;
    [key: string]: unknown;
  };
  /** External cross-reference configuration */
  xref?: boolean | string | string[] | { url?: string; specs?: string[]; profile?: string };
  /** Whether to include JSON-LD metadata */
  doJsonLd?: boolean;
  /** Whether to highlight variables */
  highlightVars?: boolean;
  /** Whether to add section links */
  addSectionLinks?: boolean;
  /** Whether to auto-pluralize */
  pluralize?: boolean;
  /** Whether to skip injecting the highlight.js CSS */
  noHighlightCSS?: boolean;
  /** Whether to exclude GitHub links */
  excludeGithubLinks?: boolean;
  /** Accessibility linting configuration */
  a11y?: boolean | Record<string, unknown>;
  /** MDN annotation configuration */
  mdn?: boolean | string | { key?: string; specMapUrl?: string; baseJsonPath?: string; maxAge?: number };
  /** Web Monetization configuration */
  monetization?: boolean | string | { paymentPointer?: string; removeOnSave?: boolean };
  /** RFC 2119 usage tracking object, keyed by term */
  respecRFC2119?: Record<string, boolean>;
  /** Whether to place the SotD additional content after the WG info */
  sotdAfterWGinfo?: boolean;
  /** Localization strings for the current language */
  l10n?: Record<string, string>;
}

/**
 * Configuration after all defaults have been applied (i.e., after a
 * profile's `run()` has called `Object.assign(conf, defaults)`).
 * Fields that are guaranteed to be set by defaults — `license`, `logos`,
 * `specStatus`, and `licenseInfo` — are narrowed to their non-optional types.
 *
 * Use this type only for helpers called *after* defaults have been merged
 * into `conf`; pass plain `Conf` to `run()` entry points.
 */
type NormalizedConf = Conf &
  Required<Pick<Conf, "license" | "logos" | "specStatus" | "licenseInfo">>;

type GroupDetails = {
  wgId: number;
  wg: string;
  wgURI: string;
  wgPatentURI: string;
  wgPatentPolicy: string;
  groupType: string;
};

type LicenseInfo = {
  /**
   * The name of the license.
   */
  name: string;
  /**
   * The URL of the license. Null when the document is unlicensed.
   */
  url: string | null;
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

/** Represents a request to the core/xref module */
declare module "core/xref" {
  import { IDBPDatabase, DBSchema } from "idb";

  /** Represents a single request entry */
  export interface RequestEntry {
    term: string;
    id: string;
    types: string[];
    /** Spec URLs to restrict the search to */
    specs?: string[][];
    /** The context in which the term appears */
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

declare enum W3CGroupType {
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

declare class RespecError extends Error {
  plugin: string;
  hint?: string;
  elements?: HTMLElement[];
  details?: string;
  constructor(
    message: string,
    pluginName: string,
    options: {
      isWarning: boolean;
      elements?: HTMLElement[];
      title?: string;
    }
  );
  toJSON(): {
    message: string;
    name: string;
    plugin: string;
    hint?: string;
    elements?: any[];
    title?: string;
    details?: any;
    stack?: string;
  };
}

/**
 * Localization strings for different languages.
 *
 */
type LocalizationStrings = {
  de: Record<string, string>;
  en: Record<string, string>;
  ja: Record<string, string>;
  nl: Record<string, string>;
  zh: Record<string, string>;
  cs: Record<string, string>;
};

interface LinkProps {
  href: string;
  title: string;
}

interface CiteDetails {
  key: string;
  isNormative: boolean;
  frag: string;
  path: string;
  href?: string;
}

interface ReSpecLogo {
  src?: string;
  alt?: string;
  height?: number | string;
  width?: number | string;
  url?: string;
  href?: string;
  id?: string;
}

interface ReSpecPlugin {
  name?: string;
  run?: (conf: Conf) => Promise<void> | void;
  Plugin?: new (conf: Conf) => { run(): Promise<void> | void };
  prepare?: (conf: Conf) => Promise<void> | void;
}
