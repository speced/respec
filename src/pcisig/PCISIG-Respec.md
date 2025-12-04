# PCISIG Respec Configuration

All PCISIG styles Respec Documents must start with the following &lt;head&gt; section. The contents of `resecConfig` are described below.

    <head>
    <meta charset='utf-8'/>
    <title>...</title>
    <script src='http://sglaser.github.io/respec/scripts/pcisig-respec-common.js' class='remove'></script>
    <script class='remove'>
      var respecConfig = {
        specStatus: "WD",
        specRevision: "1.0".
        specDraftLevel: "0.3",
        wg: "PWG",
        shortName: "shortName"
      };
    </script>
    </head>

## respecConfig: Required attributes    
The following items are required.

### ShortName
    shortName: "PCIe-Base"

Short name for the specification.
Spaces are not allowed.
This value is used in URLs for the specification and in the side banner.

### specStatus
    specStatus: "WD-CWG"
Status of this draft.
Valid encodings for Specification Track documents are:

| specStatus             | Description                                      | Published | License
| ---------------------- | ------------------------------------------------ | --------- | -------
| `WD` or `WG-CWG`       | Working Draft before Cross Workgroup Review      | No        | `nda`
| `WD-MEM`               | Working Draft before Member Review               | No        | `nda`
| `WD-FINAL`             | Working Draft before Final Publication           | No        | `nda`
| `RC` or `RC-CWG`       | Release Candidate before Cross Workgroup Review  | No        | `nda`
| `RC-MEM`               | Release Candidate before Member Review           | No        | `nda`
| `RC-FINAL`             | Release Candidate before Final Publication       | No        | `nda`
| `PUB` or `PUB-CWG`     | Cross Workgroup Review Draft Specification       | Yes       | `pcisig-draft`
| `PUB-MEM`              | Member Review Draft Specification                | Yes       | `pcisig-draft`
| `PUB-FINAL` or `FINAL` | Final Specification                              | Yes       | `pcisig-final`

The `PUB-FINAL` and `FINAL` encodings are permitted only of `specDraftLevel` is `"1.0"` 

Valid encodings for Non-Specification Track documents are:

| specStatus             | Description                                      | Published | License
| ---------------------- | ------------------------------------------------ | --------- | -------
| `UNOFFICIAL`           | Unofficial Public Document                       | Yes       | `pcisig-note`
| `PRIVATE`              | Unofficial Private Document                      | No        | `nda`
| `NOTE`                 | Note                                             | Yes       | `pcisig-note`
| `DRAFT-NOTE`           | Draft Note                                       | No        | `nda`
| `MEMBER-SUBMISSION`    | Member Submission to PCISIG WG                   | No        | `nda`
| `MEMBER-PRIVATE`       | Draft Member Submission to PCISIG WG             | No        | `none` 
| `TEAM-SUBMISSION`      | Team Submission to PCISIG WG                     | No        | `nda`
| `TEAM-PRIVATE`         | Draft Team Submission to PCISIG WG               | No        | `none`
| `BASE`                 | Base, unspecified status                         | ?         | ? 


### specRevision
    specRevision: "1.0"
Revision of the Specification. Specifications start at 1.0. 

### specDraftLevel
    specDraftLevel: "0.5"
Draft Level of the Specification.
These are defined in the PCISIG Specifications Procedures document.

### previousStatus
    previousStatus: "PUB-MEM"
Value of `specStatus` of the previous release of this specification. The value `"none"` is used to indicate that there was no previous release.

### previousRevision
    previousDraftLevel: "1.0"
Value of `specDraftLevel` of the previous release of this specification.

### previousDraftLevel
    previousDraftLevel: "0.3"
Value of `specDraftLevel` of the previous release of this specification.

### previousPublishDate
    previousPublishDate: "14 Sep 2017"
    previousPublishDate: "2017-09-14"
Publication date acceptable to the JavaScript Date.parse() primitive.
This is either the RFC 2822 format (first example) or ISO 8601 format (second example).
    
### errata
    errata: "http://xxx"
URL of the errata specification for this document. Required if `specStatus` is `FINAL` or `PUB-FINAL`.

### wg
    wg: ["PWG", "EWG"]
Working Group or Groups associated with the specification. Required if `specStatus` reflects a Specification Track document.

## respecConfig: Optional attributes

### license
    license: "`pcisig-draft`"
License that applies to the specification. If not specified, this value is computed from `specStatus`.
Valid encodings are:

| license        | Description
| -------------- | -----------
| `nda`          | Workgroup Non-Disclosure Agreement applies
| `pcisig-draft` | Draft PCISIG Specification
| `pcisig-final` | Published PCISIG Specification
| `pcisig-note`  | Published PCISIG Note, White paper, Presentation, &hellip;
| `none`         | No license granted: Internal or private document

### editor
The following items are optional:

    editor : [{ name : "Steve Glaser",
                email: "sglaser@nvidia.com",
                url: "http://www.sglaser.com" }]
Array of editors.
Each array element is an object with a collection of attributes for the editor.
The `name` attribute is required.

### author
  
    author: [{ name : "John Doe"},
             { name: "Jane Doe"} ]
Array of authors. Same structure as `editor`.

### alternateFormats
  
    alternateFormats: [{ label: "PDF",
                         type: "PDF",
                         uri: "https://www.pcisig.com/Spec/xyzzy-FINAL-1.0.pdf"}]
Array of alternate formats for this document.
Each element is an object that must contain the attributes `label` and `uri` and may contain the attributes `lang` and `type`.

### bugTracker
    bugTracker: {new: "http://xxx", open: "http://yyy"}
URL for the bugtracker for this specification. New is the URL to file a new bug. Open is the URL to show all open bugs.

### noToc
    noToc: true
If `true`, the Table of Contents, Table of Figures, Table of Tables, and Table of Equations are suppressed.
If `false`, these are created if the associated sections are present in the document.
Default is `false`.

### logos
    logos: [ alt:  "alternate text",
             src:  "http://xxx.xyzzy.com/xyzzy_logo.png",
             href: "http://xxx.xyzzy.com",
             width: 211 ]
Array or logo elements that are used in addition to the PCI Express logo.

### cwgReviewEnd
    cwgReviewEnd: "1 Oct 2017"
Date that the Cross Workgroup Review ends. Required if `specStatus` is `PUB-CWG`.

### memReviewEnd:
    memReviewEnd: "31 Dec 2017"
Date that the Member Review Period ends. Required if `specStatus` is `PUB-MEM`.

### title
    title: "PCI Express Base Specification"
Title of this document. If not present, the `<title>` element from the `<head>` is used.

### subtitle
    subtitle: "Latest version of this wonderful technology"
Optional subtitle of this document.

### copyrightStart
    copyrightStart: "1990"
Year of the beginning of the copyright for this document.


   
