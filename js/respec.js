
// ------------------------------------------------------------------------------------------ //
//  ReSpec.js -- a specification-writing tool
//  Robin Berjon, http://berjon.com/
//  ----------------------------------------------------------------------------------------- //
//  Documentation: http://dev.w3.org/2009/dap/ReSpec.js/documentation.html
//  License: http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231
// ------------------------------------------------------------------------------------------ //

// SUPPORT
//  The official support channel for ReSpec is spec-prod@w3.org.
//  The archives are available at http://lists.w3.org/Archives/Public/spec-prod/
//  You can subscribe by sending email to spec-prod-request@w3.org with "subscribe" as the
//  subject line.
//  Please use that instead of emailing me (Robin) directly as the chances are that questions
//  or enhancement ideas will be shared by others. Thanks!

// XXX TODO
//  - move to the top of dev. hierarchy
//  - add autolinking to headers in the output (like WebIDL)
//  - better inline dependent CSS
//  - add typographical conventions section
//  - WebIDL
//      . make it so that extended attributes on members and attributes are only wrapped if needed
//      . make processor aware of some extended attributes (e.g. Constructor)
//      . support variadic params
//      . support arrays
//      . support special operations: getter, setter, creator, deleter, caller, omittable
//      . support stringifiers
//  - add support for a test variant of the specification, based on the ideas in P+C
//  - some refactoring is in order
//  - make a widget that can save using the FS API, and inject the API without it being in the template,
//    inline CSS without hassle, etc.
//  - make a list of links to issues appear on a key combination
//  - warn on empty links to no dfn (perhaps in a special debug mode?)
//  - make everything that uses "::before" actually generate the real content instead

// NO LONGER ANYTHING USEFUL HERE!