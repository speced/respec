export interface RespecConfig {
  /** Lint for accessibility issues using axe-core */
  a11y: Accessibility;

  /** Enable/disable § section markers */
  addSectionLinks: false;

  /** Authors of the document */
  authors: Person[];

  /** Add a Can I Use browser support table  */
  caniuse: string | { feature: string; browsers: string[]; versions: number };

  /** The URL of the Editor's Draft, used in the header */
  edDraftURI: UrlString;

  /** Editors of the document */
  editors: Person[];

  /** Treat the document as being in a format other than HTML */
  format: "markdown";

  /** Past editors of the document */
  formerEditors: Person[];

  /** GitHub repository corresponding to the document */
  github: string | UrlString;

  /** On-click variable usage highlighting */
  highlightVars: boolean;

  /** Add a red box to tell document is a preview */
  isPreview: boolean;
  license: "cc-by" | "cc0" | "w3c-software" | "w3c-software-doc";

  /** Warn about easy-to-miss mistakes */
  lint: boolean | Record<string, boolean>;

  /** Add custom entries in SpecRef format */
  localBiblio: Record<string, object>;

  /** Override the default logo with one or more other logos. */
  logos: Logo[];

  /** Maximum depth of the table of contents */
  maxTocLevel: number;

  /** Annotate document with browser support tables from MDN */
  mdn: boolean | string;

  /** In-place edit date of an already published document */
  modificationDate: string;

  /** Skip Table of Contents generation */
  noTOC: boolean;

  /** Additional links in the header of the document */
  otherLinks: { key: string; data: { value: string; href: UrlString }[] }[];

  /** Automatic pluralization support for dfn elements */
  pluralize: boolean;

  /** Functions to invoke after ReSpec has processed the HTML source */
  postProcess: ((conf: RespecConfig, document: Document) => void)[];

  /** Functions to invoke before ReSpec starts processing the HTML source */
  preProcess: ((conf: RespecConfig, document: Document) => void)[];

  /** Publication date of the present document */
  publishDate: string;
  shortName: string;
  specStatus: SpecStatus;

  /** Subject prefix for mailing list */
  subjectPrefix: string;

  /** Add a custom subtitle just below the spec title */
  subtitle: string;
  testSuiteURI: UrlString;

  /** Show introductory sections in Table of Contents */
  tocIntroductory: string;

  /** Automatically reference terms in other documents */
  xref: boolean | string | string[] | { profile: string; specs: string[] };

  // W3C specific options
  additionalCopyrightHolders: string;
  addPatentNote: string;
  alternateFormats: { uri: string; label: string }[];
  canonicalURI: UrlString | "edDraft" | "TR";
  charterDisclosureURI: UrlString;
  copyrightStart: Year;
  crEnd: IsoDate;
  doJsonLd: boolean;
  errata: UrlString;
  implementationReportURI: UrlString;
  lcEnd: IsoDate;
  level: number;
  noRecTrack: boolean;
  prevED: UrlString;
  previousDiffURI: UrlString;
  previousMaturity: IsoDate;
  previousPublishDate: IsoDate;
  prevRecShortname: string;
  prevRecURI: UrlString;
  submissionCommentNumber: string;
  wg: string;
  wgId: string;
  wgPatentURI: UrlString;
  wgPublicList: string;
  wgURI: UrlString;
}

/** A valid WHATWG URL, as a string */
type UrlString = string;

/** A date in YYYY-MM-DD format */
type IsoDate = string;

/** A 4-digit number representing year */
type Year = number;

type Accessibility =
  | boolean
  | { runOnly: string[] }
  | { rules: Record<string, { enabled: boolean }> };

interface Person {
  name: string;
  mailto?: string;
  url?: UrlString;
  company?: string;
  companyURL?: UrlString;
  w3cid?: number;
  orcid?: string;
  retiredDate?: IsoDate;
  note?: string;
  extras?: { name: string; class: string; href: string }[];
}

interface Logo {
  src: UrlString;
  alt: string;
  height: number;
  width: number;
  id: string;
  href: UrlString;
}

type Browsers =
  | "and_chr"
  | "and_ff"
  | "and_uc"
  | "android"
  | "bb"
  | "chrome"
  | "edge"
  | "firefox"
  | "ie"
  | "ios_saf"
  | "op_mini"
  | "op_mob"
  | "opera"
  | "safari"
  | "samsung";

type SpecStatus =
  | "base"
  | "MO"
  | "unofficial"
  | "ED"
  | "FPWD"
  | "WD"
  | "LC"
  | "LD"
  | "LS"
  | "CR"
  | "PR"
  | "PER"
  | "REC"
  | "RSCND"
  | "FPWD-NOTE"
  | "WG-NOTE"
  | "BG-DRAFT"
  | "BG-FINAL"
  | "CG-DRAFT"
  | "CG-FINAL"
  | "IG-NOTE"
  | "Member-SUBM"
  | "draft-finding"
  | "finding";
