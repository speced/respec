# Change Log

## [v23.2.0](https://github.com/w3c/respec/tree/v23.2.0) (2018-10-04)
[Full Changelog](https://github.com/w3c/respec/compare/v23.1.1...v23.2.0)

**Closed issues:**

- Export crashes on the editor's draft of JSON-LD [\#1842](https://github.com/w3c/respec/issues/1842)

**Merged pull requests:**

- feat\(core/pubsubhub\): show error if callback fails [\#1844](https://github.com/w3c/respec/pull/1844) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/data-cite\): support contextual citing [\#1841](https://github.com/w3c/respec/pull/1841) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.1.1](https://github.com/w3c/respec/tree/v23.1.1) (2018-10-03)
[Full Changelog](https://github.com/w3c/respec/compare/v23.1.0...v23.1.1)

## [v23.1.0](https://github.com/w3c/respec/tree/v23.1.0) (2018-10-02)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.5...v23.1.0)

**Closed issues:**

- IDL link to local members in same document [\#1811](https://github.com/w3c/respec/issues/1811)
- Change the way references are defined as informative or normative [\#1754](https://github.com/w3c/respec/issues/1754)

**Merged pull requests:**

- chore\(package\): Replace http-server with serve [\#1840](https://github.com/w3c/respec/pull/1840) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(core/inlines\): change the way inline references are used [\#1839](https://github.com/w3c/respec/pull/1839) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor\(tests/utils\): migrate jquery-enhanced-spec to utils-spec [\#1838](https://github.com/w3c/respec/pull/1838) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/xref\): search locally first [\#1837](https://github.com/w3c/respec/pull/1837) ([sidvishnoi](https://github.com/sidvishnoi))
- Update eslint-plugin-prettier to the latest version 🚀 [\#1836](https://github.com/w3c/respec/pull/1836) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- feat\(respec-worker\): dynamically load highlight.js languages [\#1835](https://github.com/w3c/respec/pull/1835) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.5](https://github.com/w3c/respec/tree/v23.0.5) (2018-09-28)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.4...v23.0.5)

**Merged pull requests:**

- fix\(core/utils\): renameElement throws unexpected error [\#1833](https://github.com/w3c/respec/pull/1833) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.4](https://github.com/w3c/respec/tree/v23.0.4) (2018-09-26)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.3...v23.0.4)

**Closed issues:**

- Duplicate ids are generated for sections with the same title in Markdown docs [\#1830](https://github.com/w3c/respec/issues/1830)
- Do not signal missing definitions for methods marked with \[Default\] [\#1309](https://github.com/w3c/respec/issues/1309)
- Consider moving to semantic-release [\#1186](https://github.com/w3c/respec/issues/1186)

**Merged pull requests:**

- fix\(core/example\): duplicate ids [\#1832](https://github.com/w3c/respec/pull/1832) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/utils\): disable auto headerIds in marked [\#1831](https://github.com/w3c/respec/pull/1831) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.3](https://github.com/w3c/respec/tree/v23.0.3) (2018-09-17)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.2...v23.0.3)

**Closed issues:**

- No ID for section: Table of Contents [\#1828](https://github.com/w3c/respec/issues/1828)

**Merged pull requests:**

- fix\(core/structure\): toc heading must have id [\#1829](https://github.com/w3c/respec/pull/1829) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.2](https://github.com/w3c/respec/tree/v23.0.2) (2018-09-17)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.1...v23.0.2)

**Implemented enhancements:**

- Figure out how to test in Edge [\#723](https://github.com/w3c/respec/issues/723)
- Write a pre-commit hook that checks that `fdescribe` and `fit` are not present in tests [\#622](https://github.com/w3c/respec/issues/622)

**Fixed bugs:**

- Fully qualified method names are not coded [\#1437](https://github.com/w3c/respec/issues/1437)
- Line breaks in WebIDL pre sections are ignored/replaced [\#1162](https://github.com/w3c/respec/issues/1162)
- Permalink text is misleading and links should be moved outside of the heading element [\#827](https://github.com/w3c/respec/issues/827)

**Closed issues:**

- Linking warnings should not show normalized form [\#1676](https://github.com/w3c/respec/issues/1676)
- Use npm version on release [\#1653](https://github.com/w3c/respec/issues/1653)
- Run tests sync and async [\#1140](https://github.com/w3c/respec/issues/1140)
- Experiment with progressive rendering [\#1080](https://github.com/w3c/respec/issues/1080)
- Do processing on a hidden node to fix screen reader and permalink problems [\#971](https://github.com/w3c/respec/issues/971)
- webidl-contiguous incorrectly links to non-idl definition [\#836](https://github.com/w3c/respec/issues/836)
- Allow people to deploy ReSpec as a dependency [\#824](https://github.com/w3c/respec/issues/824)
- Permalinks should be outside of headers [\#425](https://github.com/w3c/respec/issues/425)

**Merged pull requests:**

- fix\(core/webidl\): fully qualified names not coded [\#1827](https://github.com/w3c/respec/pull/1827) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.1](https://github.com/w3c/respec/tree/v23.0.1) (2018-09-15)
[Full Changelog](https://github.com/w3c/respec/compare/v23.0.0...v23.0.1)

**Merged pull requests:**

- fix\(core/example\): self-link pre-based examples [\#1826](https://github.com/w3c/respec/pull/1826) ([marcoscaceres](https://github.com/marcoscaceres))

## [v23.0.0](https://github.com/w3c/respec/tree/v23.0.0) (2018-09-15)
[Full Changelog](https://github.com/w3c/respec/compare/v22.7.2...v23.0.0)

**Closed issues:**

- Add self-links to headings \(§ hyperlink anchor\) [\#1821](https://github.com/w3c/respec/issues/1821)

**Merged pull requests:**

- BREAKING CHANGE: remove old permalink code [\#1825](https://github.com/w3c/respec/pull/1825) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update dep, add Sid as contributor [\#1824](https://github.com/w3c/respec/pull/1824) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/examples\): self-link examples [\#1823](https://github.com/w3c/respec/pull/1823) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/id-headers\): add section links [\#1822](https://github.com/w3c/respec/pull/1822) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.7.2](https://github.com/w3c/respec/tree/v22.7.2) (2018-09-15)
[Full Changelog](https://github.com/w3c/respec/compare/v22.7.1...v22.7.2)

**Closed issues:**

- improved UX: normative and informative references should link directly, to correspond to web best practices and user expectations [\#1820](https://github.com/w3c/respec/issues/1820)
- npm start doesn't build all components [\#1580](https://github.com/w3c/respec/issues/1580)

**Merged pull requests:**

- fix\(core/biblio\): avoid dup refs when case differs [\#1819](https://github.com/w3c/respec/pull/1819) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.7.1](https://github.com/w3c/respec/tree/v22.7.1) (2018-09-06)
[Full Changelog](https://github.com/w3c/respec/compare/v22.7.0...v22.7.1)

**Closed issues:**

- data-dfn-for ignored for duplicate IDL enum terms [\#1814](https://github.com/w3c/respec/issues/1814)

**Merged pull requests:**

- fix\(webIDL\): unambiguously link emum values [\#1816](https://github.com/w3c/respec/pull/1816) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.7.0](https://github.com/w3c/respec/tree/v22.7.0) (2018-09-05)
[Full Changelog](https://github.com/w3c/respec/compare/v22.6.0...v22.7.0)

**Closed issues:**

- Autogenerated \(section\) IDs omit unicode characters [\#1813](https://github.com/w3c/respec/issues/1813)
- Small-caps is not appropriate for `\<code\>` [\#1812](https://github.com/w3c/respec/issues/1812)

**Merged pull requests:**

- feat\(core/caniuse\): add more browser keys [\#1818](https://github.com/w3c/respec/pull/1818) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/utils\): generate ids without diacritical marks [\#1817](https://github.com/w3c/respec/pull/1817) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/caniuse\): add mobile Chrome and Safari [\#1815](https://github.com/w3c/respec/pull/1815) ([christianliebel](https://github.com/christianliebel))

## [v22.6.0](https://github.com/w3c/respec/tree/v22.6.0) (2018-08-27)
[Full Changelog](https://github.com/w3c/respec/compare/v22.5.2...v22.6.0)

**Merged pull requests:**

- Give examples IDs based on example number and title [\#1810](https://github.com/w3c/respec/pull/1810) ([gkellogg](https://github.com/gkellogg))

## [v22.5.2](https://github.com/w3c/respec/tree/v22.5.2) (2018-08-23)
[Full Changelog](https://github.com/w3c/respec/compare/v22.5.1...v22.5.2)

## [v22.5.1](https://github.com/w3c/respec/tree/v22.5.1) (2018-08-21)
[Full Changelog](https://github.com/w3c/respec/compare/v22.5.0...v22.5.1)

**Fixed bugs:**

- ‘File a bug’ link broken despite correct GitHub config [\#1803](https://github.com/w3c/respec/issues/1803)

**Closed issues:**

- Linter reports false errors on "local-refs-exist" when href contains unicode symbols [\#1808](https://github.com/w3c/respec/issues/1808)

**Merged pull requests:**

- fix\(lint/local-refs-exist\): handle unicode characters in IDs [\#1809](https://github.com/w3c/respec/pull/1809) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor\(core/fix-headers\): remove jQuery dependencies [\#1807](https://github.com/w3c/respec/pull/1807) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor\(core/jquery-enhanced\): migrate $renameElement to vanilla js [\#1806](https://github.com/w3c/respec/pull/1806) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/github\): Support conf.github without trailing slash [\#1805](https://github.com/w3c/respec/pull/1805) ([sidvishnoi](https://github.com/sidvishnoi))
- Update marked to the latest version 🚀 [\#1802](https://github.com/w3c/respec/pull/1802) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v22.5.0](https://github.com/w3c/respec/tree/v22.5.0) (2018-08-16)
[Full Changelog](https://github.com/w3c/respec/compare/v22.4.0...v22.5.0)

**Closed issues:**

- \[META\] Summary - Google Summer of Code 2018 [\#1799](https://github.com/w3c/respec/issues/1799)
- No space after readonly in "readonly maplike" definitions [\#1794](https://github.com/w3c/respec/issues/1794)
- Replace `deps/domReady` with a wrapper for deprecation notice [\#1793](https://github.com/w3c/respec/issues/1793)
- standard way to mark fingerprinting surface vectors [\#1788](https://github.com/w3c/respec/issues/1788)
- Use eslint on Travis [\#1711](https://github.com/w3c/respec/issues/1711)

**Merged pull requests:**

- Update eslint-config-prettier to the latest version 🚀 [\#1801](https://github.com/w3c/respec/pull/1801) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update eslint-config-prettier to the latest version 🚀 [\#1800](https://github.com/w3c/respec/pull/1800) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update karma to the latest version 🚀 [\#1798](https://github.com/w3c/respec/pull/1798) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Mark deps/domReady as deprecated [\#1797](https://github.com/w3c/respec/pull/1797) ([saschanaz](https://github.com/saschanaz))
- \(core/xref\): support inline IDL [\#1765](https://github.com/w3c/respec/pull/1765) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.4.0](https://github.com/w3c/respec/tree/v22.4.0) (2018-08-07)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.5...v22.4.0)

**Fixed bugs:**

- Multiple dfn with the same name [\#1768](https://github.com/w3c/respec/issues/1768)

**Merged pull requests:**

- fix\(core/webidl\): only set pre id when needed [\#1796](https://github.com/w3c/respec/pull/1796) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/xref\): cache results [\#1758](https://github.com/w3c/respec/pull/1758) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(w3c/templates/sotd\): prefer github [\#1740](https://github.com/w3c/respec/pull/1740) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.3.5](https://github.com/w3c/respec/tree/v22.3.5) (2018-08-07)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.4...v22.3.5)

**Closed issues:**

- \<dfn\> for Gamepad is being ignored [\#1789](https://github.com/w3c/respec/issues/1789)

**Merged pull requests:**

- fix\(core/webidl\): find interface dfn in section [\#1792](https://github.com/w3c/respec/pull/1792) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/examples\): refactor and remove jQuery [\#1787](https://github.com/w3c/respec/pull/1787) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.3.4](https://github.com/w3c/respec/tree/v22.3.4) (2018-08-02)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.3...v22.3.4)

**Fixed bugs:**

- Language tags exposed in editor list company names [\#1786](https://github.com/w3c/respec/issues/1786)

**Closed issues:**

- Language markup showing in Editors list [\#1594](https://github.com/w3c/respec/issues/1594)

**Merged pull requests:**

- fix\(templates/show-people\): allow HTML for company field [\#1790](https://github.com/w3c/respec/pull/1790) ([saschanaz](https://github.com/saschanaz))

## [v22.3.3](https://github.com/w3c/respec/tree/v22.3.3) (2018-07-31)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.2...v22.3.3)

**Merged pull requests:**

-  refactor\(core/jquery-enhanced\): migrate $linkTargets to vanilla js [\#1785](https://github.com/w3c/respec/pull/1785) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor: remove `var` [\#1784](https://github.com/w3c/respec/pull/1784) ([saschanaz](https://github.com/saschanaz))
- refactor\(tests/spec/core/webidl-spec\): remove remaining jQuery [\#1783](https://github.com/w3c/respec/pull/1783) ([saschanaz](https://github.com/saschanaz))
- Lint tests [\#1782](https://github.com/w3c/respec/pull/1782) ([saschanaz](https://github.com/saschanaz))
- refactor: use const and arrow functions [\#1781](https://github.com/w3c/respec/pull/1781) ([saschanaz](https://github.com/saschanaz))
- refactor: use getElementById whenever possible [\#1780](https://github.com/w3c/respec/pull/1780) ([saschanaz](https://github.com/saschanaz))
- refactor: use await for makeRSDoc\(\) [\#1779](https://github.com/w3c/respec/pull/1779) ([saschanaz](https://github.com/saschanaz))
- fix\(karma.conf.js\): grep causes incorrect skips [\#1778](https://github.com/w3c/respec/pull/1778) ([saschanaz](https://github.com/saschanaz))
- Force eslint [\#1777](https://github.com/w3c/respec/pull/1777) ([saschanaz](https://github.com/saschanaz))
- fix\(core/idl\): linking attribute id/type with same name [\#1776](https://github.com/w3c/respec/pull/1776) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(tests/spec/core/webidl-spec\): remove jQuery from dict/enum tests [\#1775](https://github.com/w3c/respec/pull/1775) ([saschanaz](https://github.com/saschanaz))
- refactor\(tests/spec/core/webidl-spec\): remove jQuery from op/comment tests [\#1774](https://github.com/w3c/respec/pull/1774) ([saschanaz](https://github.com/saschanaz))
- refactor\(tests/spec/core/webidl-spec\): remove jQuery from ctor/const/attr tests [\#1773](https://github.com/w3c/respec/pull/1773) ([saschanaz](https://github.com/saschanaz))
- refactor\(tests/spec/core/webidl-spec\): remove jQuery from interface tests [\#1772](https://github.com/w3c/respec/pull/1772) ([saschanaz](https://github.com/saschanaz))

## [v22.3.2](https://github.com/w3c/respec/tree/v22.3.2) (2018-07-27)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.1...v22.3.2)

**Closed issues:**

- \[FEATURE REQUEST [\#1761](https://github.com/w3c/respec/issues/1761)

**Merged pull requests:**

- fix\(core/issues-notes\): don't remove closed issues [\#1771](https://github.com/w3c/respec/pull/1771) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): disable http cache for dev server [\#1770](https://github.com/w3c/respec/pull/1770) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor: remove domReady dependency [\#1767](https://github.com/w3c/respec/pull/1767) ([saschanaz](https://github.com/saschanaz))
- refactor\(core/webidl\): modernize run\(\) [\#1766](https://github.com/w3c/respec/pull/1766) ([saschanaz](https://github.com/saschanaz))
- docs\(example/starter\): Fix closing heading tag [\#1763](https://github.com/w3c/respec/pull/1763) ([HolgerPeters](https://github.com/HolgerPeters))
- Update fs-extra to the latest version 🚀 [\#1759](https://github.com/w3c/respec/pull/1759) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v22.3.1](https://github.com/w3c/respec/tree/v22.3.1) (2018-07-16)
[Full Changelog](https://github.com/w3c/respec/compare/v22.3.0...v22.3.1)

**Merged pull requests:**

- fix\(core/webidl\): unindentMarkup\(\) should work with space-only lines [\#1756](https://github.com/w3c/respec/pull/1756) ([saschanaz](https://github.com/saschanaz))
- fix\(core/xref\): explicit external dfn lookup [\#1755](https://github.com/w3c/respec/pull/1755) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.3.0](https://github.com/w3c/respec/tree/v22.3.0) (2018-07-12)
[Full Changelog](https://github.com/w3c/respec/compare/v22.2.1...v22.3.0)

**Closed issues:**

- IDL Index looks too condensed [\#1745](https://github.com/w3c/respec/issues/1745)
- Another somewhat unhelpful error [\#1742](https://github.com/w3c/respec/issues/1742)

**Merged pull requests:**

- feat\(core/xref\): add normative, informative references [\#1753](https://github.com/w3c/respec/pull/1753) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(core/xref\): use inline references to provide context [\#1751](https://github.com/w3c/respec/pull/1751) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/xref\): use context to disambiguate [\#1750](https://github.com/w3c/respec/pull/1750) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor\(core/webidl\): remove dead code, unjquery [\#1749](https://github.com/w3c/respec/pull/1749) ([marcoscaceres](https://github.com/marcoscaceres))
- Add spaces between IDL [\#1748](https://github.com/w3c/respec/pull/1748) ([saschanaz](https://github.com/saschanaz))
- refactor\(core/jquery-enhanced\): move getDfnTitles to vanilla js [\#1746](https://github.com/w3c/respec/pull/1746) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/webidl\): improve warning msg for operation [\#1744](https://github.com/w3c/respec/pull/1744) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(core/xref\): support data-lt attributes [\#1736](https://github.com/w3c/respec/pull/1736) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.2.1](https://github.com/w3c/respec/tree/v22.2.1) (2018-07-10)
[Full Changelog](https://github.com/w3c/respec/compare/v22.2.0...v22.2.1)

**Merged pull requests:**

- fix\(core/webidl\): include optional's trivia [\#1747](https://github.com/w3c/respec/pull/1747) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.2.0](https://github.com/w3c/respec/tree/v22.2.0) (2018-07-09)
[Full Changelog](https://github.com/w3c/respec/compare/v22.1.1...v22.2.0)

**Fixed bugs:**

- Two spaces between optional and identifier [\#1737](https://github.com/w3c/respec/issues/1737)

**Closed issues:**

- Prevent SpecRef request if there are no refs [\#1726](https://github.com/w3c/respec/issues/1726)
- WebIDL and data-dfn-for creates fragments with whitespace [\#1650](https://github.com/w3c/respec/issues/1650)
- Shepherd integration [\#1424](https://github.com/w3c/respec/issues/1424)

**Merged pull requests:**

- refactor\(core/pluralize\): separate pluralization from data-lt [\#1739](https://github.com/w3c/respec/pull/1739) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/webidl\): extra space between optional and identifier [\#1738](https://github.com/w3c/respec/pull/1738) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl\): normalize enum value ids [\#1735](https://github.com/w3c/respec/pull/1735) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/biblio\): prevent SpecRef request if there are no refs [\#1734](https://github.com/w3c/respec/pull/1734) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(core/xref\): support external dfn [\#1733](https://github.com/w3c/respec/pull/1733) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/xref\): use empty data-cite for local references [\#1732](https://github.com/w3c/respec/pull/1732) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.1.1](https://github.com/w3c/respec/tree/v22.1.1) (2018-07-03)
[Full Changelog](https://github.com/w3c/respec/compare/v22.1.0...v22.1.1)

**Fixed bugs:**

- Recent ReSpec update broke WebIDL parsing for WoT defintitions [\#1728](https://github.com/w3c/respec/issues/1728)

**Closed issues:**

- Ugly IDL errors [\#1674](https://github.com/w3c/respec/issues/1674)

**Merged pull requests:**

- fix\(core/link-to-dfn\): avoid xref warning if xref disabled [\#1731](https://github.com/w3c/respec/pull/1731) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/webidl\): improve display of errors [\#1730](https://github.com/w3c/respec/pull/1730) ([marcoscaceres](https://github.com/marcoscaceres))
- Update url-search-params to the latest version 🚀 [\#1729](https://github.com/w3c/respec/pull/1729) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v22.1.0](https://github.com/w3c/respec/tree/v22.1.0) (2018-07-02)
[Full Changelog](https://github.com/w3c/respec/compare/v22.0.1...v22.1.0)

**Closed issues:**

- W3C logo showing up in unofficial drafts?  [\#1725](https://github.com/w3c/respec/issues/1725)
- Add CSS for :target [\#1683](https://github.com/w3c/respec/issues/1683)

**Merged pull requests:**

- fix: allow multiple logos when unofficial [\#1727](https://github.com/w3c/respec/pull/1727) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/xref\): use data-cite to disambiguate [\#1723](https://github.com/w3c/respec/pull/1723) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/xref\): Improve error messages [\#1722](https://github.com/w3c/respec/pull/1722) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/link-to-dfn\): bad markdown [\#1721](https://github.com/w3c/respec/pull/1721) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/css/respec\): add :target highlight \#1683 [\#1720](https://github.com/w3c/respec/pull/1720) ([Jigar3](https://github.com/Jigar3))
- feat\(core/xref\): Add support for automatically linking external refs [\#1719](https://github.com/w3c/respec/pull/1719) ([sidvishnoi](https://github.com/sidvishnoi))

## [v22.0.1](https://github.com/w3c/respec/tree/v22.0.1) (2018-06-28)
[Full Changelog](https://github.com/w3c/respec/compare/v22.0.0...v22.0.1)

**Closed issues:**

- WebIDL rendering adds "\<span class='idlSectionComment'\>" to output [\#1717](https://github.com/w3c/respec/issues/1717)

**Merged pull requests:**

- fix\(core/webidl\): idl not rendering correctly [\#1718](https://github.com/w3c/respec/pull/1718) ([marcoscaceres](https://github.com/marcoscaceres))

## [v22.0.0](https://github.com/w3c/respec/tree/v22.0.0) (2018-06-26)
[Full Changelog](https://github.com/w3c/respec/compare/v21.3.0...v22.0.0)

**Merged pull requests:**

- BREAKING CHANGE: split biblio in pre-processing and rendering parts [\#1715](https://github.com/w3c/respec/pull/1715) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl\): prevent duplicated whitespace after comma [\#1714](https://github.com/w3c/respec/pull/1714) ([saschanaz](https://github.com/saschanaz))
-  refactor\(core/biblio\): split into pre-processing and rendering parts [\#1712](https://github.com/w3c/respec/pull/1712) ([sidvishnoi](https://github.com/sidvishnoi))
- Update eslint to the latest version 🚀 [\#1709](https://github.com/w3c/respec/pull/1709) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v21.3.0](https://github.com/w3c/respec/tree/v21.3.0) (2018-06-25)
[Full Changelog](https://github.com/w3c/respec/compare/v21.2.0...v21.3.0)

**Fixed bugs:**

- IDL writer doesn't support setlike\<\> [\#1705](https://github.com/w3c/respec/issues/1705)
- IDL writer doesn't support bodyless stringifier [\#1704](https://github.com/w3c/respec/issues/1704)

**Closed issues:**

- Anonymous IDL operations cause empty idlMethName spans [\#1707](https://github.com/w3c/respec/issues/1707)

**Merged pull requests:**

- Update to webidl2.js 14 [\#1710](https://github.com/w3c/respec/pull/1710) ([saschanaz](https://github.com/saschanaz))
- Support setlike and bodyless stringifier [\#1708](https://github.com/w3c/respec/pull/1708) ([saschanaz](https://github.com/saschanaz))

## [v21.2.0](https://github.com/w3c/respec/tree/v21.2.0) (2018-06-20)
[Full Changelog](https://github.com/w3c/respec/compare/v21.1.0...v21.2.0)

**Merged pull requests:**

- feat\(core/biblio-db\): add clear database method [\#1706](https://github.com/w3c/respec/pull/1706) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/biblio\): normalize references [\#1703](https://github.com/w3c/respec/pull/1703) ([sidvishnoi](https://github.com/sidvishnoi))

## [v21.1.0](https://github.com/w3c/respec/tree/v21.1.0) (2018-06-19)
[Full Changelog](https://github.com/w3c/respec/compare/v21.0.2...v21.1.0)

**Closed issues:**

- Large images appear stretched [\#1678](https://github.com/w3c/respec/issues/1678)
- auto normalize references [\#1535](https://github.com/w3c/respec/issues/1535)
- Warn when href points to undefined id [\#1318](https://github.com/w3c/respec/issues/1318)
- caniuse integration  [\#1238](https://github.com/w3c/respec/issues/1238)

**Merged pull requests:**

- refactor\(core/jquery-enhanced\): migrate $.allTextNodes to vanilla js [\#1698](https://github.com/w3c/respec/pull/1698) ([sidvishnoi](https://github.com/sidvishnoi))
- chore\(package.json\) update dependencies [\#1697](https://github.com/w3c/respec/pull/1697) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(w3c/defaults\): enable local-refs-exist lint rule [\#1696](https://github.com/w3c/respec/pull/1696) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(w3c/defaults\): enable highlightVars [\#1695](https://github.com/w3c/respec/pull/1695) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/biblio\):  auto normalize references [\#1692](https://github.com/w3c/respec/pull/1692) ([sidvishnoi](https://github.com/sidvishnoi))
- refactor\(core/biblio\): replace jQuery with hyperHTML [\#1691](https://github.com/w3c/respec/pull/1691) ([sidvishnoi](https://github.com/sidvishnoi))

## [v21.0.2](https://github.com/w3c/respec/tree/v21.0.2) (2018-06-06)
[Full Changelog](https://github.com/w3c/respec/compare/v21.0.1...v21.0.2)

**Merged pull requests:**

- perf: dont create arrays unnecessarily [\#1690](https://github.com/w3c/respec/pull/1690) ([marcoscaceres](https://github.com/marcoscaceres))
- perf\(core/location-hash\): avoid recalculating styles [\#1689](https://github.com/w3c/respec/pull/1689) ([marcoscaceres](https://github.com/marcoscaceres))
- Add a period and space to unlinked references [\#1688](https://github.com/w3c/respec/pull/1688) ([michael-n-cooper](https://github.com/michael-n-cooper))
- fix\(w3c/defaults\): allow lint rules override [\#1687](https://github.com/w3c/respec/pull/1687) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(core/dfn\): improve backwards compat [\#1686](https://github.com/w3c/respec/pull/1686) ([sidvishnoi](https://github.com/sidvishnoi))

## [v21.0.1](https://github.com/w3c/respec/tree/v21.0.1) (2018-05-29)
[Full Changelog](https://github.com/w3c/respec/compare/v21.0.0...v21.0.1)

**Merged pull requests:**

- perf\(core/location-hash\) improve performance [\#1685](https://github.com/w3c/respec/pull/1685) ([sidvishnoi](https://github.com/sidvishnoi))

## [v21.0.0](https://github.com/w3c/respec/tree/v21.0.0) (2018-05-29)
[Full Changelog](https://github.com/w3c/respec/compare/v20.11.2...v21.0.0)

**Closed issues:**

- Investigate automatic pluralization of defined terms [\#1351](https://github.com/w3c/respec/issues/1351)
- Investigate switching MD parser  to Remarkable [\#1207](https://github.com/w3c/respec/issues/1207)

**Merged pull requests:**

- feat\(core/dfn\): add automatic pluralization support for \<dfn\> [\#1682](https://github.com/w3c/respec/pull/1682) ([sidvishnoi](https://github.com/sidvishnoi))
- BREAKING CHANGE: Remove deprecated things [\#1681](https://github.com/w3c/respec/pull/1681) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.11.2](https://github.com/w3c/respec/tree/v20.11.2) (2018-05-25)
[Full Changelog](https://github.com/w3c/respec/compare/v20.11.1...v20.11.2)

**Closed issues:**

- Nothing really checks config.format for markdown processing [\#1679](https://github.com/w3c/respec/issues/1679)

**Merged pull requests:**

- fix\(package\): update marked to version 0.4.0 [\#1680](https://github.com/w3c/respec/pull/1680) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.11.1](https://github.com/w3c/respec/tree/v20.11.1) (2018-05-15)
[Full Changelog](https://github.com/w3c/respec/compare/v20.11.0...v20.11.1)

**Fixed bugs:**

- link-to-dfn module may report a TypeError [\#1666](https://github.com/w3c/respec/issues/1666)

**Merged pull requests:**

- fix: link-to-dfn module may report a TypeError [\#1673](https://github.com/w3c/respec/pull/1673) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(tools/respecDocWriter\): support Puppeteer 1.4 error reporting [\#1671](https://github.com/w3c/respec/pull/1671) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.11.0](https://github.com/w3c/respec/tree/v20.11.0) (2018-05-14)
[Full Changelog](https://github.com/w3c/respec/compare/v20.10.4...v20.11.0)

**Closed issues:**

- "stod" typo in src/w3c/headers.js? [\#1656](https://github.com/w3c/respec/issues/1656)
- Warn about href's that link to nonexistent id's [\#1643](https://github.com/w3c/respec/issues/1643)

**Merged pull requests:**

- Fix temp ID syntax in list sorter [\#1665](https://github.com/w3c/respec/pull/1665) ([tidoust](https://github.com/tidoust))
- \(feat/lint\) Warns about href's that link to nonexistent id's in a spec [\#1664](https://github.com/w3c/respec/pull/1664) ([sidvishnoi](https://github.com/sidvishnoi))
- Update var highlight colors [\#1663](https://github.com/w3c/respec/pull/1663) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(w3c/headers\): typo [\#1659](https://github.com/w3c/respec/pull/1659) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(headers-spec\): variable name typo [\#1658](https://github.com/w3c/respec/pull/1658) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix caniuse hover show/hide [\#1657](https://github.com/w3c/respec/pull/1657) ([sidvishnoi](https://github.com/sidvishnoi))

## [v20.10.4](https://github.com/w3c/respec/tree/v20.10.4) (2018-05-08)
[Full Changelog](https://github.com/w3c/respec/compare/v20.10.3...v20.10.4)

**Merged pull requests:**

- fix\(tools/respecDocWriter\): reject on require load errors [\#1654](https://github.com/w3c/respec/pull/1654) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.10.3](https://github.com/w3c/respec/tree/v20.10.3) (2018-05-07)
[Full Changelog](https://github.com/w3c/respec/compare/v20.10.2...v20.10.3)

**Closed issues:**

- Harmonizing var highlight colors with BikeShed [\#1649](https://github.com/w3c/respec/issues/1649)

**Merged pull requests:**

- Make RespecDocWriter work with older versions of ReSpec [\#1652](https://github.com/w3c/respec/pull/1652) ([tidoust](https://github.com/tidoust))

## [v20.10.2](https://github.com/w3c/respec/tree/v20.10.2) (2018-05-04)
[Full Changelog](https://github.com/w3c/respec/compare/v20.10.1...v20.10.2)

**Merged pull requests:**

- sec\(tools/respecDocWriter\): dont show URL params [\#1651](https://github.com/w3c/respec/pull/1651) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.10.1](https://github.com/w3c/respec/tree/v20.10.1) (2018-05-02)
[Full Changelog](https://github.com/w3c/respec/compare/v20.10.0...v20.10.1)

**Merged pull requests:**

- fix\(tools/respecDocWriter\): output data, not dataURL [\#1648](https://github.com/w3c/respec/pull/1648) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.10.0](https://github.com/w3c/respec/tree/v20.10.0) (2018-05-02)
[Full Changelog](https://github.com/w3c/respec/compare/v20.9.0...v20.10.0)

**Closed issues:**

- Missing js/deps/require.js? [\#1639](https://github.com/w3c/respec/issues/1639)
- Implementation report not required for REC [\#1632](https://github.com/w3c/respec/issues/1632)
- Update templates to point to new web-platform-tests location after move [\#1621](https://github.com/w3c/respec/issues/1621)
- caniuse should export as "caniuse.com" [\#1618](https://github.com/w3c/respec/issues/1618)
- caniuse layout and click issues on mobile  [\#1614](https://github.com/w3c/respec/issues/1614)
- punctuation checker not working correctly [\#1605](https://github.com/w3c/respec/issues/1605)
- Highlight variable matching in algorithm [\#1529](https://github.com/w3c/respec/issues/1529)
- previousURI is untested [\#826](https://github.com/w3c/respec/issues/826)

**Merged pull requests:**

- Update fs-extra to the latest version 🚀 [\#1646](https://github.com/w3c/respec/pull/1646) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Remove irrelevant config for caniuse feature [\#1645](https://github.com/w3c/respec/pull/1645) ([sidvishnoi](https://github.com/sidvishnoi))
- chore\(tests\): use eslint-plugin-jasmine [\#1644](https://github.com/w3c/respec/pull/1644) ([marcoscaceres](https://github.com/marcoscaceres))
- Refactor save html [\#1641](https://github.com/w3c/respec/pull/1641) ([sidvishnoi](https://github.com/sidvishnoi))
- Remove IDL legacy things [\#1638](https://github.com/w3c/respec/pull/1638) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(w3c/headers\): implementationReportURI CR only [\#1634](https://github.com/w3c/respec/pull/1634) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix: caniuse layout and click issues on mobile [\#1627](https://github.com/w3c/respec/pull/1627) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(w3c/headers\): warn about old WPT URL [\#1622](https://github.com/w3c/respec/pull/1622) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/caniuse\): export as "caniuse.com" [\#1619](https://github.com/w3c/respec/pull/1619) ([sidvishnoi](https://github.com/sidvishnoi))
- feat\(core/linter-rules/punctuation\): Log offending elements [\#1617](https://github.com/w3c/respec/pull/1617) ([shikhar-scs](https://github.com/shikhar-scs))
- feat\(core/highlight-vars\): highlight vars in algos [\#1588](https://github.com/w3c/respec/pull/1588) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.9.0](https://github.com/w3c/respec/tree/v20.9.0) (2018-04-26)
[Full Changelog](https://github.com/w3c/respec/compare/v20.8.0...v20.9.0)

## [v20.8.0](https://github.com/w3c/respec/tree/v20.8.0) (2018-04-25)
[Full Changelog](https://github.com/w3c/respec/compare/v20.7.2...v20.8.0)

**Implemented enhancements:**

- Add natural width and height to images [\#923](https://github.com/w3c/respec/issues/923)

**Fixed bugs:**

- don't create a new id when an issue is referenced more than once [\#1626](https://github.com/w3c/respec/issues/1626)

**Closed issues:**

- Investigate bug related to duplicate issue ids [\#1342](https://github.com/w3c/respec/issues/1342)

**Merged pull requests:**

- feat\(core/utils\): add flatten\(\) util [\#1633](https://github.com/w3c/respec/pull/1633) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: support personal github tokens for testing [\#1630](https://github.com/w3c/respec/pull/1630) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/issue-notes\): give issues a unique ID [\#1629](https://github.com/w3c/respec/pull/1629) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/images\): add natural width and height to images\(\#923\) [\#1616](https://github.com/w3c/respec/pull/1616) ([himanish-star](https://github.com/himanish-star))

## [v20.7.2](https://github.com/w3c/respec/tree/v20.7.2) (2018-04-17)
[Full Changelog](https://github.com/w3c/respec/compare/v20.7.1...v20.7.2)

**Fixed bugs:**

- Perma Link refers to \#undefined for the document [\#1445](https://github.com/w3c/respec/issues/1445)

**Merged pull requests:**

- chore\(package\): update dev deps [\#1623](https://github.com/w3c/respec/pull/1623) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.7.1](https://github.com/w3c/respec/tree/v20.7.1) (2018-04-06)
[Full Changelog](https://github.com/w3c/respec/compare/v20.7.0...v20.7.1)

**Fixed bugs:**

- The document license cannot be limited to the W3C Document License [\#1598](https://github.com/w3c/respec/issues/1598)

**Merged pull requests:**

- fix\(w3c/headers\): allow restrictive w3c license [\#1604](https://github.com/w3c/respec/pull/1604) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.7.0](https://github.com/w3c/respec/tree/v20.7.0) (2018-04-05)
[Full Changelog](https://github.com/w3c/respec/compare/v20.6.0...v20.7.0)

**Merged pull requests:**

- feat\(core/caniuse\): Add caniuse integration \#1238 [\#1555](https://github.com/w3c/respec/pull/1555) ([sidvishnoi](https://github.com/sidvishnoi))

## [v20.6.0](https://github.com/w3c/respec/tree/v20.6.0) (2018-04-04)
[Full Changelog](https://github.com/w3c/respec/compare/v20.5.1...v20.6.0)

**Closed issues:**

- Canonical URL not updated with anchor-navigation [\#1609](https://github.com/w3c/respec/issues/1609)
- respec2html error is always `😱 ReSpec error: JSHandle@error` [\#1606](https://github.com/w3c/respec/issues/1606)

**Merged pull requests:**

- Fix a couple of small bugs.  [\#1613](https://github.com/w3c/respec/pull/1613) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/base-runner\): extend plugin life [\#1612](https://github.com/w3c/respec/pull/1612) ([marcoscaceres](https://github.com/marcoscaceres))
- test\(headless\): reduce tested specs [\#1608](https://github.com/w3c/respec/pull/1608) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(tools/respecDocWriter\): stringify JSHandle objects from console [\#1607](https://github.com/w3c/respec/pull/1607) ([saschanaz](https://github.com/saschanaz))
- feat\(core/utils\): Utils fetch and cache [\#1602](https://github.com/w3c/respec/pull/1602) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/issues-notes\): show github labels [\#1583](https://github.com/w3c/respec/pull/1583) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.5.1](https://github.com/w3c/respec/tree/v20.5.1) (2018-04-03)
[Full Changelog](https://github.com/w3c/respec/compare/v20.5.0...v20.5.1)

**Merged pull requests:**

- fix\(show-people\): treat name as HTML [\#1595](https://github.com/w3c/respec/pull/1595) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.5.0](https://github.com/w3c/respec/tree/v20.5.0) (2018-04-03)
[Full Changelog](https://github.com/w3c/respec/compare/v20.4.2...v20.5.0)

**Merged pull requests:**

- feat: punctuation checker for paragraphs [\#1589](https://github.com/w3c/respec/pull/1589) ([shikhar-scs](https://github.com/shikhar-scs))

## [v20.4.2](https://github.com/w3c/respec/tree/v20.4.2) (2018-04-03)
[Full Changelog](https://github.com/w3c/respec/compare/v20.4.1...v20.4.2)

**Fixed bugs:**

- Figure references [\#878](https://github.com/w3c/respec/issues/878)

**Merged pull requests:**

- fix\(w3c/headers\): head items should be lcase [\#1603](https://github.com/w3c/respec/pull/1603) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.4.1](https://github.com/w3c/respec/tree/v20.4.1) (2018-04-02)
[Full Changelog](https://github.com/w3c/respec/compare/v20.4.0...v20.4.1)

**Fixed bugs:**

- IDL stringifier is causing RangeError [\#1599](https://github.com/w3c/respec/issues/1599)
- RangeError: Invalid count value exception in idn\(\) [\#1559](https://github.com/w3c/respec/issues/1559)

**Merged pull requests:**

- fix\(core/webidl\): dont warn about nameless ops [\#1601](https://github.com/w3c/respec/pull/1601) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl\): indent stringifiers [\#1600](https://github.com/w3c/respec/pull/1600) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(pacakge\): npm start builds components [\#1581](https://github.com/w3c/respec/pull/1581) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.4.0](https://github.com/w3c/respec/tree/v20.4.0) (2018-03-29)
[Full Changelog](https://github.com/w3c/respec/compare/v20.3.0...v20.4.0)

**Fixed bugs:**

- Allow for figure references not to include the whole caption [\#879](https://github.com/w3c/respec/issues/879)

**Merged pull requests:**

- feat\(core/figures\): anchor link texts to be shortened [\#1593](https://github.com/w3c/respec/pull/1593) ([himanish-star](https://github.com/himanish-star))

## [v20.3.0](https://github.com/w3c/respec/tree/v20.3.0) (2018-03-28)
[Full Changelog](https://github.com/w3c/respec/compare/v20.2.2...v20.3.0)

**Merged pull requests:**

- Remove @@@ from sotd [\#1584](https://github.com/w3c/respec/pull/1584) ([OrionStar25](https://github.com/OrionStar25))

## [v20.2.2](https://github.com/w3c/respec/tree/v20.2.2) (2018-03-27)
[Full Changelog](https://github.com/w3c/respec/compare/v20.2.1...v20.2.2)

**Closed issues:**

- Missing whitespace in headers between status and date [\#1590](https://github.com/w3c/respec/issues/1590)
- Script fails on IE11 with `SCRIPT1010: Expected identifier` [\#1585](https://github.com/w3c/respec/issues/1585)
- Support different bibliographical styles [\#857](https://github.com/w3c/respec/issues/857)

**Merged pull requests:**

- fix: restore whitespace between status and date [\#1591](https://github.com/w3c/respec/pull/1591) ([deniak](https://github.com/deniak))

## [v20.2.1](https://github.com/w3c/respec/tree/v20.2.1) (2018-03-21)
[Full Changelog](https://github.com/w3c/respec/compare/v20.2.0...v20.2.1)

**Closed issues:**

- META: Google Summer of Code 2018 [\#1502](https://github.com/w3c/respec/issues/1502)

## [v20.2.0](https://github.com/w3c/respec/tree/v20.2.0) (2018-03-21)
[Full Changelog](https://github.com/w3c/respec/compare/v20.1.1...v20.2.0)

**Implemented enhancements:**

- Show labels from github [\#674](https://github.com/w3c/respec/issues/674)

**Merged pull requests:**

- feat: show github issue's labels [\#1571](https://github.com/w3c/respec/pull/1571) ([himanish-star](https://github.com/himanish-star))

## [v20.1.1](https://github.com/w3c/respec/tree/v20.1.1) (2018-03-20)
[Full Changelog](https://github.com/w3c/respec/compare/v20.1.0...v20.1.1)

**Fixed bugs:**

- Parsing xml in markdown gives lower case tags [\#1573](https://github.com/w3c/respec/issues/1573)

**Merged pull requests:**

- fix\(w3c/templates/headers\): doc.title must match conf.title [\#1579](https://github.com/w3c/respec/pull/1579) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.1.0](https://github.com/w3c/respec/tree/v20.1.0) (2018-03-19)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.5...v20.1.0)

**Implemented enhancements:**

- Add support for former editors [\#1097](https://github.com/w3c/respec/issues/1097)

**Fixed bugs:**

- problems generating h1 from title [\#460](https://github.com/w3c/respec/issues/460)

**Closed issues:**

- Allow makeStandardOps\(\) to take overrides [\#1576](https://github.com/w3c/respec/issues/1576)
- Extended attribute on types in union [\#1574](https://github.com/w3c/respec/issues/1574)
- &lt; in server-timing description [\#1568](https://github.com/w3c/respec/issues/1568)

**Merged pull requests:**

- fix\(core/webidl\): support extended attributes for IDL types [\#1578](https://github.com/w3c/respec/pull/1578) ([saschanaz](https://github.com/saschanaz))
- Allow makeStandardOps\(\) to take overrides: Fixes \#1576 [\#1577](https://github.com/w3c/respec/pull/1577) ([shikhar-scs](https://github.com/shikhar-scs))
- Add support for former editors [\#1551](https://github.com/w3c/respec/pull/1551) ([sidvishnoi](https://github.com/sidvishnoi))
- fix\(w3c/templates/headers\): use \<h1\> exists for title \(fixes \#460\) [\#1516](https://github.com/w3c/respec/pull/1516) ([shikhar-scs](https://github.com/shikhar-scs))

## [v20.0.5](https://github.com/w3c/respec/tree/v20.0.5) (2018-03-14)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.4...v20.0.5)

**Fixed bugs:**

- Issues that are closed shouldn't show up in the spec [\#670](https://github.com/w3c/respec/issues/670)

**Closed issues:**

- Configure Jasmine to not run in random [\#1552](https://github.com/w3c/respec/issues/1552)

**Merged pull requests:**

- fix\(core/issues-notes\): closed issue should be removed from spec [\#1570](https://github.com/w3c/respec/pull/1570) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(package\): update command-line-usage to version 5.0.2 [\#1569](https://github.com/w3c/respec/pull/1569) ([saschanaz](https://github.com/saschanaz))

## [v20.0.4](https://github.com/w3c/respec/tree/v20.0.4) (2018-03-10)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.3...v20.0.4)

**Implemented enhancements:**

- Test process version [\#1128](https://github.com/w3c/respec/issues/1128)

**Fixed bugs:**

- Back to Top button doesn't work [\#1545](https://github.com/w3c/respec/issues/1545)

**Closed issues:**

- THIS IS A TEST ISSUE [\#1548](https://github.com/w3c/respec/issues/1548)
- Regression: release.js exits with ERR\_FILE\_NOT\_FOUND [\#1547](https://github.com/w3c/respec/issues/1547)
- seo and jsonld modules should be merged [\#1536](https://github.com/w3c/respec/issues/1536)

**Merged pull requests:**

- fix\(core/webidl\): pad static methods [\#1566](https://github.com/w3c/respec/pull/1566) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update deps [\#1564](https://github.com/w3c/respec/pull/1564) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/issues-notes\): use async/await + simplify [\#1560](https://github.com/w3c/respec/pull/1560) ([goelrohan6](https://github.com/goelrohan6))
- chore\(package\): build, then start server [\#1558](https://github.com/w3c/respec/pull/1558) ([marcoscaceres](https://github.com/marcoscaceres))
- Merged seo and jsonld modules [\#1556](https://github.com/w3c/respec/pull/1556) ([goelrohan6](https://github.com/goelrohan6))
- refactor\(w3c/informative\): remove jQuery [\#1553](https://github.com/w3c/respec/pull/1553) ([saschanaz](https://github.com/saschanaz))
- Link back to top to title of spec [\#1550](https://github.com/w3c/respec/pull/1550) ([OrionStar25](https://github.com/OrionStar25))
- refactor\(core/inlines\): use ES2015+/remove jQuery [\#1549](https://github.com/w3c/respec/pull/1549) ([saschanaz](https://github.com/saschanaz))
- Update clipboard to the latest version 🚀 [\#1542](https://github.com/w3c/respec/pull/1542) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v20.0.3](https://github.com/w3c/respec/tree/v20.0.3) (2018-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.2...v20.0.3)

**Closed issues:**

- Github and edDraftURI [\#1223](https://github.com/w3c/respec/issues/1223)
- Support linking to external xrefs [\#332](https://github.com/w3c/respec/issues/332)

**Merged pull requests:**

- fix: remove core/aria module [\#1544](https://github.com/w3c/respec/pull/1544) ([saschanaz](https://github.com/saschanaz))
- refactor\(core/best-practices\): replace jQuery [\#1541](https://github.com/w3c/respec/pull/1541) ([saschanaz](https://github.com/saschanaz))

## [v20.0.2](https://github.com/w3c/respec/tree/v20.0.2) (2018-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.1...v20.0.2)

**Fixed bugs:**

- Respec can't check local source files anymore [\#1522](https://github.com/w3c/respec/issues/1522)

**Merged pull requests:**

- chore\(package\): update deps [\#1540](https://github.com/w3c/respec/pull/1540) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(tools/release, tools/respecDocWriter\): use double quotes [\#1539](https://github.com/w3c/respec/pull/1539) ([saschanaz](https://github.com/saschanaz))
- refactor\(core/contrib\): use ES2015+ [\#1538](https://github.com/w3c/respec/pull/1538) ([saschanaz](https://github.com/saschanaz))
- fix\(tools/respecDocWriter\): allow local file requests [\#1537](https://github.com/w3c/respec/pull/1537) ([saschanaz](https://github.com/saschanaz))

## [v20.0.1](https://github.com/w3c/respec/tree/v20.0.1) (2018-02-23)
[Full Changelog](https://github.com/w3c/respec/compare/v20.0.0...v20.0.1)

**Merged pull requests:**

- chore\(deps\): update hyperhtml [\#1531](https://github.com/w3c/respec/pull/1531) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(w3c/jsonld\): make async, used description [\#1528](https://github.com/w3c/respec/pull/1528) ([marcoscaceres](https://github.com/marcoscaceres))
- jsonld uses undefined "xsd" namespace [\#1527](https://github.com/w3c/respec/pull/1527) ([gkellogg](https://github.com/gkellogg))
- fix\(tools/respec2html\): resolve src to file URL [\#1524](https://github.com/w3c/respec/pull/1524) ([marcoscaceres](https://github.com/marcoscaceres))

## [v20.0.0](https://github.com/w3c/respec/tree/v20.0.0) (2018-02-22)
[Full Changelog](https://github.com/w3c/respec/compare/v19.6.0...v20.0.0)

**Closed issues:**

- Typos in the Developer's Guide  [\#1512](https://github.com/w3c/respec/issues/1512)

**Merged pull requests:**

- BREAKING CHANGE: Remove RDFa support. [\#1526](https://github.com/w3c/respec/pull/1526) ([gkellogg](https://github.com/gkellogg))
- refactor\(w3c/headers\): use w3c defaults [\#1525](https://github.com/w3c/respec/pull/1525) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): updates puppeteer + marked [\#1523](https://github.com/w3c/respec/pull/1523) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(.gitignore\): use globs [\#1518](https://github.com/w3c/respec/pull/1518) ([saschanaz](https://github.com/saschanaz))
- JSON-LD SEO support [\#1517](https://github.com/w3c/respec/pull/1517) ([gkellogg](https://github.com/gkellogg))
- Update RDFa support [\#1515](https://github.com/w3c/respec/pull/1515) ([gkellogg](https://github.com/gkellogg))
- Convert headers/sotd templates into hyperHTML [\#1514](https://github.com/w3c/respec/pull/1514) ([saschanaz](https://github.com/saschanaz))
- refactor: small syntax changes and hyperHTML [\#1511](https://github.com/w3c/respec/pull/1511) ([saschanaz](https://github.com/saschanaz))

## [v19.6.0](https://github.com/w3c/respec/tree/v19.6.0) (2018-02-15)
[Full Changelog](https://github.com/w3c/respec/compare/v19.5.0...v19.6.0)

**Closed issues:**

- 💅-up linked tests   [\#1374](https://github.com/w3c/respec/issues/1374)

**Merged pull requests:**

- prettify linked tests : Fixes \#1374 [\#1487](https://github.com/w3c/respec/pull/1487) ([shikhar-scs](https://github.com/shikhar-scs))

## [v19.5.0](https://github.com/w3c/respec/tree/v19.5.0) (2018-02-15)
[Full Changelog](https://github.com/w3c/respec/compare/v19.4.0...v19.5.0)

**Merged pull requests:**

- fix: re-add sudo required [\#1509](https://github.com/w3c/respec/pull/1509) ([saschanaz](https://github.com/saschanaz))
- feat\(w3c\): remove processVersion option [\#1480](https://github.com/w3c/respec/pull/1480) ([marcoscaceres](https://github.com/marcoscaceres))

## [v19.4.0](https://github.com/w3c/respec/tree/v19.4.0) (2018-02-14)
[Full Changelog](https://github.com/w3c/respec/compare/v19.3.0...v19.4.0)

**Implemented enhancements:**

- Switch to some other packaging system [\#1129](https://github.com/w3c/respec/issues/1129)

**Closed issues:**

- Link to duplicate definition [\#1427](https://github.com/w3c/respec/issues/1427)

**Merged pull requests:**

- Link to duplicate dfns [\#1477](https://github.com/w3c/respec/pull/1477) ([himanish-star](https://github.com/himanish-star))

## [v19.3.0](https://github.com/w3c/respec/tree/v19.3.0) (2018-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v19.2.2...v19.3.0)

**Fixed bugs:**

- Missing things in IDL index [\#1479](https://github.com/w3c/respec/issues/1479)

**Merged pull requests:**

- feat: support --disable-sandbox on respec2html [\#1504](https://github.com/w3c/respec/pull/1504) ([saschanaz](https://github.com/saschanaz))

## [v19.2.2](https://github.com/w3c/respec/tree/v19.2.2) (2018-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v19.2.1...v19.2.2)

**Merged pull requests:**

- fix\(core/webidl-index\): support multiple idl blocks [\#1497](https://github.com/w3c/respec/pull/1497) ([shubhshrma](https://github.com/shubhshrma))

## [v19.2.1](https://github.com/w3c/respec/tree/v19.2.1) (2018-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v19.2.0...v19.2.1)

**Fixed bugs:**

- No longer possible to override W3C logo in an official document? [\#1392](https://github.com/w3c/respec/issues/1392)

**Closed issues:**

- Releasing to another branch [\#820](https://github.com/w3c/respec/issues/820)

**Merged pull requests:**

- fix: add all logos in the first p element  [\#1492](https://github.com/w3c/respec/pull/1492) ([saschanaz](https://github.com/saschanaz))

## [v19.2.0](https://github.com/w3c/respec/tree/v19.2.0) (2018-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v19.1.1...v19.2.0)

**Closed issues:**

- SOTD still points to 1 March 2017 W3C Process Document [\#1485](https://github.com/w3c/respec/issues/1485)
- CI fails with a message `{}` [\#1476](https://github.com/w3c/respec/issues/1476)
- 19.1.0 doesn't seem to support interface mixins [\#1475](https://github.com/w3c/respec/issues/1475)
- Forked repositories cannot run karma tests on Travis? [\#1462](https://github.com/w3c/respec/issues/1462)
- marked stripping "\*" from pre [\#1389](https://github.com/w3c/respec/issues/1389)
- Github links should include link to pull requests [\#1373](https://github.com/w3c/respec/issues/1373)
- Add missing aria-spec [\#906](https://github.com/w3c/respec/issues/906)
- Better handling for when specref goes down [\#828](https://github.com/w3c/respec/issues/828)

**Merged pull requests:**

- fix\(tools/release\): use build:components instead [\#1501](https://github.com/w3c/respec/pull/1501) ([marcoscaceres](https://github.com/marcoscaceres))
- docs\(examples\): use github config option [\#1500](https://github.com/w3c/respec/pull/1500) ([marcoscaceres](https://github.com/marcoscaceres))
- fix: ping SpecRef in ordering-safe way  [\#1499](https://github.com/w3c/respec/pull/1499) ([saschanaz](https://github.com/saschanaz))
- chore: update dependencies [\#1498](https://github.com/w3c/respec/pull/1498) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor: remove WebIDL array support  [\#1496](https://github.com/w3c/respec/pull/1496) ([saschanaz](https://github.com/saschanaz))
- fix: prevent unordered tests from conflicting [\#1495](https://github.com/w3c/respec/pull/1495) ([saschanaz](https://github.com/saschanaz))
- Github links should include link to pull requests \#1373 [\#1491](https://github.com/w3c/respec/pull/1491) ([OrionStar25](https://github.com/OrionStar25))
- Skip detectBrowsers when explicitly passing browsers [\#1490](https://github.com/w3c/respec/pull/1490) ([saschanaz](https://github.com/saschanaz))
- refactor: use node.js api rather than unix commands  [\#1488](https://github.com/w3c/respec/pull/1488) ([saschanaz](https://github.com/saschanaz))
- refactor: use puppeteer instead of nightmare [\#1483](https://github.com/w3c/respec/pull/1483) ([saschanaz](https://github.com/saschanaz))
- Update jasmine-core to the latest version 🚀 [\#1481](https://github.com/w3c/respec/pull/1481) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- workaround: use sudo required on travis [\#1478](https://github.com/w3c/respec/pull/1478) ([saschanaz](https://github.com/saschanaz))

## [v19.1.1](https://github.com/w3c/respec/tree/v19.1.1) (2018-02-06)
[Full Changelog](https://github.com/w3c/respec/compare/v19.1.0...v19.1.1)

## [v19.1.0](https://github.com/w3c/respec/tree/v19.1.0) (2018-02-05)
[Full Changelog](https://github.com/w3c/respec/compare/v19.0.2...v19.1.0)

**Implemented enhancements:**

- Add support for WebIDL mixins [\#1423](https://github.com/w3c/respec/issues/1423)
- New link to the Process 2018 [\#1466](https://github.com/w3c/respec/pull/1466) ([plehegar](https://github.com/plehegar))

**Closed issues:**

- Test failure: 'root' is deprecated, use 'global' [\#1458](https://github.com/w3c/respec/issues/1458)

**Merged pull requests:**

- chore\(package\): use uglify-es 3.3.7 [\#1474](https://github.com/w3c/respec/pull/1474) ([saschanaz](https://github.com/saschanaz))
- Fix a typo in src/w3c/headers.js [\#1472](https://github.com/w3c/respec/pull/1472) ([xfq](https://github.com/xfq))
- Migrate to ES2017 async functions [\#1471](https://github.com/w3c/respec/pull/1471) ([saschanaz](https://github.com/saschanaz))
- feat: support interface mixins [\#1468](https://github.com/w3c/respec/pull/1468) ([saschanaz](https://github.com/saschanaz))
- chore\(package\): update webidl2.js to version 10.2.0 [\#1465](https://github.com/w3c/respec/pull/1465) ([saschanaz](https://github.com/saschanaz))
- workaround: add git commit hash [\#1464](https://github.com/w3c/respec/pull/1464) ([saschanaz](https://github.com/saschanaz))
- fix: roll back to uglify-es 3.2.2 [\#1461](https://github.com/w3c/respec/pull/1461) ([saschanaz](https://github.com/saschanaz))
- Fix Nightmare API use [\#1460](https://github.com/w3c/respec/pull/1460) ([saschanaz](https://github.com/saschanaz))

## [v19.0.2](https://github.com/w3c/respec/tree/v19.0.2) (2018-01-30)
[Full Changelog](https://github.com/w3c/respec/compare/v19.0.1...v19.0.2)

**Implemented enhancements:**

- Replace jQuery for slim [\#773](https://github.com/w3c/respec/issues/773)

**Fixed bugs:**

- Code samples should not be set to aria-live="polite" after core/highlight executes [\#1456](https://github.com/w3c/respec/issues/1456)
- Snapshot menu not working on Firefox 57? [\#1440](https://github.com/w3c/respec/issues/1440)

**Closed issues:**

- viewing fails on Safari Version 10.1.2 \(10603.3.8\) [\#1453](https://github.com/w3c/respec/issues/1453)
- "Save as HTML" is missing from the Respec menu [\#1450](https://github.com/w3c/respec/issues/1450)

**Merged pull requests:**

- fix: dont announce highlights \(closes \#1456\) [\#1457](https://github.com/w3c/respec/pull/1457) ([marcoscaceres](https://github.com/marcoscaceres))
- Update mocha to the latest version 🚀 [\#1455](https://github.com/w3c/respec/pull/1455) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update command-line-args to the latest version 🚀 [\#1454](https://github.com/w3c/respec/pull/1454) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Update http-server to the latest version 🚀 [\#1452](https://github.com/w3c/respec/pull/1452) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- Cleanup various things [\#1451](https://github.com/w3c/respec/pull/1451) ([marcoscaceres](https://github.com/marcoscaceres))
- Update karma to the latest version 🚀 [\#1449](https://github.com/w3c/respec/pull/1449) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))

## [v19.0.1](https://github.com/w3c/respec/tree/v19.0.1) (2017-12-19)
[Full Changelog](https://github.com/w3c/respec/compare/v19.0.0...v19.0.1)

**Merged pull requests:**

- fix\(core/github\): bad URL for fetching issues [\#1447](https://github.com/w3c/respec/pull/1447) ([marcoscaceres](https://github.com/marcoscaceres))

## [v19.0.0](https://github.com/w3c/respec/tree/v19.0.0) (2017-12-19)
[Full Changelog](https://github.com/w3c/respec/compare/v18.3.0...v19.0.0)

**Implemented enhancements:**

- Upcoming update to WG notes patent policy text [\#1443](https://github.com/w3c/respec/issues/1443)

**Closed issues:**

- Specref updating is either too infrequent or partially broken [\#1441](https://github.com/w3c/respec/issues/1441)
- Serve save-html.js with a javascript mime type [\#1439](https://github.com/w3c/respec/issues/1439)
- Sort lists [\#912](https://github.com/w3c/respec/issues/912)

**Merged pull requests:**

- Improve patent text on notes [\#1446](https://github.com/w3c/respec/pull/1446) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update deps [\#1444](https://github.com/w3c/respec/pull/1444) ([marcoscaceres](https://github.com/marcoscaceres))
- Update fs-extra to the latest version 🚀 [\#1442](https://github.com/w3c/respec/pull/1442) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- chore\(package\): update deps [\#1436](https://github.com/w3c/respec/pull/1436) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(package\): update hyperhtml to version 2.1.2 [\#1434](https://github.com/w3c/respec/pull/1434) ([marcoscaceres](https://github.com/marcoscaceres))
- Remove more jquery [\#1432](https://github.com/w3c/respec/pull/1432) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.3.0](https://github.com/w3c/respec/tree/v18.3.0) (2017-11-17)
[Full Changelog](https://github.com/w3c/respec/compare/v18.2.4...v18.3.0)

**Merged pull requests:**

- feat: teach ReSpec to sort lists [\#1430](https://github.com/w3c/respec/pull/1430) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.2.4](https://github.com/w3c/respec/tree/v18.2.4) (2017-11-01)
[Full Changelog](https://github.com/w3c/respec/compare/v18.2.3...v18.2.4)

**Merged pull requests:**

- fix\(tools/respecDocWriter\): colors.info is not a function [\#1422](https://github.com/w3c/respec/pull/1422) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.2.3](https://github.com/w3c/respec/tree/v18.2.3) (2017-10-27)
[Full Changelog](https://github.com/w3c/respec/compare/v18.2.2...v18.2.3)

## [v18.2.2](https://github.com/w3c/respec/tree/v18.2.2) (2017-10-27)
[Full Changelog](https://github.com/w3c/respec/compare/v18.2.1...v18.2.2)

**Closed issues:**

- Named modules could be accurately timed [\#1081](https://github.com/w3c/respec/issues/1081)
- Remove tests' depedency on specref [\#608](https://github.com/w3c/respec/issues/608)

**Merged pull requests:**

- \[Snyk\] Fix for 1 vulnerable dependency path [\#1420](https://github.com/w3c/respec/pull/1420) ([snyk-bot](https://github.com/snyk-bot))

## [v18.2.1](https://github.com/w3c/respec/tree/v18.2.1) (2017-10-26)
[Full Changelog](https://github.com/w3c/respec/compare/v18.2.0...v18.2.1)

**Closed issues:**

- Snapshot generation fails due to \<meta charset\> outside the first 1024 bytes [\#1417](https://github.com/w3c/respec/issues/1417)

**Merged pull requests:**

- fix\(ui/save-html\): move meta charset to top [\#1418](https://github.com/w3c/respec/pull/1418) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.2.0](https://github.com/w3c/respec/tree/v18.2.0) (2017-10-26)
[Full Changelog](https://github.com/w3c/respec/compare/v18.1.3...v18.2.0)

**Merged pull requests:**

- chore\(package\): s/prepublish/prepare, per npm5 [\#1415](https://github.com/w3c/respec/pull/1415) ([marcoscaceres](https://github.com/marcoscaceres))
- Babel bug [\#1414](https://github.com/w3c/respec/pull/1414) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.1.3](https://github.com/w3c/respec/tree/v18.1.3) (2017-10-25)
[Full Changelog](https://github.com/w3c/respec/compare/v18.1.2...v18.1.3)

**Merged pull requests:**

- \[Snyk\] Fix for 3 vulnerable dependency paths [\#1413](https://github.com/w3c/respec/pull/1413) ([snyk-bot](https://github.com/snyk-bot))

## [v18.1.2](https://github.com/w3c/respec/tree/v18.1.2) (2017-10-24)
[Full Changelog](https://github.com/w3c/respec/compare/v18.1.1...v18.1.2)

## [v18.1.1](https://github.com/w3c/respec/tree/v18.1.1) (2017-10-24)
[Full Changelog](https://github.com/w3c/respec/compare/v18.1.0...v18.1.1)

## [v18.1.0](https://github.com/w3c/respec/tree/v18.1.0) (2017-10-24)
[Full Changelog](https://github.com/w3c/respec/compare/v18.0.3...v18.1.0)

**Closed issues:**

- Ask people to upgrade to 18 when generating specs [\#1410](https://github.com/w3c/respec/issues/1410)

**Merged pull requests:**

- feat\(respec2html\): error if ReSpec \< v18 \(closes  \#1410\) [\#1412](https://github.com/w3c/respec/pull/1412) ([marcoscaceres](https://github.com/marcoscaceres))
- tests\(tests/headless\): test against real specs [\#1409](https://github.com/w3c/respec/pull/1409) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.0.3](https://github.com/w3c/respec/tree/v18.0.3) (2017-10-24)
[Full Changelog](https://github.com/w3c/respec/compare/v18.0.2...v18.0.3)

**Closed issues:**

- PR Preview / respecDocWriter reporting issues. [\#1345](https://github.com/w3c/respec/issues/1345)
- Need better list of specs [\#612](https://github.com/w3c/respec/issues/612)

**Merged pull requests:**

- security\(package\): run snyk protect with build \(closes \#1406\) [\#1411](https://github.com/w3c/respec/pull/1411) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.0.2](https://github.com/w3c/respec/tree/v18.0.2) (2017-10-23)
[Full Changelog](https://github.com/w3c/respec/compare/v18.0.1...v18.0.2)

**Merged pull requests:**

- fix\(ui/save-html\): encoding issue [\#1408](https://github.com/w3c/respec/pull/1408) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.0.1](https://github.com/w3c/respec/tree/v18.0.1) (2017-10-23)
[Full Changelog](https://github.com/w3c/respec/compare/v18.0.0...v18.0.1)

**Merged pull requests:**

- fix\(tools/respecDocWriter\): better error reporting [\#1407](https://github.com/w3c/respec/pull/1407) ([marcoscaceres](https://github.com/marcoscaceres))

## [v18.0.0](https://github.com/w3c/respec/tree/v18.0.0) (2017-10-22)
[Full Changelog](https://github.com/w3c/respec/compare/v17.1.2...v18.0.0)

## [v17.1.2](https://github.com/w3c/respec/tree/v17.1.2) (2017-10-22)
[Full Changelog](https://github.com/w3c/respec/compare/v17.1.1...v17.1.2)

**Implemented enhancements:**

- Process a clone document instead of the real DOM [\#818](https://github.com/w3c/respec/issues/818)
- Node 8 required [\#1402](https://github.com/w3c/respec/pull/1402) ([tripu](https://github.com/tripu))

**Fixed bugs:**

- Errors in latest Respec \(17.1.1\) when using "save as" [\#1403](https://github.com/w3c/respec/issues/1403)

**Closed issues:**

- ReSpec not updating on w3c server? [\#1401](https://github.com/w3c/respec/issues/1401)

**Merged pull requests:**

- Remove beautifier [\#1404](https://github.com/w3c/respec/pull/1404) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(.travis\): use linux [\#1398](https://github.com/w3c/respec/pull/1398) ([marcoscaceres](https://github.com/marcoscaceres))

## [v17.1.1](https://github.com/w3c/respec/tree/v17.1.1) (2017-10-20)
[Full Changelog](https://github.com/w3c/respec/compare/v17.1.0...v17.1.1)

## [v17.1.0](https://github.com/w3c/respec/tree/v17.1.0) (2017-10-19)
[Full Changelog](https://github.com/w3c/respec/compare/v17.0.0...v17.1.0)

**Closed issues:**

- case-insensitive sorting of references [\#1396](https://github.com/w3c/respec/issues/1396)
- Custom logos: width and height swapped in Firefox 56.0.1 [\#1391](https://github.com/w3c/respec/issues/1391)
- Says Note but Pubrules rejects [\#653](https://github.com/w3c/respec/issues/653)

**Merged pull requests:**

- refactor\(core/issues-notes\): fold in w3c/aria [\#1400](https://github.com/w3c/respec/pull/1400) ([marcoscaceres](https://github.com/marcoscaceres))
- Promisify refactor [\#1399](https://github.com/w3c/respec/pull/1399) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(biblio\): sort refs case insensitive \(closes \#1396\) [\#1397](https://github.com/w3c/respec/pull/1397) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update deps [\#1395](https://github.com/w3c/respec/pull/1395) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(issue-notes-spec\): dont need to show document [\#1393](https://github.com/w3c/respec/pull/1393) ([marcoscaceres](https://github.com/marcoscaceres))
- Update webidl2 to the latest version 🚀 [\#1390](https://github.com/w3c/respec/pull/1390) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- feat\(templates/sotd.html\): link to 2017 patent policy [\#1388](https://github.com/w3c/respec/pull/1388) ([marcoscaceres](https://github.com/marcoscaceres))

## [v17.0.0](https://github.com/w3c/respec/tree/v17.0.0) (2017-10-07)
[Full Changelog](https://github.com/w3c/respec/compare/v16.2.2...v17.0.0)

**Implemented enhancements:**

- Parentheses in IDs [\#1353](https://github.com/w3c/respec/issues/1353)

**Closed issues:**

- Readability of RFC 2119 terms [\#1380](https://github.com/w3c/respec/issues/1380)
- Avoid misleadingly displaying RFC 2119 words in lower case [\#1183](https://github.com/w3c/respec/issues/1183)

**Merged pull requests:**

- Remove special chars [\#1387](https://github.com/w3c/respec/pull/1387) ([marcoscaceres](https://github.com/marcoscaceres))
- Update mocha to the latest version 🚀 [\#1386](https://github.com/w3c/respec/pull/1386) ([greenkeeper[bot]](https://github.com/apps/greenkeeper))
- chore\(travis\): try testing OSX again [\#1385](https://github.com/w3c/respec/pull/1385) ([marcoscaceres](https://github.com/marcoscaceres))
- \[Snyk Update\] New fixes for 1 vulnerable dependency path [\#1384](https://github.com/w3c/respec/pull/1384) ([snyk-bot](https://github.com/snyk-bot))
- feat\(core/css/respec\): remove RFC2119 styling \(close \#1380\) [\#1383](https://github.com/w3c/respec/pull/1383) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update deps [\#1382](https://github.com/w3c/respec/pull/1382) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl\): warning message typo [\#1379](https://github.com/w3c/respec/pull/1379) ([marcoscaceres](https://github.com/marcoscaceres))
- Greenkeeper/initial [\#1378](https://github.com/w3c/respec/pull/1378) ([marcoscaceres](https://github.com/marcoscaceres))
- BREAKING CHANGE: Move ReSpec to pure ES6 [\#1331](https://github.com/w3c/respec/pull/1331) ([marcoscaceres](https://github.com/marcoscaceres))

## [v16.2.2](https://github.com/w3c/respec/tree/v16.2.2) (2017-09-05)
[Full Changelog](https://github.com/w3c/respec/compare/v16.2.1...v16.2.2)

## [v16.2.1](https://github.com/w3c/respec/tree/v16.2.1) (2017-08-28)
[Full Changelog](https://github.com/w3c/respec/compare/v16.2.0...v16.2.1)

## [v16.2.0](https://github.com/w3c/respec/tree/v16.2.0) (2017-08-23)
[Full Changelog](https://github.com/w3c/respec/compare/v16.1.0...v16.2.0)

**Closed issues:**

- data-cite and multi-pages spec [\#1180](https://github.com/w3c/respec/issues/1180)

**Merged pull requests:**

- Allow to specific path to a subpage in reference citations [\#1371](https://github.com/w3c/respec/pull/1371) ([dontcallmedom](https://github.com/dontcallmedom))

## [v16.1.0](https://github.com/w3c/respec/tree/v16.1.0) (2017-08-21)
[Full Changelog](https://github.com/w3c/respec/compare/v16.0.1...v16.1.0)

## [v16.0.1](https://github.com/w3c/respec/tree/v16.0.1) (2017-08-20)
[Full Changelog](https://github.com/w3c/respec/compare/v16.0.0...v16.0.1)

**Implemented enhancements:**

- Logos in templates should auto-select the version of the W3C styles they use [\#640](https://github.com/w3c/respec/issues/640)

**Closed issues:**

- How to define a method in a partial interface?  [\#1356](https://github.com/w3c/respec/issues/1356)
- Google getting wrong description [\#1336](https://github.com/w3c/respec/issues/1336)
- Add w3c defaults module [\#1206](https://github.com/w3c/respec/issues/1206)

**Merged pull requests:**

- Races [\#1368](https://github.com/w3c/respec/pull/1368) ([marcoscaceres](https://github.com/marcoscaceres))

## [v16.0.0](https://github.com/w3c/respec/tree/v16.0.0) (2017-08-16)
[Full Changelog](https://github.com/w3c/respec/compare/v15.8.4...v16.0.0)

**Merged pull requests:**

- Test split [\#1366](https://github.com/w3c/respec/pull/1366) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.8.4](https://github.com/w3c/respec/tree/v15.8.4) (2017-08-15)
[Full Changelog](https://github.com/w3c/respec/compare/v15.8.3...v15.8.4)

**Merged pull requests:**

- refactor\(jquery-enhanced-spec\): async + cleanup [\#1365](https://github.com/w3c/respec/pull/1365) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat: add core seo module [\#1364](https://github.com/w3c/respec/pull/1364) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.8.3](https://github.com/w3c/respec/tree/v15.8.3) (2017-08-14)
[Full Changelog](https://github.com/w3c/respec/compare/v15.8.2...v15.8.3)

**Fixed bugs:**

- Unknown linter warning [\#1361](https://github.com/w3c/respec/issues/1361)

**Closed issues:**

- RangeError: date value is not finite in DateTimeFormat.format\(\) [\#1357](https://github.com/w3c/respec/issues/1357)

**Merged pull requests:**

- Linter unknown warn [\#1362](https://github.com/w3c/respec/pull/1362) ([marcoscaceres](https://github.com/marcoscaceres))
- fix: recover when config dates are invalid \(closes \#1357\) [\#1358](https://github.com/w3c/respec/pull/1358) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.8.2](https://github.com/w3c/respec/tree/v15.8.2) (2017-08-09)
[Full Changelog](https://github.com/w3c/respec/compare/v15.8.1...v15.8.2)

**Merged pull requests:**

- Fix bug in detecting wrong configuration for multiple WGs [\#1354](https://github.com/w3c/respec/pull/1354) ([dontcallmedom](https://github.com/dontcallmedom))

## [v15.8.1](https://github.com/w3c/respec/tree/v15.8.1) (2017-08-08)
[Full Changelog](https://github.com/w3c/respec/compare/v15.8.0...v15.8.1)

**Merged pull requests:**

- Avoid race conditions [\#1350](https://github.com/w3c/respec/pull/1350) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.8.0](https://github.com/w3c/respec/tree/v15.8.0) (2017-08-08)
[Full Changelog](https://github.com/w3c/respec/compare/v15.7.4...v15.8.0)

**Closed issues:**

- 2017 Process Document Operational on 1 March 2017 [\#1039](https://github.com/w3c/respec/issues/1039)
- Automatic deployment on merge to develop branch [\#998](https://github.com/w3c/respec/issues/998)

**Merged pull requests:**

- fix\(core/utils\): handle nulls when checking TextNodes [\#1349](https://github.com/w3c/respec/pull/1349) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): remove jscs, jshint - using prettier and eslint [\#1348](https://github.com/w3c/respec/pull/1348) ([marcoscaceres](https://github.com/marcoscaceres))
- Refactor tests to use async [\#1346](https://github.com/w3c/respec/pull/1346) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/data-tests\): remove tests on save [\#1344](https://github.com/w3c/respec/pull/1344) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/linter\): add modular, non-blocking, linter \(closes \#20\) [\#1332](https://github.com/w3c/respec/pull/1332) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.7.4](https://github.com/w3c/respec/tree/v15.7.4) (2017-08-01)
[Full Changelog](https://github.com/w3c/respec/compare/v15.7.3...v15.7.4)

**Merged pull requests:**

- fix\(core/css/respec2\): less ugly test box [\#1343](https://github.com/w3c/respec/pull/1343) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.7.3](https://github.com/w3c/respec/tree/v15.7.3) (2017-07-28)
[Full Changelog](https://github.com/w3c/respec/compare/v15.7.2...v15.7.3)

**Merged pull requests:**

- L10n [\#1341](https://github.com/w3c/respec/pull/1341) ([dhvenema](https://github.com/dhvenema))

## [v15.7.2](https://github.com/w3c/respec/tree/v15.7.2) (2017-07-27)
[Full Changelog](https://github.com/w3c/respec/compare/v15.7.1...v15.7.2)

**Merged pull requests:**

- fix\(core/aria\): reduce chance of race condition [\#1340](https://github.com/w3c/respec/pull/1340) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.7.1](https://github.com/w3c/respec/tree/v15.7.1) (2017-07-27)
[Full Changelog](https://github.com/w3c/respec/compare/v15.7.0...v15.7.1)

## [v15.7.0](https://github.com/w3c/respec/tree/v15.7.0) (2017-07-27)
[Full Changelog](https://github.com/w3c/respec/compare/v15.6.0...v15.7.0)

**Fixed bugs:**

- Random document.body races still occuring [\#1335](https://github.com/w3c/respec/issues/1335)

**Merged pull requests:**

- data-tests module [\#1338](https://github.com/w3c/respec/pull/1338) ([marcoscaceres](https://github.com/marcoscaceres))
- fix document.body race [\#1337](https://github.com/w3c/respec/pull/1337) ([dhvenema](https://github.com/dhvenema))

## [v15.6.0](https://github.com/w3c/respec/tree/v15.6.0) (2017-07-27)
[Full Changelog](https://github.com/w3c/respec/compare/v15.5.1...v15.6.0)

**Closed issues:**

- Add special status for diff previews [\#1126](https://github.com/w3c/respec/issues/1126)

**Merged pull requests:**

- chore\(.eslintrc\): reconfigure eslint [\#1347](https://github.com/w3c/respec/pull/1347) ([marcoscaceres](https://github.com/marcoscaceres))
- Adds "preview" status, for @tobie previews [\#1334](https://github.com/w3c/respec/pull/1334) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.5.1](https://github.com/w3c/respec/tree/v15.5.1) (2017-07-26)
[Full Changelog](https://github.com/w3c/respec/compare/v15.5.0...v15.5.1)

**Implemented enhancements:**

- Add linter [\#20](https://github.com/w3c/respec/issues/20)

**Closed issues:**

- Convert moar things to ES6 [\#1165](https://github.com/w3c/respec/issues/1165)

**Merged pull requests:**

- fix: window.respecConf missing when using const [\#1333](https://github.com/w3c/respec/pull/1333) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.5.0](https://github.com/w3c/respec/tree/v15.5.0) (2017-07-21)
[Full Changelog](https://github.com/w3c/respec/compare/v15.4.1...v15.5.0)

**Merged pull requests:**

- Shortname from gh [\#1330](https://github.com/w3c/respec/pull/1330) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.4.1](https://github.com/w3c/respec/tree/v15.4.1) (2017-07-20)
[Full Changelog](https://github.com/w3c/respec/compare/v15.4.0...v15.4.1)

**Fixed bugs:**

- Fragment identifiers end up with invalid characters.  [\#1327](https://github.com/w3c/respec/issues/1327)

**Merged pull requests:**

- Fix linking [\#1329](https://github.com/w3c/respec/pull/1329) ([marcoscaceres](https://github.com/marcoscaceres))
- \[Snyk\] Fix for 2 vulnerable dependency paths [\#1328](https://github.com/w3c/respec/pull/1328) ([snyk-bot](https://github.com/snyk-bot))

## [v15.4.0](https://github.com/w3c/respec/tree/v15.4.0) (2017-07-19)
[Full Changelog](https://github.com/w3c/respec/compare/v15.3.0...v15.4.0)

**Closed issues:**

- No translations link? [\#1323](https://github.com/w3c/respec/issues/1323)

**Merged pull requests:**

- Fix bad usage of hyperHTML [\#1325](https://github.com/w3c/respec/pull/1325) ([marcoscaceres](https://github.com/marcoscaceres))
- Add link to translations when REC [\#1324](https://github.com/w3c/respec/pull/1324) ([marcoscaceres](https://github.com/marcoscaceres))
- L10n ui [\#1322](https://github.com/w3c/respec/pull/1322) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.3.0](https://github.com/w3c/respec/tree/v15.3.0) (2017-07-18)
[Full Changelog](https://github.com/w3c/respec/compare/v15.2.2...v15.3.0)

**Closed issues:**

- Respec License [\#1317](https://github.com/w3c/respec/issues/1317)

**Merged pull requests:**

- feat\(ui/save-html\): allow scripts to add things before save [\#1321](https://github.com/w3c/respec/pull/1321) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(LICENSE\): add LICENSE.md file \(closes \#1317\) [\#1320](https://github.com/w3c/respec/pull/1320) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.2.2](https://github.com/w3c/respec/tree/v15.2.2) (2017-07-17)
[Full Changelog](https://github.com/w3c/respec/compare/v15.2.1...v15.2.2)

**Merged pull requests:**

- Improve offline handling [\#1319](https://github.com/w3c/respec/pull/1319) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.2.1](https://github.com/w3c/respec/tree/v15.2.1) (2017-07-10)
[Full Changelog](https://github.com/w3c/respec/compare/v15.2.0...v15.2.1)

**Closed issues:**

- linter.js crashes on MS Edge due to use ":scope" selector [\#1314](https://github.com/w3c/respec/issues/1314)
- Spec rendering borked in Edge due to unwrapped "querySelectorAll" calls [\#1313](https://github.com/w3c/respec/issues/1313)

**Merged pull requests:**

- fix\(w3c/linter\): implement alt to CSS :scope \(fixes \#1314\) [\#1316](https://github.com/w3c/respec/pull/1316) ([marcoscaceres](https://github.com/marcoscaceres))
- fix: wrap querySelectorAll in Array.from \(closes \#1313\) [\#1315](https://github.com/w3c/respec/pull/1315) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.2.0](https://github.com/w3c/respec/tree/v15.2.0) (2017-07-06)
[Full Changelog](https://github.com/w3c/respec/compare/v15.1.3...v15.2.0)

**Merged pull requests:**

- feat\(core/webidl\): autolink toJSON to IDL spec [\#1312](https://github.com/w3c/respec/pull/1312) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.1.3](https://github.com/w3c/respec/tree/v15.1.3) (2017-07-06)
[Full Changelog](https://github.com/w3c/respec/compare/v15.1.2...v15.1.3)

**Merged pull requests:**

- refactor\(override-configuration-spec\): merge tests [\#1311](https://github.com/w3c/respec/pull/1311) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.1.2](https://github.com/w3c/respec/tree/v15.1.2) (2017-07-06)
[Full Changelog](https://github.com/w3c/respec/compare/v15.1.1...v15.1.2)

**Merged pull requests:**

- fix\(core/markdown\): eat empty p elements [\#1310](https://github.com/w3c/respec/pull/1310) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(ui/about-respec\): hide perf table when no data available [\#1308](https://github.com/w3c/respec/pull/1308) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.1.1](https://github.com/w3c/respec/tree/v15.1.1) (2017-07-05)
[Full Changelog](https://github.com/w3c/respec/compare/v15.1.0...v15.1.1)

**Merged pull requests:**

- fix\(ui/about-respec\): performance timing order [\#1307](https://github.com/w3c/respec/pull/1307) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.1.0](https://github.com/w3c/respec/tree/v15.1.0) (2017-07-05)
[Full Changelog](https://github.com/w3c/respec/compare/v15.0.2...v15.1.0)

**Merged pull requests:**

- chore\(travis\): try reducing concurreny [\#1306](https://github.com/w3c/respec/pull/1306) ([marcoscaceres](https://github.com/marcoscaceres))
- Perftime [\#1304](https://github.com/w3c/respec/pull/1304) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/utils\): a few simplifications [\#1303](https://github.com/w3c/respec/pull/1303) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.0.2](https://github.com/w3c/respec/tree/v15.0.2) (2017-06-29)
[Full Changelog](https://github.com/w3c/respec/compare/v15.0.1...v15.0.2)

**Merged pull requests:**

- Refactoring and bug fixes [\#1302](https://github.com/w3c/respec/pull/1302) ([marcoscaceres](https://github.com/marcoscaceres))

## [v15.0.1](https://github.com/w3c/respec/tree/v15.0.1) (2017-06-27)
[Full Changelog](https://github.com/w3c/respec/compare/v15.0.0...v15.0.1)

## [v15.0.0](https://github.com/w3c/respec/tree/v15.0.0) (2017-06-27)
[Full Changelog](https://github.com/w3c/respec/compare/v14.1.0...v15.0.0)

**Closed issues:**

- Stable Release URL [\#1301](https://github.com/w3c/respec/issues/1301)

**Merged pull requests:**

- BREAKING CHANGE\(core/webidl\): deprecate serializers [\#1300](https://github.com/w3c/respec/pull/1300) ([marcoscaceres](https://github.com/marcoscaceres))
- Moar es6 conversions... [\#1299](https://github.com/w3c/respec/pull/1299) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.1.0](https://github.com/w3c/respec/tree/v14.1.0) (2017-06-23)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.18...v14.1.0)

**Closed issues:**

- IDL parser doesn't seem to like record\<K, V\> [\#1297](https://github.com/w3c/respec/issues/1297)
- Respec not working today [\#1294](https://github.com/w3c/respec/issues/1294)

**Merged pull requests:**

- feat\(core/webidl\): handle multi-type generics [\#1298](https://github.com/w3c/respec/pull/1298) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.18](https://github.com/w3c/respec/tree/v14.0.18) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.17...v14.0.18)

**Merged pull requests:**

- Revert dom ready [\#1296](https://github.com/w3c/respec/pull/1296) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.17](https://github.com/w3c/respec/tree/v14.0.17) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.16...v14.0.17)

**Merged pull requests:**

- refactor\(js/profile-w3c-common\): DOMready [\#1295](https://github.com/w3c/respec/pull/1295) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.16](https://github.com/w3c/respec/tree/v14.0.16) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.15...v14.0.16)

## [v14.0.15](https://github.com/w3c/respec/tree/v14.0.15) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.14...v14.0.15)

**Merged pull requests:**

- refactor\(profile-w3c-common\): smaller DOM ready [\#1277](https://github.com/w3c/respec/pull/1277) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.14](https://github.com/w3c/respec/tree/v14.0.14) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.13...v14.0.14)

## [v14.0.13](https://github.com/w3c/respec/tree/v14.0.13) (2017-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.12...v14.0.13)

**Closed issues:**

- Breaking Change: Preface / Editors / Boilerplate / etc section missing [\#1290](https://github.com/w3c/respec/issues/1290)

**Merged pull requests:**

- fix: WebIDL is now living standard [\#1293](https://github.com/w3c/respec/pull/1293) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(w3c/templates/header\): no w3c logo for unofficial [\#1292](https://github.com/w3c/respec/pull/1292) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(w3c/headers\): bad method call \(closes \#1290\) [\#1291](https://github.com/w3c/respec/pull/1291) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.12](https://github.com/w3c/respec/tree/v14.0.12) (2017-06-21)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.11...v14.0.12)

**Fixed bugs:**

- ReSpec biblio processing broken in Firefox? [\#1285](https://github.com/w3c/respec/issues/1285)

**Merged pull requests:**

- Idb crash recovery [\#1289](https://github.com/w3c/respec/pull/1289) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.11](https://github.com/w3c/respec/tree/v14.0.11) (2017-06-21)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.10...v14.0.11)

**Fixed bugs:**

- Example titles display incorrectly [\#1282](https://github.com/w3c/respec/issues/1282)

**Closed issues:**

- double logo in CG specs [\#1286](https://github.com/w3c/respec/issues/1286)

**Merged pull requests:**

- fix: double logos in cg spec \(closes \#1286\) [\#1288](https://github.com/w3c/respec/pull/1288) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.10](https://github.com/w3c/respec/tree/v14.0.10) (2017-06-20)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.9...v14.0.10)

**Fixed bugs:**

- Custom logos broken? [\#1281](https://github.com/w3c/respec/issues/1281)

**Merged pull requests:**

- fix\(templates/cgbg-headers\): broken logos \(closes \#1281\) [\#1283](https://github.com/w3c/respec/pull/1283) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.9](https://github.com/w3c/respec/tree/v14.0.9) (2017-06-20)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.8...v14.0.9)

**Merged pull requests:**

- fix\(w3c/headers\): logos generating 404s [\#1280](https://github.com/w3c/respec/pull/1280) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.8](https://github.com/w3c/respec/tree/v14.0.8) (2017-06-19)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.7...v14.0.8)

**Merged pull requests:**

- refactor\(w3c/style\): small cleanup [\#1279](https://github.com/w3c/respec/pull/1279) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(tests/SpecRunner\): we use native fetch now [\#1278](https://github.com/w3c/respec/pull/1278) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.7](https://github.com/w3c/respec/tree/v14.0.7) (2017-06-18)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.6...v14.0.7)

**Merged pull requests:**

- set UTC timeZone for date formats, refs \#1272 [\#1276](https://github.com/w3c/respec/pull/1276) ([dissolve](https://github.com/dissolve))

## [v14.0.6](https://github.com/w3c/respec/tree/v14.0.6) (2017-06-16)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.5...v14.0.6)

**Merged pull requests:**

- refactor: Use hyperHTML for w3c logos [\#1275](https://github.com/w3c/respec/pull/1275) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.5](https://github.com/w3c/respec/tree/v14.0.5) (2017-06-16)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.4...v14.0.5)

**Fixed bugs:**

- Respec is errantly subtracting 1 day from previousPublishDate and publishDate [\#1272](https://github.com/w3c/respec/issues/1272)

**Merged pull requests:**

- fix: treat all dates as UTC \(closes \#1272\) [\#1274](https://github.com/w3c/respec/pull/1274) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.4](https://github.com/w3c/respec/tree/v14.0.4) (2017-06-14)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.3...v14.0.4)

**Fixed bugs:**

- Print style sheet broke [\#1196](https://github.com/w3c/respec/issues/1196)

**Merged pull requests:**

- Ui fixes [\#1273](https://github.com/w3c/respec/pull/1273) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.3](https://github.com/w3c/respec/tree/v14.0.3) (2017-06-13)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.2...v14.0.3)

**Fixed bugs:**

- respec borken in Edge 15? [\#1258](https://github.com/w3c/respec/issues/1258)

**Merged pull requests:**

- tests: allow testing in Edge [\#1271](https://github.com/w3c/respec/pull/1271) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor: remove fetch poly [\#1270](https://github.com/w3c/respec/pull/1270) ([marcoscaceres](https://github.com/marcoscaceres))
- fix: add URLSearchParams poly \(closes \#1258\) [\#1269](https://github.com/w3c/respec/pull/1269) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.2](https://github.com/w3c/respec/tree/v14.0.2) (2017-06-12)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.1...v14.0.2)

**Merged pull requests:**

- fix\(core/link-to-dfn\): markdown escape dfn [\#1268](https://github.com/w3c/respec/pull/1268) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.1](https://github.com/w3c/respec/tree/v14.0.1) (2017-06-12)
[Full Changelog](https://github.com/w3c/respec/compare/v14.0.0...v14.0.1)

**Merged pull requests:**

- fix\(w3c/headers\): wrong license warning [\#1267](https://github.com/w3c/respec/pull/1267) ([marcoscaceres](https://github.com/marcoscaceres))

## [v14.0.0](https://github.com/w3c/respec/tree/v14.0.0) (2017-06-12)
[Full Changelog](https://github.com/w3c/respec/compare/v13.2.0...v14.0.0)

**Implemented enhancements:**

- ReSpec warnings/errors should be markdown [\#1085](https://github.com/w3c/respec/issues/1085)

**Closed issues:**

- Remove idlExceptionTmpl and related code [\#1263](https://github.com/w3c/respec/issues/1263)

**Merged pull requests:**

- refactor\(ui/search-specref\): reword drop-down option [\#1266](https://github.com/w3c/respec/pull/1266) ([marcoscaceres](https://github.com/marcoscaceres))
- BREAKING CHANGE: deprecate WebIDL exceptions [\#1265](https://github.com/w3c/respec/pull/1265) ([marcoscaceres](https://github.com/marcoscaceres))
- BREAKING CHANGE: use markdown for error/warn [\#1264](https://github.com/w3c/respec/pull/1264) ([marcoscaceres](https://github.com/marcoscaceres))

## [v13.2.0](https://github.com/w3c/respec/tree/v13.2.0) (2017-06-12)
[Full Changelog](https://github.com/w3c/respec/compare/v13.1.2...v13.2.0)

**Implemented enhancements:**

- Additional values added to the stored config information [\#504](https://github.com/w3c/respec/issues/504)

**Merged pull requests:**

- feat: add URL query values to exported user config  [\#1262](https://github.com/w3c/respec/pull/1262) ([marcoscaceres](https://github.com/marcoscaceres))

## [v13.1.2](https://github.com/w3c/respec/tree/v13.1.2) (2017-06-12)
[Full Changelog](https://github.com/w3c/respec/compare/v13.1.1...v13.1.2)

**Fixed bugs:**

- Privacy warning for WG NOTE [\#1107](https://github.com/w3c/respec/issues/1107)

**Merged pull requests:**

- fix\(w3c/linkter\): privacy warn for non-rec track [\#1261](https://github.com/w3c/respec/pull/1261) ([marcoscaceres](https://github.com/marcoscaceres))

## [v13.1.1](https://github.com/w3c/respec/tree/v13.1.1) (2017-06-11)
[Full Changelog](https://github.com/w3c/respec/compare/v13.1.0...v13.1.1)

**Fixed bugs:**

- Timezone affects dates [\#1256](https://github.com/w3c/respec/issues/1256)

**Merged pull requests:**

- test\(.travis\): run on OSX and Safari [\#1260](https://github.com/w3c/respec/pull/1260) ([marcoscaceres](https://github.com/marcoscaceres))
- wip: refactor date handling [\#1259](https://github.com/w3c/respec/pull/1259) ([marcoscaceres](https://github.com/marcoscaceres))
- \[Snyk\] Fix for 2 vulnerable dependency paths [\#1257](https://github.com/w3c/respec/pull/1257) ([snyk-bot](https://github.com/snyk-bot))

## [v13.1.0](https://github.com/w3c/respec/tree/v13.1.0) (2017-06-05)
[Full Changelog](https://github.com/w3c/respec/compare/v13.0.0...v13.1.0)

**Implemented enhancements:**

- Add ability to include date/time into ednotes [\#829](https://github.com/w3c/respec/issues/829)
- Move to closure compiler [\#789](https://github.com/w3c/respec/issues/789)
- Allow linking from references to definitions to be limited to only the first per group [\#684](https://github.com/w3c/respec/issues/684)
- Builder needs some modernization [\#634](https://github.com/w3c/respec/issues/634)
- Future planning [\#385](https://github.com/w3c/respec/issues/385)

**Fixed bugs:**

- SoTD text ends up in wrong place when sub sections are included [\#1236](https://github.com/w3c/respec/issues/1236)
- Add Linking to constructors in WebIDL  [\#900](https://github.com/w3c/respec/issues/900)

**Closed issues:**

- Going faster than browsers in corporate environments \(e.g., Firefox ESR\) [\#1159](https://github.com/w3c/respec/issues/1159)
- npm deprecation warning [\#1148](https://github.com/w3c/respec/issues/1148)
- Retire shiv module [\#775](https://github.com/w3c/respec/issues/775)
- Unnecessary complexity of plugins [\#669](https://github.com/w3c/respec/issues/669)
- toExecPromise\(\) should become its own module [\#615](https://github.com/w3c/respec/issues/615)
- Problem with sequence parametrized types with multiple types [\#457](https://github.com/w3c/respec/issues/457)
- Batch option revisited [\#453](https://github.com/w3c/respec/issues/453)
- Support github and updated boilerplate [\#416](https://github.com/w3c/respec/issues/416)
- Offer to save snapshots straight to GitHub [\#269](https://github.com/w3c/respec/issues/269)

**Merged pull requests:**

- fix\(core/headers\): SoTD doesn't respect sections [\#1255](https://github.com/w3c/respec/pull/1255) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/data-cite\): parent can define cite root \(closes \#684\) [\#1252](https://github.com/w3c/respec/pull/1252) ([marcoscaceres](https://github.com/marcoscaceres))

## [v13.0.0](https://github.com/w3c/respec/tree/v13.0.0) (2017-06-04)
[Full Changelog](https://github.com/w3c/respec/compare/v12.2.3...v13.0.0)

**Fixed bugs:**

- data-cite with a missing spec identifier crashes plugin [\#1198](https://github.com/w3c/respec/issues/1198)

**Merged pull requests:**

- fix\(core/data-cite\): using just \#frag crashes \(closes \#1198\) [\#1250](https://github.com/w3c/respec/pull/1250) ([marcoscaceres](https://github.com/marcoscaceres))
- BREAKING CHANGE: remove js/tmpl.js - not used [\#1249](https://github.com/w3c/respec/pull/1249) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.2.3](https://github.com/w3c/respec/tree/v12.2.3) (2017-06-01)
[Full Changelog](https://github.com/w3c/respec/compare/v12.2.2...v12.2.3)

**Fixed bugs:**

- pre class IDL eats its own CSS classes  [\#1247](https://github.com/w3c/respec/issues/1247)

**Merged pull requests:**

- fix\(core/webidl\): pre eats its own CSS classes \(closes \#1247\) [\#1248](https://github.com/w3c/respec/pull/1248) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.2.2](https://github.com/w3c/respec/tree/v12.2.2) (2017-05-30)
[Full Changelog](https://github.com/w3c/respec/compare/v12.2.1...v12.2.2)

**Merged pull requests:**

- Update l10n [\#1246](https://github.com/w3c/respec/pull/1246) ([dhvenema](https://github.com/dhvenema))

## [v12.2.1](https://github.com/w3c/respec/tree/v12.2.1) (2017-05-30)
[Full Changelog](https://github.com/w3c/respec/compare/v12.2.0...v12.2.1)

**Merged pull requests:**

- fix\(w3c/style\): revert meta viewport to device-width [\#1245](https://github.com/w3c/respec/pull/1245) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.2.0](https://github.com/w3c/respec/tree/v12.2.0) (2017-05-30)
[Full Changelog](https://github.com/w3c/respec/compare/v12.1.1...v12.2.0)

**Merged pull requests:**

- fix\(ui/ui.css\): search button fits [\#1244](https://github.com/w3c/respec/pull/1244) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/utils\): use native date parser [\#1243](https://github.com/w3c/respec/pull/1243) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.1.1](https://github.com/w3c/respec/tree/v12.1.1) (2017-05-29)
[Full Changelog](https://github.com/w3c/respec/compare/v12.1.0...v12.1.1)

**Merged pull requests:**

- refactor\(tools/release\): use async/await [\#1242](https://github.com/w3c/respec/pull/1242) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.1.0](https://github.com/w3c/respec/tree/v12.1.0) (2017-05-29)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.6...v12.1.0)

**Implemented enhancements:**

- Better support for illegal-example [\#62](https://github.com/w3c/respec/issues/62)

**Closed issues:**

- ReSpec eats \<..\> sequences from WebIDL [\#1235](https://github.com/w3c/respec/issues/1235)

**Merged pull requests:**

- chore\(package\): update deps [\#1241](https://github.com/w3c/respec/pull/1241) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(ui/search-specref\): reimagine specref search [\#1240](https://github.com/w3c/respec/pull/1240) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.0.6](https://github.com/w3c/respec/tree/v12.0.6) (2017-05-21)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.5...v12.0.6)

**Merged pull requests:**

- refactor: es6 + hyperHTML  [\#1234](https://github.com/w3c/respec/pull/1234) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(.travis\): combine stages into one [\#1233](https://github.com/w3c/respec/pull/1233) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.0.5](https://github.com/w3c/respec/tree/v12.0.5) (2017-05-19)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.4...v12.0.5)

**Closed issues:**

- Missing backslash in github.js [\#1224](https://github.com/w3c/respec/issues/1224)

**Merged pull requests:**

- fix\(core/github\): missing backslash \(closes \#1224\) [\#1232](https://github.com/w3c/respec/pull/1232) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.0.4](https://github.com/w3c/respec/tree/v12.0.4) (2017-05-19)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.3...v12.0.4)

**Merged pull requests:**

- chore: switch to uglify-es [\#1230](https://github.com/w3c/respec/pull/1230) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.0.3](https://github.com/w3c/respec/tree/v12.0.3) (2017-05-19)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.2...v12.0.3)

**Merged pull requests:**

- refactor: switch from fs-promise to fs-extra [\#1229](https://github.com/w3c/respec/pull/1229) ([marcoscaceres](https://github.com/marcoscaceres))
- chore: use hljs from command line [\#1228](https://github.com/w3c/respec/pull/1228) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(.travis\): split into jobs/stages [\#1222](https://github.com/w3c/respec/pull/1222) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update deps [\#1218](https://github.com/w3c/respec/pull/1218) ([marcoscaceres](https://github.com/marcoscaceres))

## [v12.0.2](https://github.com/w3c/respec/tree/v12.0.2) (2017-05-18)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.1...v12.0.2)

**Closed issues:**

- respec-w3c-common returns "undefined" [\#1225](https://github.com/w3c/respec/issues/1225)

## [v12.0.1](https://github.com/w3c/respec/tree/v12.0.1) (2017-05-18)
[Full Changelog](https://github.com/w3c/respec/compare/v12.0.0...v12.0.1)

## [v12.0.0](https://github.com/w3c/respec/tree/v12.0.0) (2017-05-18)
[Full Changelog](https://github.com/w3c/respec/compare/v11.8.1...v12.0.0)

**Merged pull requests:**

- BREAKING CHANGE: upgrade WebIDL parser [\#1221](https://github.com/w3c/respec/pull/1221) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.8.1](https://github.com/w3c/respec/tree/v11.8.1) (2017-05-18)
[Full Changelog](https://github.com/w3c/respec/compare/v11.8.0...v11.8.1)

**Merged pull requests:**

- update l10n.js [\#1220](https://github.com/w3c/respec/pull/1220) ([chaals](https://github.com/chaals))
- Update l10n.js [\#1219](https://github.com/w3c/respec/pull/1219) ([chaals](https://github.com/chaals))

## [v11.8.0](https://github.com/w3c/respec/tree/v11.8.0) (2017-05-15)
[Full Changelog](https://github.com/w3c/respec/compare/v11.7.0...v11.8.0)

**Merged pull requests:**

- feat\(core/markdown\): add data-format support [\#1216](https://github.com/w3c/respec/pull/1216) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/github\): lowercase host, origin check [\#1215](https://github.com/w3c/respec/pull/1215) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.7.0](https://github.com/w3c/respec/tree/v11.7.0) (2017-05-11)
[Full Changelog](https://github.com/w3c/respec/compare/v11.6.0...v11.7.0)

## [v11.6.0](https://github.com/w3c/respec/tree/v11.6.0) (2017-05-11)
[Full Changelog](https://github.com/w3c/respec/compare/v11.5.0...v11.6.0)

**Closed issues:**

- IE11 Object doesn't support property or method 'remove' [\#1025](https://github.com/w3c/respec/issues/1025)

**Merged pull requests:**

- feat\(core/github\): add github: option [\#1213](https://github.com/w3c/respec/pull/1213) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/base-runner\): simplify running new plugs [\#1212](https://github.com/w3c/respec/pull/1212) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/markdown\): root level processing [\#1211](https://github.com/w3c/respec/pull/1211) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(tools/make-test-file-build\): use async/await [\#1209](https://github.com/w3c/respec/pull/1209) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(core/base-runner\): support async plugins using promises [\#1205](https://github.com/w3c/respec/pull/1205) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.5.0](https://github.com/w3c/respec/tree/v11.5.0) (2017-05-08)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.5...v11.5.0)

**Merged pull requests:**

- refactor: prettier with trailing comma [\#1204](https://github.com/w3c/respec/pull/1204) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/markdown\): processing bugs [\#1202](https://github.com/w3c/respec/pull/1202) ([marcoscaceres](https://github.com/marcoscaceres))
- chore: run prettier over all js files [\#1201](https://github.com/w3c/respec/pull/1201) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.4.5](https://github.com/w3c/respec/tree/v11.4.5) (2017-05-08)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.4...v11.4.5)

**Merged pull requests:**

- Webidl js 2.3 [\#1200](https://github.com/w3c/respec/pull/1200) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update webidl2 to 2.3.0 [\#1199](https://github.com/w3c/respec/pull/1199) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.4.4](https://github.com/w3c/respec/tree/v11.4.4) (2017-05-03)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.3...v11.4.4)

**Closed issues:**

- Greenkeeper no longer working [\#1192](https://github.com/w3c/respec/issues/1192)

**Merged pull requests:**

- only request comments on wgPublicList if it exists [\#1195](https://github.com/w3c/respec/pull/1195) ([chaals](https://github.com/chaals))
- Fix for ampersands in markdown [\#1174](https://github.com/w3c/respec/pull/1174) ([nickevansuk](https://github.com/nickevansuk))

## [v11.4.3](https://github.com/w3c/respec/tree/v11.4.3) (2017-05-01)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.2...v11.4.3)

**Closed issues:**

- CSS validator complains of @support [\#1163](https://github.com/w3c/respec/issues/1163)
- Add copy button to IDL [\#1104](https://github.com/w3c/respec/issues/1104)

**Merged pull requests:**

- fix\(respec2.css\): remove acronym styles [\#1194](https://github.com/w3c/respec/pull/1194) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(styles\): remove ReSpec UI styles on save \(closes \#1163\) [\#1193](https://github.com/w3c/respec/pull/1193) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.4.2](https://github.com/w3c/respec/tree/v11.4.2) (2017-05-01)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.1...v11.4.2)

**Merged pull requests:**

- fix\(core/webidl\): fix link to HTML spec [\#1191](https://github.com/w3c/respec/pull/1191) ([marcoscaceres](https://github.com/marcoscaceres))
- More secure links [\#1190](https://github.com/w3c/respec/pull/1190) ([xfq](https://github.com/xfq))
- Use Process 2017 in the starter spec [\#1189](https://github.com/w3c/respec/pull/1189) ([xfq](https://github.com/xfq))
- Fix a typo in README.md [\#1188](https://github.com/w3c/respec/pull/1188) ([xfq](https://github.com/xfq))
- chore\(.travis\): switch to yarn [\#1187](https://github.com/w3c/respec/pull/1187) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.4.1](https://github.com/w3c/respec/tree/v11.4.1) (2017-04-04)
[Full Changelog](https://github.com/w3c/respec/compare/v11.4.0...v11.4.1)

**Implemented enhancements:**

- Autolink IDL extended attributes [\#989](https://github.com/w3c/respec/issues/989)

**Fixed bugs:**

- Autolink IDL extended attributes [\#989](https://github.com/w3c/respec/issues/989)

**Merged pull requests:**

- fix\(core/webidl\): link to WEBIDL-LS for some things \(closes \#989\) [\#1178](https://github.com/w3c/respec/pull/1178) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.4.0](https://github.com/w3c/respec/tree/v11.4.0) (2017-04-01)
[Full Changelog](https://github.com/w3c/respec/compare/v11.3.0...v11.4.0)

**Merged pull requests:**

- feat: add "copy IDL to clipboard" button [\#1177](https://github.com/w3c/respec/pull/1177) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.3.0](https://github.com/w3c/respec/tree/v11.3.0) (2017-04-01)
[Full Changelog](https://github.com/w3c/respec/compare/v11.2.4...v11.3.0)

**Closed issues:**

- Example titles incorrectly unescaped [\#1173](https://github.com/w3c/respec/issues/1173)

**Merged pull requests:**

- test d/l chrome stable [\#1176](https://github.com/w3c/respec/pull/1176) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: use grid for save button layout [\#1175](https://github.com/w3c/respec/pull/1175) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.2.4](https://github.com/w3c/respec/tree/v11.2.4) (2017-03-29)
[Full Changelog](https://github.com/w3c/respec/compare/v11.2.3...v11.2.4)

**Implemented enhancements:**

- Dutch Translations Issue Summary, TOF, References [\#1170](https://github.com/w3c/respec/issues/1170)

**Merged pull requests:**

- L10n translations [\#1171](https://github.com/w3c/respec/pull/1171) ([dhvenema](https://github.com/dhvenema))

## [v11.2.3](https://github.com/w3c/respec/tree/v11.2.3) (2017-03-29)
[Full Changelog](https://github.com/w3c/respec/compare/v11.2.2...v11.2.3)

**Merged pull requests:**

- \[Snyk\] Fix for 1 vulnerable dependency path [\#1169](https://github.com/w3c/respec/pull/1169) ([snyk-bot](https://github.com/snyk-bot))

## [v11.2.2](https://github.com/w3c/respec/tree/v11.2.2) (2017-03-29)
[Full Changelog](https://github.com/w3c/respec/compare/v11.2.1...v11.2.2)

**Fixed bugs:**

- Saving as HTML includes the save dialog in the resulting HTML [\#1164](https://github.com/w3c/respec/issues/1164)

**Merged pull requests:**

- tests\(karma\): switch to firefox [\#1168](https://github.com/w3c/respec/pull/1168) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/ui\): duplicate attribute \(closes \#1164\) [\#1167](https://github.com/w3c/respec/pull/1167) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.2.1](https://github.com/w3c/respec/tree/v11.2.1) (2017-03-13)
[Full Changelog](https://github.com/w3c/respec/compare/v11.2.0...v11.2.1)

**Closed issues:**

- Use css "wavy" when supported [\#1150](https://github.com/w3c/respec/issues/1150)

**Merged pull requests:**

- fix\(core/css/respec2\): use native wavy red line for errors [\#1158](https://github.com/w3c/respec/pull/1158) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.2.0](https://github.com/w3c/respec/tree/v11.2.0) (2017-03-13)
[Full Changelog](https://github.com/w3c/respec/compare/v11.1.0...v11.2.0)

**Closed issues:**

- Generalize l10n module  [\#1152](https://github.com/w3c/respec/issues/1152)
- Convert AMD modules to ES6 modules [\#1143](https://github.com/w3c/respec/issues/1143)

**Merged pull requests:**

- Corel10n [\#1157](https://github.com/w3c/respec/pull/1157) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(tests/headless\): don't double build respec [\#1156](https://github.com/w3c/respec/pull/1156) ([marcoscaceres](https://github.com/marcoscaceres))
- test\(.travis.yml\): try tests up to 3 times [\#1155](https://github.com/w3c/respec/pull/1155) ([marcoscaceres](https://github.com/marcoscaceres))
- Moar es6 [\#1154](https://github.com/w3c/respec/pull/1154) ([marcoscaceres](https://github.com/marcoscaceres))
- Moar es6 [\#1153](https://github.com/w3c/respec/pull/1153) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.1.0](https://github.com/w3c/respec/tree/v11.1.0) (2017-03-13)
[Full Changelog](https://github.com/w3c/respec/compare/v11.0.1...v11.1.0)

**Merged pull requests:**

- feat\(tools/builder.js\): learn to take command line args [\#1151](https://github.com/w3c/respec/pull/1151) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.0.1](https://github.com/w3c/respec/tree/v11.0.1) (2017-03-11)
[Full Changelog](https://github.com/w3c/respec/compare/v11.0.0...v11.0.1)

**Merged pull requests:**

- l10n: use l10n strings instead of English words [\#1149](https://github.com/w3c/respec/pull/1149) ([marcoscaceres](https://github.com/marcoscaceres))

## [v11.0.0](https://github.com/w3c/respec/tree/v11.0.0) (2017-03-10)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.14...v11.0.0)

**Merged pull requests:**

- BREAKING CHANGE: remove w3c/unhtml5 module [\#1147](https://github.com/w3c/respec/pull/1147) ([marcoscaceres](https://github.com/marcoscaceres))
- Es6 moar things [\#1146](https://github.com/w3c/respec/pull/1146) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/webidl\): rename webidl-oldschool.css to webidl.css [\#1145](https://github.com/w3c/respec/pull/1145) ([marcoscaceres](https://github.com/marcoscaceres))
- Bye idl oldschool and shiv [\#1144](https://github.com/w3c/respec/pull/1144) ([marcoscaceres](https://github.com/marcoscaceres))
- Es6 moar things [\#1142](https://github.com/w3c/respec/pull/1142) ([marcoscaceres](https://github.com/marcoscaceres))
- Es6 moar things [\#1141](https://github.com/w3c/respec/pull/1141) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.14](https://github.com/w3c/respec/tree/v10.5.14) (2017-03-08)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.13...v10.5.14)

**Implemented enhancements:**

- internationalize humanDate  [\#1137](https://github.com/w3c/respec/issues/1137)

**Merged pull requests:**

- Intl human date [\#1139](https://github.com/w3c/respec/pull/1139) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.13](https://github.com/w3c/respec/tree/v10.5.13) (2017-03-08)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.12...v10.5.13)

**Fixed bugs:**

- Respec interaction button not appearing \(again... sometimes:-\( [\#1131](https://github.com/w3c/respec/issues/1131)

**Merged pull requests:**

- fix\(core/ui\): race inserting into body, if no body \(closes \#1131\) [\#1138](https://github.com/w3c/respec/pull/1138) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.12](https://github.com/w3c/respec/tree/v10.5.12) (2017-03-07)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.11...v10.5.12)

**Fixed bugs:**

- Malformed fragment identifiers [\#1120](https://github.com/w3c/respec/issues/1120)

**Merged pull requests:**

- Issue 1120 malformed ids [\#1135](https://github.com/w3c/respec/pull/1135) ([marcoscaceres](https://github.com/marcoscaceres))
- chore: switch to babel-preset-env [\#1134](https://github.com/w3c/respec/pull/1134) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/webidl-contiguous\): convert to ES6 module [\#1133](https://github.com/w3c/respec/pull/1133) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl-contiguous\): generate valid fragments \(closes \#1120\) [\#1132](https://github.com/w3c/respec/pull/1132) ([marcoscaceres](https://github.com/marcoscaceres))
- Expand handlebars path arguments for build to run on Windows [\#1130](https://github.com/w3c/respec/pull/1130) ([tidoust](https://github.com/tidoust))

## [v10.5.11](https://github.com/w3c/respec/tree/v10.5.11) (2017-03-03)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.10...v10.5.11)

**Fixed bugs:**

- Run "npm run hb:build" before building [\#1127](https://github.com/w3c/respec/issues/1127)

## [v10.5.10](https://github.com/w3c/respec/tree/v10.5.10) (2017-03-03)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.9...v10.5.10)

**Fixed bugs:**

- White screen -- sometimes [\#1113](https://github.com/w3c/respec/issues/1113)

**Closed issues:**

- document.body is null in respect-w3c-common:14:10169 [\#1123](https://github.com/w3c/respec/issues/1123)

**Merged pull requests:**

- refactor\(core/pubsubhub\): make better use of ES6 [\#1125](https://github.com/w3c/respec/pull/1125) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.9](https://github.com/w3c/respec/tree/v10.5.9) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.8...v10.5.9)

## [v10.5.8](https://github.com/w3c/respec/tree/v10.5.8) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.7...v10.5.8)

**Closed issues:**

- WebIDL index generating duplicate IDs  [\#1119](https://github.com/w3c/respec/issues/1119)
- markdown parser generating empty `p` [\#1117](https://github.com/w3c/respec/issues/1117)

**Merged pull requests:**

- Validator fixes [\#1122](https://github.com/w3c/respec/pull/1122) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/webidl-index\): don't clone IDs into idl-index \(closes \#1119\) [\#1121](https://github.com/w3c/respec/pull/1121) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.7](https://github.com/w3c/respec/tree/v10.5.7) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.6...v10.5.7)

**Merged pull requests:**

- refactor\(core/webidl-index\): convert to ES6 [\#1118](https://github.com/w3c/respec/pull/1118) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.6](https://github.com/w3c/respec/tree/v10.5.6) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.5...v10.5.6)

**Merged pull requests:**

- fix\(core/aria\): race condition when no body \(closes \#1113\) [\#1116](https://github.com/w3c/respec/pull/1116) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.5](https://github.com/w3c/respec/tree/v10.5.5) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.4...v10.5.5)

## [v10.5.4](https://github.com/w3c/respec/tree/v10.5.4) (2017-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.3...v10.5.4)

**Implemented enhancements:**

- Use Process 2017 [\#1114](https://github.com/w3c/respec/pull/1114) ([plehegar](https://github.com/plehegar))

**Merged pull requests:**

- fix\(core/ui\): return early if element is not passed [\#1115](https://github.com/w3c/respec/pull/1115) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.3](https://github.com/w3c/respec/tree/v10.5.3) (2017-02-24)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.2...v10.5.3)

**Closed issues:**

- "Shown" should be "presented" in prose [\#1111](https://github.com/w3c/respec/issues/1111)

**Merged pull requests:**

- refactor\(handlebars\): generalizer handlebar generation [\#1112](https://github.com/w3c/respec/pull/1112) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.5.2](https://github.com/w3c/respec/tree/v10.5.2) (2017-02-22)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.1...v10.5.2)

## [v10.5.1](https://github.com/w3c/respec/tree/v10.5.1) (2017-02-22)
[Full Changelog](https://github.com/w3c/respec/compare/v10.5.0...v10.5.1)

## [v10.5.0](https://github.com/w3c/respec/tree/v10.5.0) (2017-02-22)
[Full Changelog](https://github.com/w3c/respec/compare/v10.4.0...v10.5.0)

**Fixed bugs:**

- Linking to coded defintions applies the wrong style  [\#668](https://github.com/w3c/respec/issues/668)

**Closed issues:**

- Why is WebIDL-LS added as an "informative" reference? [\#1105](https://github.com/w3c/respec/issues/1105)
- Deprecate diffTool [\#808](https://github.com/w3c/respec/issues/808)

## [v10.4.0](https://github.com/w3c/respec/tree/v10.4.0) (2017-02-21)
[Full Changelog](https://github.com/w3c/respec/compare/v10.3.0...v10.4.0)

## [v10.3.0](https://github.com/w3c/respec/tree/v10.3.0) (2017-02-21)
[Full Changelog](https://github.com/w3c/respec/compare/v10.2.1...v10.3.0)

**Closed issues:**

- Linter should have own pill [\#1100](https://github.com/w3c/respec/issues/1100)
- Use async evaluate\(\) in respec2html [\#951](https://github.com/w3c/respec/issues/951)

**Merged pull requests:**

- Refactor w3c/rfc2119  [\#1102](https://github.com/w3c/respec/pull/1102) ([marcoscaceres](https://github.com/marcoscaceres))
- Small bug fixes... [\#1101](https://github.com/w3c/respec/pull/1101) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.2.1](https://github.com/w3c/respec/tree/v10.2.1) (2017-02-20)
[Full Changelog](https://github.com/w3c/respec/compare/v10.2.0...v10.2.1)

**Fixed bugs:**

- data-cite regression [\#1094](https://github.com/w3c/respec/issues/1094)

**Merged pull requests:**

- Linter priv sec again [\#1099](https://github.com/w3c/respec/pull/1099) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.2.0](https://github.com/w3c/respec/tree/v10.2.0) (2017-02-20)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.18...v10.2.0)

**Implemented enhancements:**

- Link \[CEReactions\], and maybe other IDL extended attributes, to their definition [\#702](https://github.com/w3c/respec/issues/702)

**Closed issues:**

- IDL parsing error is quite unhelpful [\#1057](https://github.com/w3c/respec/issues/1057)

**Merged pull requests:**

- Link to idl defs [\#1098](https://github.com/w3c/respec/pull/1098) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.18](https://github.com/w3c/respec/tree/v10.1.18) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.17...v10.1.18)

## [v10.1.17](https://github.com/w3c/respec/tree/v10.1.17) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.16...v10.1.17)

## [v10.1.16](https://github.com/w3c/respec/tree/v10.1.16) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.15...v10.1.16)

## [v10.1.15](https://github.com/w3c/respec/tree/v10.1.15) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.14...v10.1.15)

## [v10.1.14](https://github.com/w3c/respec/tree/v10.1.14) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.13...v10.1.14)

**Fixed bugs:**

- Fix a CSS property [\#1096](https://github.com/w3c/respec/pull/1096) ([tripu](https://github.com/tripu))

## [v10.1.13](https://github.com/w3c/respec/tree/v10.1.13) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.12...v10.1.13)

**Closed issues:**

- Use monospace font for \<a\>s that link back to IDL [\#1088](https://github.com/w3c/respec/issues/1088)

**Merged pull requests:**

- fix: use monospace font for \<a\>s that link back to IDL [\#1095](https://github.com/w3c/respec/pull/1095) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.12](https://github.com/w3c/respec/tree/v10.1.12) (2017-02-17)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.11...v10.1.12)

**Fixed bugs:**

- Template string bug [\#1091](https://github.com/w3c/respec/issues/1091)

**Merged pull requests:**

- fix: import regenerator when needed makes things less racy [\#1093](https://github.com/w3c/respec/pull/1093) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(core/biblio\): template string \(closes \#1091\) [\#1092](https://github.com/w3c/respec/pull/1092) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.11](https://github.com/w3c/respec/tree/v10.1.11) (2017-02-16)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.10...v10.1.11)

## [v10.1.10](https://github.com/w3c/respec/tree/v10.1.10) (2017-02-16)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.9...v10.1.10)

**Closed issues:**

- Strange bug handling \<pre\> sections... [\#1089](https://github.com/w3c/respec/issues/1089)

**Merged pull requests:**

- Fix highlight [\#1090](https://github.com/w3c/respec/pull/1090) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.9](https://github.com/w3c/respec/tree/v10.1.9) (2017-02-16)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.8...v10.1.9)

**Fixed bugs:**

- ReSpec should warn on unstructured/text specref entries [\#1082](https://github.com/w3c/respec/issues/1082)
- Menu items don't adapt well on mobile  [\#755](https://github.com/w3c/respec/issues/755)

**Merged pull requests:**

- fix: error if bad specref entry found \(closes \#1082\) [\#1087](https://github.com/w3c/respec/pull/1087) ([marcoscaceres](https://github.com/marcoscaceres))
- fix\(respec2.css\): adapt better to mobile \(closes \#755\) [\#1086](https://github.com/w3c/respec/pull/1086) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.8](https://github.com/w3c/respec/tree/v10.1.8) (2017-02-16)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.7...v10.1.8)

**Implemented enhancements:**

- ARIA landmarks are not quite correct [\#304](https://github.com/w3c/respec/issues/304)
- Add a template for use cases [\#60](https://github.com/w3c/respec/issues/60)

**Closed issues:**

- Support JSON-LD as document linked data container [\#671](https://github.com/w3c/respec/issues/671)
- Investigate using preload for css, scripts, etc [\#663](https://github.com/w3c/respec/issues/663)
- Subtitles should not use h2 [\#423](https://github.com/w3c/respec/issues/423)

**Merged pull requests:**

- fix\(biblio\): output spec title first \(closes \#857\) [\#1083](https://github.com/w3c/respec/pull/1083) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.7](https://github.com/w3c/respec/tree/v10.1.7) (2017-02-14)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.6...v10.1.7)

## [v10.1.6](https://github.com/w3c/respec/tree/v10.1.6) (2017-02-14)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.5...v10.1.6)

## [v10.1.5](https://github.com/w3c/respec/tree/v10.1.5) (2017-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.4...v10.1.5)

## [v10.1.4](https://github.com/w3c/respec/tree/v10.1.4) (2017-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.3...v10.1.4)

**Closed issues:**

- stop FOUC [\#326](https://github.com/w3c/respec/issues/326)

**Merged pull requests:**

- fix: Reduce FOUC \(closes \#326\) [\#1079](https://github.com/w3c/respec/pull/1079) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.1.3](https://github.com/w3c/respec/tree/v10.1.3) (2017-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.2...v10.1.3)

## [v10.1.2](https://github.com/w3c/respec/tree/v10.1.2) (2017-02-13)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.1...v10.1.2)

## [v10.1.1](https://github.com/w3c/respec/tree/v10.1.1) (2017-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v10.1.0...v10.1.1)

## [v10.1.0](https://github.com/w3c/respec/tree/v10.1.0) (2017-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v10.0.4...v10.1.0)

**Implemented enhancements:**

- ReSpec warn on section-less headers [\#422](https://github.com/w3c/respec/issues/422)
- core/inlines could use Ranges [\#378](https://github.com/w3c/respec/issues/378)

**Fixed bugs:**

- Don't \<code\> links unless the text matches. [\#441](https://github.com/w3c/respec/issues/441)

**Closed issues:**

- Move Markdown parsing off main thread [\#1070](https://github.com/w3c/respec/issues/1070)
- Crash during ui.show\(\) [\#952](https://github.com/w3c/respec/issues/952)
- Deprecate ED status and edDraftURI [\#809](https://github.com/w3c/respec/issues/809)
- scroll-to can happen BEFORE respec is really done [\#452](https://github.com/w3c/respec/issues/452)
- Including a common glossary across multiple documents [\#404](https://github.com/w3c/respec/issues/404)
- Links to IDL entities should land on \<section\> describing the entity [\#330](https://github.com/w3c/respec/issues/330)

**Merged pull requests:**

- fix\(core/link-to-dfn\): no \<code\> link if no IDL text match \(closes \#441\) [\#1078](https://github.com/w3c/respec/pull/1078) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.0.4](https://github.com/w3c/respec/tree/v10.0.4) (2017-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v10.0.3...v10.0.4)

**Merged pull requests:**

- Few more improvements to markdown handling [\#1077](https://github.com/w3c/respec/pull/1077) ([marcoscaceres](https://github.com/marcoscaceres))
- style: code style fixes [\#1076](https://github.com/w3c/respec/pull/1076) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.0.3](https://github.com/w3c/respec/tree/v10.0.3) (2017-02-10)
[Full Changelog](https://github.com/w3c/respec/compare/v10.0.2...v10.0.3)

**Merged pull requests:**

- Fix more Markdown madness :\) [\#1075](https://github.com/w3c/respec/pull/1075) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.0.2](https://github.com/w3c/respec/tree/v10.0.2) (2017-02-10)
[Full Changelog](https://github.com/w3c/respec/compare/v10.0.1...v10.0.2)

**Merged pull requests:**

- fix\(core/utils\): be more careful about chopping whitespace [\#1074](https://github.com/w3c/respec/pull/1074) ([marcoscaceres](https://github.com/marcoscaceres))

## [v10.0.1](https://github.com/w3c/respec/tree/v10.0.1) (2017-02-10)
[Full Changelog](https://github.com/w3c/respec/compare/v10.0.0...v10.0.1)

**Merged pull requests:**

- fix\(core/utils\): fix markdown edge cases [\#1073](https://github.com/w3c/respec/pull/1073) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.25.0 🚀 [\#1072](https://github.com/w3c/respec/pull/1072) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v10.0.0](https://github.com/w3c/respec/tree/v10.0.0) (2017-02-08)
[Full Changelog](https://github.com/w3c/respec/compare/v9.2.0...v10.0.0)

**Merged pull requests:**

- fix\(core/markdown\): elements are not corrently positioned [\#1071](https://github.com/w3c/respec/pull/1071) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: significantly improve ARIA support [\#1065](https://github.com/w3c/respec/pull/1065) ([marcoscaceres](https://github.com/marcoscaceres))
- Allow additional logo in CG spec [\#821](https://github.com/w3c/respec/pull/821) ([nickevansuk](https://github.com/nickevansuk))

## [v9.2.0](https://github.com/w3c/respec/tree/v9.2.0) (2017-02-08)
[Full Changelog](https://github.com/w3c/respec/compare/v9.1.0...v9.2.0)

**Closed issues:**

- Create Turtle syntax highlighter for highlight.js [\#1063](https://github.com/w3c/respec/issues/1063)

**Merged pull requests:**

- webidl2@2.2.2 breaks build 🚨 [\#1069](https://github.com/w3c/respec/pull/1069) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v9.1.0](https://github.com/w3c/respec/tree/v9.1.0) (2017-02-02)
[Full Changelog](https://github.com/w3c/respec/compare/v9.0.0...v9.1.0)

**Merged pull requests:**

- feat\(core/markdown\): allow syntax highlight off main thread [\#1066](https://github.com/w3c/respec/pull/1066) ([marcoscaceres](https://github.com/marcoscaceres))

## [v9.0.0](https://github.com/w3c/respec/tree/v9.0.0) (2017-02-01)
[Full Changelog](https://github.com/w3c/respec/compare/v8.9.0...v9.0.0)

**Closed issues:**

- Deprecate XHTML 1.0 export [\#760](https://github.com/w3c/respec/issues/760)

**Merged pull requests:**

- perf\(core/include-config\): add script after end-all [\#1062](https://github.com/w3c/respec/pull/1062) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(save-html\): remove XHTML 1.0 save support [\#762](https://github.com/w3c/respec/pull/762) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.9.0](https://github.com/w3c/respec/tree/v8.9.0) (2017-02-01)
[Full Changelog](https://github.com/w3c/respec/compare/v8.8.0...v8.9.0)

## [v8.8.0](https://github.com/w3c/respec/tree/v8.8.0) (2017-02-01)
[Full Changelog](https://github.com/w3c/respec/compare/v8.7.1...v8.8.0)

**Implemented enhancements:**

- Move syntax highlight to web worker.  [\#964](https://github.com/w3c/respec/issues/964)

**Closed issues:**

- data-cite values are case-sensitive [\#1047](https://github.com/w3c/respec/issues/1047)
- Documentation/wiki: example for `data-merge` [\#1036](https://github.com/w3c/respec/issues/1036)

**Merged pull requests:**

- feat\(core/highlight\): allow highlighting code blocks [\#1061](https://github.com/w3c/respec/pull/1061) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: do syntax highlighting in web worker \(closes \#964\) [\#1060](https://github.com/w3c/respec/pull/1060) ([marcoscaceres](https://github.com/marcoscaceres))
- Update command-line-args to version 4.0.0 🚀 [\#1059](https://github.com/w3c/respec/pull/1059) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.24.6 🚀 [\#1056](https://github.com/w3c/respec/pull/1056) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.24.5 🚀 [\#1053](https://github.com/w3c/respec/pull/1053) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- tests: run karma against build instead [\#1049](https://github.com/w3c/respec/pull/1049) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.7.1](https://github.com/w3c/respec/tree/v8.7.1) (2017-01-18)
[Full Changelog](https://github.com/w3c/respec/compare/v8.7.0...v8.7.1)

**Merged pull requests:**

- fix\(core/link-to-dfn\): clean up after deferred linking [\#1048](https://github.com/w3c/respec/pull/1048) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.7.0](https://github.com/w3c/respec/tree/v8.7.0) (2017-01-17)
[Full Changelog](https://github.com/w3c/respec/compare/v8.6.0...v8.7.0)

**Merged pull requests:**

- feat: enable data-cite on dfn [\#1046](https://github.com/w3c/respec/pull/1046) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.6.0](https://github.com/w3c/respec/tree/v8.6.0) (2017-01-17)
[Full Changelog](https://github.com/w3c/respec/compare/v8.5.0...v8.6.0)

**Closed issues:**

- Non lowercase-only overloaded operations not detected [\#1042](https://github.com/w3c/respec/issues/1042)

**Merged pull requests:**

- feat\(webidl-contiguous\): no-link-warnings disables idl link warnings \(closes \#1027\) [\#1045](https://github.com/w3c/respec/pull/1045) ([marcoscaceres](https://github.com/marcoscaceres))
- Update command-line-usage to version 4.0.0 🚀 [\#1044](https://github.com/w3c/respec/pull/1044) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Search in lowercase for overloaded operations [\#1043](https://github.com/w3c/respec/pull/1043) ([dontcallmedom](https://github.com/dontcallmedom))
- fix\(template/headers\): Delete link to translations page \(closes \#983\) [\#1041](https://github.com/w3c/respec/pull/1041) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.5.0](https://github.com/w3c/respec/tree/v8.5.0) (2017-01-16)
[Full Changelog](https://github.com/w3c/respec/compare/v8.4.2...v8.5.0)

**Fixed bugs:**

- Allow linking to fully qualified method name [\#1024](https://github.com/w3c/respec/issues/1024)

**Closed issues:**

- Allow preProcess, postProcess, afterAll to await promises [\#1034](https://github.com/w3c/respec/issues/1034)

**Merged pull requests:**

- fix\(webidl-contiguous\): allow linking to Parent.method\(\) \(fixes \#1024\) [\#1040](https://github.com/w3c/respec/pull/1040) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: allow async functions for pre/postProc/afterAll \(closes \#1034\) [\#1038](https://github.com/w3c/respec/pull/1038) ([marcoscaceres](https://github.com/marcoscaceres))
- karma@1.4.0 breaks build 🚨 [\#1037](https://github.com/w3c/respec/pull/1037) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v8.4.2](https://github.com/w3c/respec/tree/v8.4.2) (2017-01-14)
[Full Changelog](https://github.com/w3c/respec/compare/v8.4.1...v8.4.2)

**Fixed bugs:**

- Support markdown includes [\#993](https://github.com/w3c/respec/issues/993)

**Merged pull requests:**

- Update snyk to version 1.24.4 🚀 [\#1033](https://github.com/w3c/respec/pull/1033) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.24.3 🚀 [\#1032](https://github.com/w3c/respec/pull/1032) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Use lowercase when linking to enum values [\#1029](https://github.com/w3c/respec/pull/1029) ([dontcallmedom](https://github.com/dontcallmedom))

## [v8.4.1](https://github.com/w3c/respec/tree/v8.4.1) (2017-01-10)
[Full Changelog](https://github.com/w3c/respec/compare/v8.4.0...v8.4.1)

## [v8.4.0](https://github.com/w3c/respec/tree/v8.4.0) (2017-01-10)
[Full Changelog](https://github.com/w3c/respec/compare/v8.3.0...v8.4.0)

## [v8.3.0](https://github.com/w3c/respec/tree/v8.3.0) (2017-01-10)
[Full Changelog](https://github.com/w3c/respec/compare/v8.2.0...v8.3.0)

**Fixed bugs:**

- Support linking `method\(\)` name in webIDL [\#1000](https://github.com/w3c/respec/issues/1000)
- Link enum when empty string [\#981](https://github.com/w3c/respec/issues/981)

**Merged pull requests:**

- feat\(webidl-contiguous\): link method\(\) and enum "" [\#1023](https://github.com/w3c/respec/pull/1023) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.23.3 🚀 [\#1022](https://github.com/w3c/respec/pull/1022) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v8.2.0](https://github.com/w3c/respec/tree/v8.2.0) (2017-01-09)
[Full Changelog](https://github.com/w3c/respec/compare/v8.1.0...v8.2.0)

**Implemented enhancements:**

- don't include fixup.js when noToC is set [\#985](https://github.com/w3c/respec/issues/985)

**Fixed bugs:**

- don't include fixup.js when noToC is set [\#985](https://github.com/w3c/respec/issues/985)

## [v8.1.0](https://github.com/w3c/respec/tree/v8.1.0) (2017-01-08)
[Full Changelog](https://github.com/w3c/respec/compare/v8.0.1...v8.1.0)

**Closed issues:**

- Respec seems to be breaking styles and reference links in multiple specs [\#1010](https://github.com/w3c/respec/issues/1010)

**Merged pull requests:**

- refactor: convert various modules to ES6 [\#1021](https://github.com/w3c/respec/pull/1021) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.23.2 🚀 [\#1019](https://github.com/w3c/respec/pull/1019) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- 🎄 Goodies [\#1018](https://github.com/w3c/respec/pull/1018) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.23.1 🚀 [\#1015](https://github.com/w3c/respec/pull/1015) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.23.0 🚀 [\#1014](https://github.com/w3c/respec/pull/1014) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v8.0.1](https://github.com/w3c/respec/tree/v8.0.1) (2017-01-03)
[Full Changelog](https://github.com/w3c/respec/compare/v8.0.0...v8.0.1)

**Merged pull requests:**

- fix: hot fixes to various bugs [\#1011](https://github.com/w3c/respec/pull/1011) ([marcoscaceres](https://github.com/marcoscaceres))

## [v8.0.0](https://github.com/w3c/respec/tree/v8.0.0) (2016-12-30)
[Full Changelog](https://github.com/w3c/respec/compare/v7.3.2...v8.0.0)

**Closed issues:**

- Drop warnings about missing \<dfn\> for "definition" names \(interface, enum, etc.\)? [\#997](https://github.com/w3c/respec/issues/997)

**Merged pull requests:**

- refactor\(core/inlines\): use Sets object for references [\#1009](https://github.com/w3c/respec/pull/1009) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(data-cite\): add support for data-cite attribute [\#1008](https://github.com/w3c/respec/pull/1008) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(core/dfn\): unjquery as much as possible [\#1007](https://github.com/w3c/respec/pull/1007) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(default-root-attr\): unjquery, run sync [\#1006](https://github.com/w3c/respec/pull/1006) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(data-transform\): unjquery [\#1005](https://github.com/w3c/respec/pull/1005) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.3.2](https://github.com/w3c/respec/tree/v7.3.2) (2016-12-29)
[Full Changelog](https://github.com/w3c/respec/compare/v7.3.1...v7.3.2)

**Merged pull requests:**

- Unjquery data-include [\#1004](https://github.com/w3c/respec/pull/1004) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.3.1](https://github.com/w3c/respec/tree/v7.3.1) (2016-12-23)
[Full Changelog](https://github.com/w3c/respec/compare/v7.3.0...v7.3.1)

## [v7.3.0](https://github.com/w3c/respec/tree/v7.3.0) (2016-12-23)
[Full Changelog](https://github.com/w3c/respec/compare/v7.2.3...v7.3.0)

**Merged pull requests:**

- feat\(highlight\): add JSON support [\#1003](https://github.com/w3c/respec/pull/1003) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.2.3](https://github.com/w3c/respec/tree/v7.2.3) (2016-12-23)
[Full Changelog](https://github.com/w3c/respec/compare/v7.2.2...v7.2.3)

## [v7.2.2](https://github.com/w3c/respec/tree/v7.2.2) (2016-12-23)
[Full Changelog](https://github.com/w3c/respec/compare/v7.2.1...v7.2.2)

**Fixed bugs:**

- Exclude trying to link to maplike and setlike  [\#996](https://github.com/w3c/respec/issues/996)

**Closed issues:**

- Tool to convert old school webidl to new school webidl [\#864](https://github.com/w3c/respec/issues/864)

**Merged pull requests:**

- fix\(webidl-contiguous\): don't link special IDL things \(closes \#996\) [\#1001](https://github.com/w3c/respec/pull/1001) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.2.1](https://github.com/w3c/respec/tree/v7.2.1) (2016-12-22)
[Full Changelog](https://github.com/w3c/respec/compare/v7.2.0...v7.2.1)

## [v7.2.0](https://github.com/w3c/respec/tree/v7.2.0) (2016-12-22)
[Full Changelog](https://github.com/w3c/respec/compare/v7.1.1...v7.2.0)

## [v7.1.1](https://github.com/w3c/respec/tree/v7.1.1) (2016-12-22)
[Full Changelog](https://github.com/w3c/respec/compare/v7.1.0...v7.1.1)

**Merged pull requests:**

- fix\(profile-w3c-common\): do includes before markdown proc \(closes \#993\) [\#994](https://github.com/w3c/respec/pull/994) ([marcoscaceres](https://github.com/marcoscaceres))
- Add IDL-index support \(closes \#159\) [\#990](https://github.com/w3c/respec/pull/990) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.1.0](https://github.com/w3c/respec/tree/v7.1.0) (2016-12-20)
[Full Changelog](https://github.com/w3c/respec/compare/v7.0.0...v7.1.0)

**Implemented enhancements:**

- Nudging/warnings/prompts for Privacy and Security Considerations sections [\#539](https://github.com/w3c/respec/issues/539)

**Fixed bugs:**

- Nullable promise parameter not parsed correctly [\#390](https://github.com/w3c/respec/issues/390)

**Closed issues:**

- Error trying to install a local copy of Respec [\#992](https://github.com/w3c/respec/issues/992)
- Warn when IDL members don't have a dfn [\#935](https://github.com/w3c/respec/issues/935)
- Add interface summary to appendix [\#159](https://github.com/w3c/respec/issues/159)

**Merged pull requests:**

- Update snyk to version 1.22.1 🚀 [\#995](https://github.com/w3c/respec/pull/995) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- feat\(webidl-contiguous\): Warn if IDL member lacks dfn \(closes \#935\) [\#991](https://github.com/w3c/respec/pull/991) ([marcoscaceres](https://github.com/marcoscaceres))

## [v7.0.0](https://github.com/w3c/respec/tree/v7.0.0) (2016-12-12)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.5...v7.0.0)

**Closed issues:**

- Precompile templates [\#233](https://github.com/w3c/respec/issues/233)

**Merged pull requests:**

- perf: compile handlebars templates \(closes \#233\) [\#988](https://github.com/w3c/respec/pull/988) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor\(examples\): use new school WebIDL [\#987](https://github.com/w3c/respec/pull/987) ([marcoscaceres](https://github.com/marcoscaceres))
- karma-jasmine@1.1.0 breaks build 🚨 [\#986](https://github.com/w3c/respec/pull/986) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Remove ye olde idl [\#984](https://github.com/w3c/respec/pull/984) ([marcoscaceres](https://github.com/marcoscaceres))

## [v6.1.5](https://github.com/w3c/respec/tree/v6.1.5) (2016-11-30)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.4...v6.1.5)

**Fixed bugs:**

- \[respecDocWriter\] electron not closed properly if the document doesn't exist or is not a respec document [\#977](https://github.com/w3c/respec/pull/977) ([deniak](https://github.com/deniak))

**Merged pull requests:**

- Update snyk to version 1.21.2 🚀 [\#980](https://github.com/w3c/respec/pull/980) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.21.1 🚀 [\#979](https://github.com/w3c/respec/pull/979) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.20.0 🚀 [\#974](https://github.com/w3c/respec/pull/974) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Fix using karma-edge-launcher on local tests [\#963](https://github.com/w3c/respec/pull/963) ([nickmccurdy](https://github.com/nickmccurdy))

## [v6.1.4](https://github.com/w3c/respec/tree/v6.1.4) (2016-11-17)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.3...v6.1.4)

**Implemented enhancements:**

- Updated W3C translations link [\#973](https://github.com/w3c/respec/pull/973) ([plehegar](https://github.com/plehegar))

## [v6.1.3](https://github.com/w3c/respec/tree/v6.1.3) (2016-11-17)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.2...v6.1.3)

**Fixed bugs:**

- Travis and git+ssh: github uris [\#972](https://github.com/w3c/respec/issues/972)

## [v6.1.2](https://github.com/w3c/respec/tree/v6.1.2) (2016-11-10)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.1...v6.1.2)

**Merged pull requests:**

- Update fs-promise to version 1.0.0 🚀 [\#968](https://github.com/w3c/respec/pull/968) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- karma-detect-browsers@2.2.2 breaks build 🚨 [\#967](https://github.com/w3c/respec/pull/967) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v6.1.1](https://github.com/w3c/respec/tree/v6.1.1) (2016-11-08)
[Full Changelog](https://github.com/w3c/respec/compare/v6.1.0...v6.1.1)

## [v6.1.0](https://github.com/w3c/respec/tree/v6.1.0) (2016-11-04)
[Full Changelog](https://github.com/w3c/respec/compare/v6.0.2...v6.1.0)

**Fixed bugs:**

- Deprecate lc related things [\#953](https://github.com/w3c/respec/issues/953)

**Closed issues:**

- "Unable to test GitHub repository" on Snyk site [\#960](https://github.com/w3c/respec/issues/960)
- Example style gets broken [\#958](https://github.com/w3c/respec/issues/958)
- Make copydeps.sh Windows compatible [\#954](https://github.com/w3c/respec/issues/954)
- Add developers guide [\#931](https://github.com/w3c/respec/issues/931)
- Ol' school web idl deprecation warning is pointing to wrong palce [\#874](https://github.com/w3c/respec/issues/874)
- User's guide needs cleanup [\#858](https://github.com/w3c/respec/issues/858)
- About ReSpec should use package.json [\#642](https://github.com/w3c/respec/issues/642)

**Merged pull requests:**

- BREAKING CHANGE: remove LC as status \(closes \#953\) [\#962](https://github.com/w3c/respec/pull/962) ([marcoscaceres](https://github.com/marcoscaceres))
- Use http-server in the start and server scripts [\#961](https://github.com/w3c/respec/pull/961) ([nickmccurdy](https://github.com/nickmccurdy))
- Fixes for Windows testing [\#959](https://github.com/w3c/respec/pull/959) ([nickmccurdy](https://github.com/nickmccurdy))
- refactor\(copydeps\): convert to nodejs script \(closes \#954\) [\#957](https://github.com/w3c/respec/pull/957) ([marcoscaceres](https://github.com/marcoscaceres))
- Style optimization [\#955](https://github.com/w3c/respec/pull/955) ([marcoscaceres](https://github.com/marcoscaceres))

## [v6.0.2](https://github.com/w3c/respec/tree/v6.0.2) (2016-10-31)
[Full Changelog](https://github.com/w3c/respec/compare/v6.0.1...v6.0.2)

**Merged pull requests:**

- fix\(save-html\): buttonCSS variable was undefined [\#956](https://github.com/w3c/respec/pull/956) ([marcoscaceres](https://github.com/marcoscaceres))

## [v6.0.1](https://github.com/w3c/respec/tree/v6.0.1) (2016-10-31)
[Full Changelog](https://github.com/w3c/respec/compare/v6.0.0...v6.0.1)

**Closed issues:**

- Using respec for non-w3c specs [\#950](https://github.com/w3c/respec/issues/950)
- Safari no longer rendering ReSpec and gives an error [\#949](https://github.com/w3c/respec/issues/949)

**Merged pull requests:**

- feat\(.travis.yml\): use yarn instead of npm for install [\#947](https://github.com/w3c/respec/pull/947) ([marcoscaceres](https://github.com/marcoscaceres))
- Update epipebomb to version 1.0.0 🚀 [\#946](https://github.com/w3c/respec/pull/946) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v6.0.0](https://github.com/w3c/respec/tree/v6.0.0) (2016-10-12)
[Full Changelog](https://github.com/w3c/respec/compare/v5.1.0...v6.0.0)

**Merged pull requests:**

- feat\(ui\): update ReSpec UI  [\#944](https://github.com/w3c/respec/pull/944) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(async.js\): add marcosc-async as dep [\#943](https://github.com/w3c/respec/pull/943) ([marcoscaceres](https://github.com/marcoscaceres))
- feat\(respect2.css\): add new UI styles [\#942](https://github.com/w3c/respec/pull/942) ([marcoscaceres](https://github.com/marcoscaceres))
- refactor: use uglify-harmony in build process [\#941](https://github.com/w3c/respec/pull/941) ([marcoscaceres](https://github.com/marcoscaceres))

## [v5.1.0](https://github.com/w3c/respec/tree/v5.1.0) (2016-10-12)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.5...v5.1.0)

**Merged pull requests:**

- Allow configurable canonical URIs for documents [\#938](https://github.com/w3c/respec/pull/938) ([dontcallmedom](https://github.com/dontcallmedom))

## [v5.0.5](https://github.com/w3c/respec/tree/v5.0.5) (2016-10-12)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.4...v5.0.5)

## [v5.0.4](https://github.com/w3c/respec/tree/v5.0.4) (2016-09-21)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.3...v5.0.4)

**Closed issues:**

- Respec2html could provide better feedback [\#933](https://github.com/w3c/respec/issues/933)
- respec-w3c-common  has a bug [\#928](https://github.com/w3c/respec/issues/928)

**Merged pull requests:**

- Better error reporting [\#934](https://github.com/w3c/respec/pull/934) ([marcoscaceres](https://github.com/marcoscaceres))

## [v5.0.3](https://github.com/w3c/respec/tree/v5.0.3) (2016-09-20)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.2...v5.0.3)

## [v5.0.2](https://github.com/w3c/respec/tree/v5.0.2) (2016-09-20)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.1...v5.0.2)

**Closed issues:**

- respecIsReady is not documented [\#930](https://github.com/w3c/respec/issues/930)

**Merged pull requests:**

- jasmine-core@2.5.2 breaks build 🚨 [\#932](https://github.com/w3c/respec/pull/932) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- moment@2.15.0 breaks build 🚨 [\#929](https://github.com/w3c/respec/pull/929) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v5.0.1](https://github.com/w3c/respec/tree/v5.0.1) (2016-09-01)
[Full Changelog](https://github.com/w3c/respec/compare/v5.0.0...v5.0.1)

**Implemented enhancements:**

- Auto Conformance section - words are not complete [\#927](https://github.com/w3c/respec/issues/927)

**Fixed bugs:**

- Auto Conformance section - words are not complete [\#927](https://github.com/w3c/respec/issues/927)

**Merged pull requests:**

- Update snyk to version 1.19.1 🚀 [\#926](https://github.com/w3c/respec/pull/926) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.18.1 🚀 [\#922](https://github.com/w3c/respec/pull/922) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-chrome-launcher to version 2.0.0 🚀 [\#920](https://github.com/w3c/respec/pull/920) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v5.0.0](https://github.com/w3c/respec/tree/v5.0.0) (2016-08-16)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.5...v5.0.0)

**Closed issues:**

- CG specs should not require a mailing list [\#918](https://github.com/w3c/respec/issues/918)
- Remove dead code [\#801](https://github.com/w3c/respec/issues/801)

**Merged pull requests:**

- refactor\(utils\): ownerSwapper only takes Nodes \(close \#801\) [\#917](https://github.com/w3c/respec/pull/917) ([marcoscaceres](https://github.com/marcoscaceres))

## [v4.4.5](https://github.com/w3c/respec/tree/v4.4.5) (2016-08-12)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.4...v4.4.5)

**Closed issues:**

- Drop promise poly [\#751](https://github.com/w3c/respec/issues/751)

**Merged pull requests:**

- feat: remove promise polyfill \(close \#751\) [\#916](https://github.com/w3c/respec/pull/916) ([marcoscaceres](https://github.com/marcoscaceres))

## [v4.4.4](https://github.com/w3c/respec/tree/v4.4.4) (2016-08-12)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.3...v4.4.4)

## [v4.4.3](https://github.com/w3c/respec/tree/v4.4.3) (2016-08-12)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.2...v4.4.3)

**Fixed bugs:**

- define where vocabulary in webidl should link [\#910](https://github.com/w3c/respec/issues/910)

**Closed issues:**

- https not used for patent links [\#914](https://github.com/w3c/respec/issues/914)
- support `data-for` attribute for WebIDL [\#863](https://github.com/w3c/respec/issues/863)
- Need WebIDL docs [\#847](https://github.com/w3c/respec/issues/847)
- Include lodash [\#747](https://github.com/w3c/respec/issues/747)

## [v4.4.2](https://github.com/w3c/respec/tree/v4.4.2) (2016-08-10)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.1...v4.4.2)

**Merged pull requests:**

- More Japanese boilerplate text for l10n.js [\#913](https://github.com/w3c/respec/pull/913) ([r12a](https://github.com/r12a))

## [v4.4.1](https://github.com/w3c/respec/tree/v4.4.1) (2016-08-08)
[Full Changelog](https://github.com/w3c/respec/compare/v4.4.0...v4.4.1)

**Closed issues:**

- msg should only be included as needed.  [\#746](https://github.com/w3c/respec/issues/746)
- TR CSS versioning into the document? [\#552](https://github.com/w3c/respec/issues/552)

## [v4.4.0](https://github.com/w3c/respec/tree/v4.4.0) (2016-08-05)
[Full Changelog](https://github.com/w3c/respec/compare/v4.3.4...v4.4.0)

**Implemented enhancements:**

- Linter should check editors and authors URLs [\#901](https://github.com/w3c/respec/issues/901)
- Changed TOC requirements [\#835](https://github.com/w3c/respec/issues/835)

**Fixed bugs:**

- specberus issuing a warning on respec output [\#831](https://github.com/w3c/respec/issues/831)

**Closed issues:**

- lint option is not documented [\#885](https://github.com/w3c/respec/issues/885)

**Merged pull requests:**

- feat: use ol in ToC \(closes \#835\) [\#909](https://github.com/w3c/respec/pull/909) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.18.0 🚀 [\#908](https://github.com/w3c/respec/pull/908) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v4.3.4](https://github.com/w3c/respec/tree/v4.3.4) (2016-08-04)
[Full Changelog](https://github.com/w3c/respec/compare/v4.3.3...v4.3.4)

**Merged pull requests:**

- Ensure respec2html doesn't cache old respec versions in long-running processes [\#903](https://github.com/w3c/respec/pull/903) ([dontcallmedom](https://github.com/dontcallmedom))

## [v4.3.3](https://github.com/w3c/respec/tree/v4.3.3) (2016-08-03)
[Full Changelog](https://github.com/w3c/respec/compare/v4.3.2...v4.3.3)

**Implemented enhancements:**

- Build scripts hardcode location of node [\#899](https://github.com/w3c/respec/issues/899)

**Merged pull requests:**

- fix: generalize nodejs location \(closes \#899\) [\#902](https://github.com/w3c/respec/pull/902) ([marcoscaceres](https://github.com/marcoscaceres))

## [v4.3.2](https://github.com/w3c/respec/tree/v4.3.2) (2016-08-02)
[Full Changelog](https://github.com/w3c/respec/compare/v4.3.1...v4.3.2)

**Fixed bugs:**

- Inserted stylesheets move charset declaration too far down [\#791](https://github.com/w3c/respec/issues/791)

**Merged pull requests:**

- Move charset declaration at the top when saving [\#898](https://github.com/w3c/respec/pull/898) ([dontcallmedom](https://github.com/dontcallmedom))

## [v4.3.1](https://github.com/w3c/respec/tree/v4.3.1) (2016-08-02)
[Full Changelog](https://github.com/w3c/respec/compare/v4.3.0...v4.3.1)

**Merged pull requests:**

- Update l10n.js [\#897](https://github.com/w3c/respec/pull/897) ([r12a](https://github.com/r12a))
- Update mocha to version 3.0.0 🚀 [\#896](https://github.com/w3c/respec/pull/896) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v4.3.0](https://github.com/w3c/respec/tree/v4.3.0) (2016-08-01)
[Full Changelog](https://github.com/w3c/respec/compare/v4.1.2...v4.3.0)

**Implemented enhancements:**

- Add ReSpec version when generating [\#805](https://github.com/w3c/respec/issues/805)

**Closed issues:**

- Support for https in /TR [\#749](https://github.com/w3c/respec/issues/749)

**Merged pull requests:**

- karma-mocha-reporter@2.1.0 breaks build 🚨 [\#895](https://github.com/w3c/respec/pull/895) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.17.5 🚀 [\#894](https://github.com/w3c/respec/pull/894) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- karma-mocha-reporter@2.0.5 breaks build 🚨 [\#892](https://github.com/w3c/respec/pull/892) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.17.4 🚀 [\#891](https://github.com/w3c/respec/pull/891) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.17.3 🚀 [\#890](https://github.com/w3c/respec/pull/890) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- karma@1.1.2 breaks build 🚨 [\#889](https://github.com/w3c/respec/pull/889) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.17.2 🚀 [\#888](https://github.com/w3c/respec/pull/888) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- feat\(save-html\): Add meta tag generator \(closes \#805\) [\#887](https://github.com/w3c/respec/pull/887) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(global\): link to HTTPS urls \(closes \#749\) [\#782](https://github.com/w3c/respec/pull/782) ([marcoscaceres](https://github.com/marcoscaceres))

## [v4.1.2](https://github.com/w3c/respec/tree/v4.1.2) (2016-07-21)
[Full Changelog](https://github.com/w3c/respec/compare/v4.1.1...v4.1.2)

**Fixed bugs:**

- More granular styles for "table.simple th code" with better legibility/contrast [\#877](https://github.com/w3c/respec/issues/877)

**Closed issues:**

- Change fugly-looking styling in .parameters th and .exceptions th? [\#882](https://github.com/w3c/respec/issues/882)

**Merged pull requests:**

- increase contrast for .parameters th and .exceptions th text [\#883](https://github.com/w3c/respec/pull/883) ([patrickhlauke](https://github.com/patrickhlauke))
- Update promise-polyfill to version 6.0.0 🚀 [\#881](https://github.com/w3c/respec/pull/881) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- fix\(respec2.css\): th code inherit color \(closes \#877\) [\#880](https://github.com/w3c/respec/pull/880) ([marcoscaceres](https://github.com/marcoscaceres))
- Update snyk to version 1.17.1 🚀 [\#876](https://github.com/w3c/respec/pull/876) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Deprecation warning should point to wiki [\#875](https://github.com/w3c/respec/pull/875) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix figures so more than one link can be made to figures [\#822](https://github.com/w3c/respec/pull/822) ([nickevansuk](https://github.com/nickevansuk))

## [v4.1.1](https://github.com/w3c/respec/tree/v4.1.1) (2016-07-14)
[Full Changelog](https://github.com/w3c/respec/compare/v4.1.0...v4.1.1)

## [v4.1.0](https://github.com/w3c/respec/tree/v4.1.0) (2016-07-14)
[Full Changelog](https://github.com/w3c/respec/compare/v4.0.2...v4.1.0)

**Fixed bugs:**

- Warning still pointing to guide [\#869](https://github.com/w3c/respec/issues/869)

**Closed issues:**

- Deprecate data-include-sync [\#844](https://github.com/w3c/respec/issues/844)
- Warn if URLs are not TLS [\#814](https://github.com/w3c/respec/issues/814)
- \*URI options [\#810](https://github.com/w3c/respec/issues/810)

**Merged pull requests:**

- Support iterable for contiguous IDL [\#871](https://github.com/w3c/respec/pull/871) ([mwatson2](https://github.com/mwatson2))
- Changed warning pointer for use of @title. [\#870](https://github.com/w3c/respec/pull/870) ([halindrome](https://github.com/halindrome))
- feat\(linter\): Respec linter [\#866](https://github.com/w3c/respec/pull/866) ([marcoscaceres](https://github.com/marcoscaceres))

## [v4.0.2](https://github.com/w3c/respec/tree/v4.0.2) (2016-07-13)
[Full Changelog](https://github.com/w3c/respec/compare/v4.0.1...v4.0.2)

**Closed issues:**

- ToC characters seem messed up [\#867](https://github.com/w3c/respec/issues/867)
- Check on function in utils.toESIterable makes spec loading with jsdom fail [\#861](https://github.com/w3c/respec/issues/861)

**Merged pull requests:**

- async@2.0.0 breaks build 🚨 [\#868](https://github.com/w3c/respec/pull/868) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- fix\(utils\): toESIterable jsdom compat \(closes \#861\) [\#865](https://github.com/w3c/respec/pull/865) ([marcoscaceres](https://github.com/marcoscaceres))
- nightmare@2.5.3 breaks build 🚨 [\#862](https://github.com/w3c/respec/pull/862) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update snyk to version 1.17.0 🚀 [\#860](https://github.com/w3c/respec/pull/860) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v4.0.1](https://github.com/w3c/respec/tree/v4.0.1) (2016-07-04)
[Full Changelog](https://github.com/w3c/respec/compare/v4.0.0...v4.0.1)

**Merged pull requests:**

- moment@2.14.1 breaks build 🚨 [\#856](https://github.com/w3c/respec/pull/856) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- fix\(tests\): prevent FF from timing out [\#855](https://github.com/w3c/respec/pull/855) ([marcoscaceres](https://github.com/marcoscaceres))
- Update marcosc-async to version 3.0.0 🚀 [\#854](https://github.com/w3c/respec/pull/854) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- moment@2.14.0 breaks build 🚨 [\#853](https://github.com/w3c/respec/pull/853) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- jscs@3.0.6 breaks build 🚨 [\#850](https://github.com/w3c/respec/pull/850) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update marcosc-async to version 2.0.3 🚀 [\#849](https://github.com/w3c/respec/pull/849) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v4.0.0](https://github.com/w3c/respec/tree/v4.0.0) (2016-06-29)
[Full Changelog](https://github.com/w3c/respec/compare/v3.4.0...v4.0.0)

**Merged pull requests:**

- feat\(data-include\): deprecate data-include-sync [\#845](https://github.com/w3c/respec/pull/845) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.4.0](https://github.com/w3c/respec/tree/v3.4.0) (2016-06-28)
[Full Changelog](https://github.com/w3c/respec/compare/v3.3.3...v3.4.0)

**Merged pull requests:**

- command-line-usage@3.0.2 breaks build 🚨 [\#843](https://github.com/w3c/respec/pull/843) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Add CoC to project [\#842](https://github.com/w3c/respec/pull/842) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(w3c/style\): preload for css, scripts \(see \#663\) [\#838](https://github.com/w3c/respec/pull/838) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.3.3](https://github.com/w3c/respec/tree/v3.3.3) (2016-06-24)
[Full Changelog](https://github.com/w3c/respec/compare/v3.3.2...v3.3.3)

**Closed issues:**

- PSA: Disabled Appveyor [\#834](https://github.com/w3c/respec/issues/834)
- Investigate sym-linking depedencies [\#633](https://github.com/w3c/respec/issues/633)

**Merged pull requests:**

- Update snyk to version 1.16.0 🚀 [\#841](https://github.com/w3c/respec/pull/841) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma to version 1.0.0 🚀 [\#840](https://github.com/w3c/respec/pull/840) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- \[Snyk\] Fix for 1 vulnerable dependency path [\#839](https://github.com/w3c/respec/pull/839) ([snyk-bot](https://github.com/snyk-bot))
- jscs@3.0.5 breaks build 🚨 [\#837](https://github.com/w3c/respec/pull/837) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- jasmine-reporters@2.2.0 breaks build ⚠️ [\#833](https://github.com/w3c/respec/pull/833) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- chore\(deps\): move dependencies to js/deps \(closes \#633\) [\#832](https://github.com/w3c/respec/pull/832) ([marcoscaceres](https://github.com/marcoscaceres))
- Hljs update [\#830](https://github.com/w3c/respec/pull/830) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.3.2](https://github.com/w3c/respec/tree/v3.3.2) (2016-06-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.134...v3.3.2)

**Fixed bugs:**

- No URL decoding from URL params  [\#807](https://github.com/w3c/respec/issues/807)

**Merged pull requests:**

- Update jquery to version 3.0.0 🚀 [\#823](https://github.com/w3c/respec/pull/823) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Fix\(override-configuration\):decode URL params correctly \(closes \#807\) [\#816](https://github.com/w3c/respec/pull/816) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(respec2html\): upgrade to command-line-usage V3 [\#815](https://github.com/w3c/respec/pull/815) ([marcoscaceres](https://github.com/marcoscaceres))
- Changed default diff tool URI to use https [\#813](https://github.com/w3c/respec/pull/813) ([halindrome](https://github.com/halindrome))
- Update marcosc-async to version 2.0.0 🚀 [\#812](https://github.com/w3c/respec/pull/812) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v3.2.134](https://github.com/w3c/respec/tree/v3.2.134) (2016-06-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.133...v3.2.134)

**Fixed bugs:**

- Syntax highlighting issue for interfaces with a "Constructor" [\#806](https://github.com/w3c/respec/issues/806)

**Merged pull requests:**

- Dont hightlight idl [\#811](https://github.com/w3c/respec/pull/811) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.133](https://github.com/w3c/respec/tree/v3.2.133) (2016-06-01)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.132...v3.2.133)

**Merged pull requests:**

- Add forEach to iterable methods list [\#804](https://github.com/w3c/respec/pull/804) ([mwatson2](https://github.com/mwatson2))
- Update command-line-usage to version 3.0.1 🚀 [\#802](https://github.com/w3c/respec/pull/802) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))

## [v3.2.132](https://github.com/w3c/respec/tree/v3.2.132) (2016-05-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.131...v3.2.132)

**Merged pull requests:**

- nightmare@2.5.0 breaks build 🚨 [\#800](https://github.com/w3c/respec/pull/800) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Fix\(ui,utils\): firstElementChild not in Edge \(closes \#798\) [\#799](https://github.com/w3c/respec/pull/799) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.131](https://github.com/w3c/respec/tree/v3.2.131) (2016-05-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.129...v3.2.131)

**Fixed bugs:**

- firstElementChild is affecting MS Edge  [\#798](https://github.com/w3c/respec/issues/798)

**Merged pull requests:**

- Bug 791 charset [\#797](https://github.com/w3c/respec/pull/797) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.129](https://github.com/w3c/respec/tree/v3.2.129) (2016-05-26)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.128...v3.2.129)

**Fixed bugs:**

- Change to publish / subscribe has broken ARIA and related specs [\#793](https://github.com/w3c/respec/issues/793)
- Space appearing when quote is followed by element. [\#786](https://github.com/w3c/respec/issues/786)

**Merged pull requests:**

- Fix\(legacy\): Add messages for Aria/WebPayment specs \(closes \#793\) [\#795](https://github.com/w3c/respec/pull/795) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(save-html\) Space after \( when saving\(closes \#786\) [\#794](https://github.com/w3c/respec/pull/794) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.128](https://github.com/w3c/respec/tree/v3.2.128) (2016-05-26)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.127...v3.2.128)

**Merged pull requests:**

- Fix uglify [\#790](https://github.com/w3c/respec/pull/790) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.127](https://github.com/w3c/respec/tree/v3.2.127) (2016-05-26)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.126...v3.2.127)

**Fixed bugs:**

- Uglify choking on for ... of  [\#788](https://github.com/w3c/respec/issues/788)

**Merged pull requests:**

- Fix\(markdown\): Space before quote \(closes \#786\) [\#787](https://github.com/w3c/respec/pull/787) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.126](https://github.com/w3c/respec/tree/v3.2.126) (2016-05-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.125...v3.2.126)

**Fixed bugs:**

- dfn + code chops off space [\#783](https://github.com/w3c/respec/issues/783)

**Merged pull requests:**

- Fix whitespace issues [\#785](https://github.com/w3c/respec/pull/785) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update mocha to version 2.5.3 [\#784](https://github.com/w3c/respec/pull/784) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(global\): implement proper PubSubHub [\#769](https://github.com/w3c/respec/pull/769) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.125](https://github.com/w3c/respec/tree/v3.2.125) (2016-05-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.124...v3.2.125)

## [v3.2.124](https://github.com/w3c/respec/tree/v3.2.124) (2016-05-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.123...v3.2.124)

**Implemented enhancements:**

- Add highlight.js support for markdown [\#745](https://github.com/w3c/respec/issues/745)
- Should update highlighter  [\#576](https://github.com/w3c/respec/issues/576)

**Fixed bugs:**

- Deactivating hyperlinking in examples [\#777](https://github.com/w3c/respec/issues/777)
- no more html highlighting? [\#776](https://github.com/w3c/respec/issues/776)
- Clicking on document should close pill [\#772](https://github.com/w3c/respec/issues/772)

**Closed issues:**

- "Back to Top" target link [\#771](https://github.com/w3c/respec/issues/771)

**Merged pull requests:**

- Fix bad tests [\#779](https://github.com/w3c/respec/pull/779) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(markdown\): disable md linking via 'nolinks' class \(closes \#777\) [\#778](https://github.com/w3c/respec/pull/778) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(ui\): close ui when doc is clicked \(closes \#772\) [\#774](https://github.com/w3c/respec/pull/774) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(SpecHelper\): reduce dependece on jQuery [\#770](https://github.com/w3c/respec/pull/770) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(style\): reduce ReSpec FOUC \(relates to \#326\) [\#768](https://github.com/w3c/respec/pull/768) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(hightlight\): use new highlighter [\#767](https://github.com/w3c/respec/pull/767) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(utils\): add makeOwnerSwapper\(\) [\#766](https://github.com/w3c/respec/pull/766) ([marcoscaceres](https://github.com/marcoscaceres))
- Beautify \(X\)HTML output [\#761](https://github.com/w3c/respec/pull/761) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.123](https://github.com/w3c/respec/tree/v3.2.123) (2016-05-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.122...v3.2.123)

**Implemented enhancements:**

- Requirejs text.js is outdated [\#763](https://github.com/w3c/respec/issues/763)
- Ugly output  [\#750](https://github.com/w3c/respec/issues/750)
- Remove support for webspec [\#715](https://github.com/w3c/respec/issues/715)
- List of email bug reports relating to ARIA [\#140](https://github.com/w3c/respec/issues/140)

**Fixed bugs:**

- Webspecs mode has dependencies on specs.webplatform.org [\#476](https://github.com/w3c/respec/issues/476)
- List of email bug reports relating to ARIA [\#140](https://github.com/w3c/respec/issues/140)

**Closed issues:**

- Limit number of tests run in parallel [\#754](https://github.com/w3c/respec/issues/754)
- WebIDL needs to support FrozenArray [\#752](https://github.com/w3c/respec/issues/752)
- Need to be certain that the W3C stylesheet\(s\) are last, even if there are local styles [\#709](https://github.com/w3c/respec/issues/709)
- Deprecate webspecs status support  [\#643](https://github.com/w3c/respec/issues/643)
- Supporting definition aliases [\#344](https://github.com/w3c/respec/issues/344)

**Merged pull requests:**

- Feat\(domReady\): update requirejs domReady [\#765](https://github.com/w3c/respec/pull/765) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(text\): update requirejs text.js \(closes \#763\) [\#764](https://github.com/w3c/respec/pull/764) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(markdown\): teach markdown how to highlight code [\#759](https://github.com/w3c/respec/pull/759) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(respec2.css\): Override code highlighter background [\#758](https://github.com/w3c/respec/pull/758) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(utils\): correctly calculate leftPad [\#757](https://github.com/w3c/respec/pull/757) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(global\): add hightlighter and beautifier as deps [\#756](https://github.com/w3c/respec/pull/756) ([marcoscaceres](https://github.com/marcoscaceres))
- Simple test to exercise FrozenArray [\#753](https://github.com/w3c/respec/pull/753) ([halindrome](https://github.com/halindrome))
- command-line-usage@2.0.5 breaks build ⚠️ [\#744](https://github.com/w3c/respec/pull/744) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- promise-polyfill@5.1.0 breaks build ⚠️ [\#743](https://github.com/w3c/respec/pull/743) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Chore\(global\) deprecate 'webspec' status support \(closes \#715\) [\#742](https://github.com/w3c/respec/pull/742) ([marcoscaceres](https://github.com/marcoscaceres))
- WIP \(appveyor\): seeing if this works... [\#727](https://github.com/w3c/respec/pull/727) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.122](https://github.com/w3c/respec/tree/v3.2.122) (2016-05-06)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.121...v3.2.122)

**Fixed bugs:**

- Markdown formatter breaks \<pre\> blocks by stripping whitespace [\#724](https://github.com/w3c/respec/issues/724)
- Crash on Edge due to use of ES7 "includes" method [\#720](https://github.com/w3c/respec/issues/720)

**Closed issues:**

- Should update markdown  [\#581](https://github.com/w3c/respec/issues/581)

**Merged pull requests:**

- nightmare@2.4.0 breaks build ⚠️ [\#741](https://github.com/w3c/respec/pull/741) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- karma-mocha-reporter@2.0.3 breaks build ⚠️ [\#740](https://github.com/w3c/respec/pull/740) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-safari-launcher to version 1.0.0 🚀 [\#739](https://github.com/w3c/respec/pull/739) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-firefox-launcher to version 1.0.0 🚀 [\#738](https://github.com/w3c/respec/pull/738) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-opera-launcher to version 1.0.0 🚀 [\#737](https://github.com/w3c/respec/pull/737) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- karma-jasmine@1.0.2 breaks build ⚠️ [\#736](https://github.com/w3c/respec/pull/736) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-ie-launcher to version 1.0.0 🚀 [\#735](https://github.com/w3c/respec/pull/735) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-jasmine to version 1.0.0 🚀 [\#734](https://github.com/w3c/respec/pull/734) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-requirejs to version 1.0.0 🚀 [\#733](https://github.com/w3c/respec/pull/733) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Fix pre issue + update marked.js [\#732](https://github.com/w3c/respec/pull/732) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.121](https://github.com/w3c/respec/tree/v3.2.121) (2016-05-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.120...v3.2.121)

**Fixed bugs:**

- Fix\(respec-ready\): s/respectIsReady/respecIsReady/ typo [\#716](https://github.com/w3c/respec/pull/716) ([marcoscaceres](https://github.com/marcoscaceres))

**Closed issues:**

- Error in ontolex spec  [\#726](https://github.com/w3c/respec/issues/726)
- Stop using bleeding edge features - please [\#722](https://github.com/w3c/respec/issues/722)
- Update to latest google-prettify [\#714](https://github.com/w3c/respec/issues/714)
- When building, include Almond instead of requirejs [\#635](https://github.com/w3c/respec/issues/635)
- Make default template more mobile friendly  [\#316](https://github.com/w3c/respec/issues/316)

**Merged pull requests:**

- Update karma-chrome-launcher to version 1.0.1 🚀 [\#731](https://github.com/w3c/respec/pull/731) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- command-line-usage@2.0.4 breaks build ⚠️ [\#730](https://github.com/w3c/respec/pull/730) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update karma-mocha to version 1.0.1 🚀 [\#729](https://github.com/w3c/respec/pull/729) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Fix \(biblio\): Edge doesn't support includes yet [\#728](https://github.com/w3c/respec/pull/728) ([marcoscaceres](https://github.com/marcoscaceres))
- Update whatwg-fetch to version 1.0.0 🚀 [\#725](https://github.com/w3c/respec/pull/725) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update fs-extra to version 0.30.0 🚀 [\#721](https://github.com/w3c/respec/pull/721) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Feat\(package\): run tests in Safari Tech Preview [\#719](https://github.com/w3c/respec/pull/719) ([marcoscaceres](https://github.com/marcoscaceres))
- Update promise-polyfill to version 5.0.0 🚀 [\#717](https://github.com/w3c/respec/pull/717) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update fs-extra to version 0.29.0 🚀 [\#713](https://github.com/w3c/respec/pull/713) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- promise-polyfill@4.0.4 breaks build 🚨 [\#711](https://github.com/w3c/respec/pull/711) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Chore\(package\): make Node 5 min engine requirement [\#703](https://github.com/w3c/respec/pull/703) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.120](https://github.com/w3c/respec/tree/v3.2.120) (2016-04-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.119...v3.2.120)

**Closed issues:**

- respec2html should error if not a ReSpec document [\#704](https://github.com/w3c/respec/issues/704)

**Merged pull requests:**

- Feat\(respecDocWriter\): throw if not a ReSpec doc \(closes \#704\) [\#708](https://github.com/w3c/respec/pull/708) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.119](https://github.com/w3c/respec/tree/v3.2.119) (2016-04-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.118...v3.2.119)

**Closed issues:**

- Improvements to respecDocWriter [\#706](https://github.com/w3c/respec/issues/706)

**Merged pull requests:**

- Feat\(respecDocWriter\): improvements \(closes \#706\) [\#707](https://github.com/w3c/respec/pull/707) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat\(respecDocWriter\): resolve fetchAndWrite promise with HTML [\#705](https://github.com/w3c/respec/pull/705) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.118](https://github.com/w3c/respec/tree/v3.2.118) (2016-04-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.117...v3.2.118)

**Fixed bugs:**

- Issue processing PresentationAPI.html with respec2html.js [\#567](https://github.com/w3c/respec/issues/567)
- WG-NOTE does not generate Previous version header [\#303](https://github.com/w3c/respec/issues/303)

**Closed issues:**

- WG-Note CSS doesn't link properly [\#698](https://github.com/w3c/respec/issues/698)
- Export build method.  [\#691](https://github.com/w3c/respec/issues/691)
- Error: Cannot read property 'for\_' of undefined [\#689](https://github.com/w3c/respec/issues/689)
- Investigate moving to nightmarejs [\#667](https://github.com/w3c/respec/issues/667)
- Save snapshot leaves fixup.js generated content in the saved document [\#644](https://github.com/w3c/respec/issues/644)
- Do not enable ReSpec bubble and/or Save Snapshot until "RESPEC DONE!" [\#410](https://github.com/w3c/respec/issues/410)
- Warn that webidl-oldschool is deprecated [\#395](https://github.com/w3c/respec/issues/395)
- Investigate using Jester [\#313](https://github.com/w3c/respec/issues/313)

**Merged pull requests:**

- fix\(profile-w3c-common\): forgot to include fetch poly for Safari [\#701](https://github.com/w3c/respec/pull/701) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(ui\): dont show till respecIsReady \(closes \#410\) [\#700](https://github.com/w3c/respec/pull/700) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix\(w3c/style\): WG-Note CSS doesn't link \(closes \#698\) [\#699](https://github.com/w3c/respec/pull/699) ([marcoscaceres](https://github.com/marcoscaceres))
- Update fs-extra to version 0.28.0 🚀 [\#697](https://github.com/w3c/respec/pull/697) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update fs-extra to version 0.27.0 🚀 [\#695](https://github.com/w3c/respec/pull/695) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Update jscs to version 3.0.1 🚀 [\#694](https://github.com/w3c/respec/pull/694) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- WIP\(respec2html\): Externalize fetch and write [\#692](https://github.com/w3c/respec/pull/692) ([marcoscaceres](https://github.com/marcoscaceres))
- chore\(package\): update dependencies [\#690](https://github.com/w3c/respec/pull/690) ([marcoscaceres](https://github.com/marcoscaceres))
- Remove class 'toc-sidebar' from \<body\> when generating a snapshot [\#688](https://github.com/w3c/respec/pull/688) ([deniak](https://github.com/deniak))
- karma-detect-browsers@2.1.0 breaks build ⚠️ [\#687](https://github.com/w3c/respec/pull/687) ([greenkeeperio-bot](https://github.com/greenkeeperio-bot))
- Feat \(headless.js\): improved progress reporting. [\#682](https://github.com/w3c/respec/pull/682) ([marcoscaceres](https://github.com/marcoscaceres))
- Use nightmarejs [\#678](https://github.com/w3c/respec/pull/678) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat \(biblio.js\): don't go to network for local refs [\#665](https://github.com/w3c/respec/pull/665) ([marcoscaceres](https://github.com/marcoscaceres))
- Warn that webidl-oldschool is deprecated \(\#395\) [\#497](https://github.com/w3c/respec/pull/497) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.117](https://github.com/w3c/respec/tree/v3.2.117) (2016-04-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.116...v3.2.117)

**Fixed bugs:**

- In the current trunk and in the use\_nightmarejs branch I get a maximum call stack exceeded error [\#680](https://github.com/w3c/respec/issues/680)

**Closed issues:**

- Parameter description columns are very narrow [\#666](https://github.com/w3c/respec/issues/666)
- Determine dependencies prior to test / build [\#627](https://github.com/w3c/respec/issues/627)
- Provide template/theme for OASIS [\#300](https://github.com/w3c/respec/issues/300)

**Merged pull requests:**

- Feat \(ui.js,save-html.js\): Give UI elements ids [\#681](https://github.com/w3c/respec/pull/681) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat \(examples\): update PresentationAPI.html spec [\#679](https://github.com/w3c/respec/pull/679) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat \(package.json\): Update dependencies. [\#677](https://github.com/w3c/respec/pull/677) ([marcoscaceres](https://github.com/marcoscaceres))
- Reduce karma concurrency [\#664](https://github.com/w3c/respec/pull/664) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(headers-spec\): disable note test, not comment out [\#662](https://github.com/w3c/respec/pull/662) ([marcoscaceres](https://github.com/marcoscaceres))
- Use fetch instead of ajax [\#624](https://github.com/w3c/respec/pull/624) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.116](https://github.com/w3c/respec/tree/v3.2.116) (2016-03-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.114...v3.2.116)

**Fixed bugs:**

- Warning left border bigger than right border [\#584](https://github.com/w3c/respec/issues/584)
- Exampe yellow bar applied twice [\#583](https://github.com/w3c/respec/issues/583)

**Closed issues:**

- Permalinks that are right justified are on the wrong line \(too high up\) [\#652](https://github.com/w3c/respec/issues/652)

**Merged pull requests:**

- Put note text back the way it was. [\#661](https://github.com/w3c/respec/pull/661) ([halindrome](https://github.com/halindrome))
- Fix \(issues-notes.css\): Warning borders same width \(closes \#584\) [\#660](https://github.com/w3c/respec/pull/660) ([marcoscaceres](https://github.com/marcoscaceres))
- Fixes to release.js [\#659](https://github.com/w3c/respec/pull/659) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.114](https://github.com/w3c/respec/tree/v3.2.114) (2016-03-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.113...v3.2.114)

**Implemented enhancements:**

- Release.js: be more assertive about branch being out of date [\#656](https://github.com/w3c/respec/issues/656)

**Fixed bugs:**

- release.js - Switching branches without upstream set is broken [\#637](https://github.com/w3c/respec/issues/637)

**Merged pull requests:**

- Fix \(dfn.js\): Remove object's prototype \(closes \#582\) [\#649](https://github.com/w3c/respec/pull/649) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.113](https://github.com/w3c/respec/tree/v3.2.113) (2016-03-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.112...v3.2.113)

**Merged pull requests:**

- Fix \(sotd.html\): Move noRecTrack text to own para \(closes \#653\) [\#658](https://github.com/w3c/respec/pull/658) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(w3c/style.js\): pubrules requires props in explicit order [\#657](https://github.com/w3c/respec/pull/657) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.112](https://github.com/w3c/respec/tree/v3.2.112) (2016-03-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.111...v3.2.112)

## [v3.2.111](https://github.com/w3c/respec/tree/v3.2.111) (2016-03-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.110...v3.2.111)

**Fixed bugs:**

- W3C not serving source maps [\#647](https://github.com/w3c/respec/issues/647)

**Closed issues:**

- Pubrules doesn't like viewport [\#654](https://github.com/w3c/respec/issues/654)
- node tools/release.js failing when uploading to npmjs [\#645](https://github.com/w3c/respec/issues/645)

**Merged pull requests:**

- Fix \(w3c/style.js\): initial-scale should be 1 \(closes \#654\) [\#655](https://github.com/w3c/respec/pull/655) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(release.js\): Protect against EPIPE bombs from npmjs \(closes \#645\). [\#650](https://github.com/w3c/respec/pull/650) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.110](https://github.com/w3c/respec/tree/v3.2.110) (2016-03-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.109...v3.2.110)

**Implemented enhancements:**

- Support maplike declarations [\#361](https://github.com/w3c/respec/issues/361)

**Fixed bugs:**

- \<dfn id="x" dfn-for="y"\>constructor\</dfn\> causes JS error [\#582](https://github.com/w3c/respec/issues/582)

**Closed issues:**

- Make respec include RDFa attributes only as an opt-in [\#374](https://github.com/w3c/respec/issues/374)
- Remove heading role [\#370](https://github.com/w3c/respec/issues/370)
- CSS for DL requires \<section class='section'\> [\#366](https://github.com/w3c/respec/issues/366)

**Merged pull requests:**

- Fix \(builds/\): remove profile-w3c-common.build.js.map, as it's not used \(\#647\). [\#648](https://github.com/w3c/respec/pull/648) ([marcoscaceres](https://github.com/marcoscaceres))
- Added code to remove toc-nav node \(closes \#644\) [\#646](https://github.com/w3c/respec/pull/646) ([halindrome](https://github.com/halindrome))

## [v3.2.109](https://github.com/w3c/respec/tree/v3.2.109) (2016-03-11)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.108...v3.2.109)

**Fixed bugs:**

- Promise.js is being loaded instead of packaged [\#629](https://github.com/w3c/respec/issues/629)

**Closed issues:**

- jquery prototype is not extended with functions in utils [\#597](https://github.com/w3c/respec/issues/597)
- useExperimentalStyles should be a string, not a boolean [\#569](https://github.com/w3c/respec/issues/569)
- Wrong header level [\#386](https://github.com/w3c/respec/issues/386)
- Generation of 'ePub' format [\#355](https://github.com/w3c/respec/issues/355)
- noRecTrack should add Note-specific boilerplate [\#291](https://github.com/w3c/respec/issues/291)

**Merged pull requests:**

- Javascript errors shouldn't appear in the output [\#641](https://github.com/w3c/respec/pull/641) ([plehegar](https://github.com/plehegar))

## [v3.2.108](https://github.com/w3c/respec/tree/v3.2.108) (2016-03-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.107...v3.2.108)

## [v3.2.107](https://github.com/w3c/respec/tree/v3.2.107) (2016-03-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.106...v3.2.107)

**Merged pull requests:**

- Changed logo path to use new style location [\#638](https://github.com/w3c/respec/pull/638) ([halindrome](https://github.com/halindrome))

## [v3.2.106](https://github.com/w3c/respec/tree/v3.2.106) (2016-03-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.105...v3.2.106)

**Fixed bugs:**

- "save snapshot" not working on Firefox 44.0.2? [\#600](https://github.com/w3c/respec/issues/600)
- Errors in the lab version... [\#589](https://github.com/w3c/respec/issues/589)

**Closed issues:**

- Files are hard to work with... [\#493](https://github.com/w3c/respec/issues/493)
- Webspecs CSS needs work [\#477](https://github.com/w3c/respec/issues/477)
- Allow bracket constructs in front of attributes. [\#274](https://github.com/w3c/respec/issues/274)

**Merged pull requests:**

- Added dependencies on Promise. [\#632](https://github.com/w3c/respec/pull/632) ([halindrome](https://github.com/halindrome))
- Feat \(base-runner.js\): Adds document.respecIsReady promise \(closes \#607\) [\#628](https://github.com/w3c/respec/pull/628) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(headless.js\): pipe child stdout and stderr to parent [\#626](https://github.com/w3c/respec/pull/626) ([marcoscaceres](https://github.com/marcoscaceres))
- Feat \(package.json\): Updated depedencies via ncu [\#625](https://github.com/w3c/respec/pull/625) ([marcoscaceres](https://github.com/marcoscaceres))
- Globalize jquery enhanced [\#623](https://github.com/w3c/respec/pull/623) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(SpecRunner.html\): style-spec was being tested twice [\#621](https://github.com/w3c/respec/pull/621) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(utils-spec.js\): Remore deps that are not required in test [\#619](https://github.com/w3c/respec/pull/619) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix \(headers-spec.js\): Added forgotten done\(\) [\#618](https://github.com/w3c/respec/pull/618) ([marcoscaceres](https://github.com/marcoscaceres))
- Fix source maps [\#614](https://github.com/w3c/respec/pull/614) ([marcoscaceres](https://github.com/marcoscaceres))
- feat: \(tools\) Creates a JSON list of tests [\#610](https://github.com/w3c/respec/pull/610) ([marcoscaceres](https://github.com/marcoscaceres))
- Code to switch CG and BG reports to new styles [\#606](https://github.com/w3c/respec/pull/606) ([halindrome](https://github.com/halindrome))
- Re-did style changes [\#605](https://github.com/w3c/respec/pull/605) ([halindrome](https://github.com/halindrome))
- Updated dependencies [\#603](https://github.com/w3c/respec/pull/603) ([marcoscaceres](https://github.com/marcoscaceres))
- Try to figure out why Chrome keeps failing [\#602](https://github.com/w3c/respec/pull/602) ([marcoscaceres](https://github.com/marcoscaceres))
- Bug291 no rec track should add note [\#601](https://github.com/w3c/respec/pull/601) ([marcoscaceres](https://github.com/marcoscaceres))
- Improved progress reporting [\#599](https://github.com/w3c/respec/pull/599) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.105](https://github.com/w3c/respec/tree/v3.2.105) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.104...v3.2.105)

## [v3.2.104](https://github.com/w3c/respec/tree/v3.2.104) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.103...v3.2.104)

## [v3.2.103](https://github.com/w3c/respec/tree/v3.2.103) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.102...v3.2.103)

**Implemented enhancements:**

- release.js needs to be aware of new .map files  [\#585](https://github.com/w3c/respec/issues/585)

**Fixed bugs:**

- can't save snapshot  [\#590](https://github.com/w3c/respec/issues/590)

**Merged pull requests:**

- Attempt to break up Travis tasks [\#594](https://github.com/w3c/respec/pull/594) ([marcoscaceres](https://github.com/marcoscaceres))
- Make sure UI plugins are added \(close \#590\) [\#593](https://github.com/w3c/respec/pull/593) ([marcoscaceres](https://github.com/marcoscaceres))
- Rewrite release \(closes \#585\) [\#592](https://github.com/w3c/respec/pull/592) ([marcoscaceres](https://github.com/marcoscaceres))
- stop headless.js testing basic.built.html [\#591](https://github.com/w3c/respec/pull/591) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.102](https://github.com/w3c/respec/tree/v3.2.102) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.101...v3.2.102)

**Closed issues:**

- Maintainers need npm rights [\#587](https://github.com/w3c/respec/issues/587)

## [v3.2.101](https://github.com/w3c/respec/tree/v3.2.101) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.100...v3.2.101)

## [v3.2.100](https://github.com/w3c/respec/tree/v3.2.100) (2016-03-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.97...v3.2.100)

**Implemented enhancements:**

- Update to Phantomjs 2.1 [\#557](https://github.com/w3c/respec/issues/557)

**Fixed bugs:**

- Type error in old\(?\) Safari [\#562](https://github.com/w3c/respec/issues/562)
- References section is formatted incorrectly [\#518](https://github.com/w3c/respec/issues/518)

**Closed issues:**

- Console warning: The key "shrink-to-fit" is not recognized and ignored. [\#574](https://github.com/w3c/respec/issues/574)
- Update tests latest Jasmine [\#573](https://github.com/w3c/respec/issues/573)
- Use Karma instead of Phantomjs [\#572](https://github.com/w3c/respec/issues/572)
- CI - Travis keeps timing out [\#564](https://github.com/w3c/respec/issues/564)
- Make travis use Node 5.6.0 [\#511](https://github.com/w3c/respec/issues/511)
- Enum with no \<dd\> uses next \<dt\> instead. [\#329](https://github.com/w3c/respec/issues/329)
- Allow custom comment instructions [\#248](https://github.com/w3c/respec/issues/248)
- Work in Progress flag [\#236](https://github.com/w3c/respec/issues/236)

**Merged pull requests:**

- Fix issue where callback was expected where promise is used [\#586](https://github.com/w3c/respec/pull/586) ([marcoscaceres](https://github.com/marcoscaceres))
- Modernize respec [\#580](https://github.com/w3c/respec/pull/580) ([marcoscaceres](https://github.com/marcoscaceres))
- Moved fixup.js to end [\#578](https://github.com/w3c/respec/pull/578) ([halindrome](https://github.com/halindrome))
- Support for 2016 style, fixup.js, and experimental styles [\#571](https://github.com/w3c/respec/pull/571) ([marcoscaceres](https://github.com/marcoscaceres))
- Teach ReSpec's references about publishers \(closes \#518\) [\#568](https://github.com/w3c/respec/pull/568) ([marcoscaceres](https://github.com/marcoscaceres))
- Update phantomjs to 2.1 \(closes \#557\) [\#566](https://github.com/w3c/respec/pull/566) ([marcoscaceres](https://github.com/marcoscaceres))
- Made timeout of respec2html.js 20 secs \(closes \#564\) [\#565](https://github.com/w3c/respec/pull/565) ([marcoscaceres](https://github.com/marcoscaceres))
- Backout fixup.js  [\#563](https://github.com/w3c/respec/pull/563) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.97](https://github.com/w3c/respec/tree/v3.2.97) (2016-02-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.96...v3.2.97)

**Fixed bugs:**

- Fix logic in \<script src="fixup.js"\> [\#561](https://github.com/w3c/respec/pull/561) ([tripu](https://github.com/tripu))

## [v3.2.96](https://github.com/w3c/respec/tree/v3.2.96) (2016-02-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.92...v3.2.96)

**Implemented enhancements:**

- Run respec2html.js was part of the test suite. [\#501](https://github.com/w3c/respec/issues/501)
- Change fixup.js location [\#560](https://github.com/w3c/respec/pull/560) ([plehegar](https://github.com/plehegar))
- Align new TR design with latest requirements [\#558](https://github.com/w3c/respec/pull/558) ([plehegar](https://github.com/plehegar))

**Fixed bugs:**

- In IDL sections, Promise-based API definitions run off the page [\#521](https://github.com/w3c/respec/issues/521)

**Closed issues:**

- Dealing with overloaded operations [\#546](https://github.com/w3c/respec/issues/546)
- Dealing with multiple partials of the same interface in a doc [\#545](https://github.com/w3c/respec/issues/545)

**Merged pull requests:**

- Use the final locations of the 2016 stylesheets [\#559](https://github.com/w3c/respec/pull/559) ([deniak](https://github.com/deniak))
- Optimize space used for attributes in WebIDL contiguous [\#556](https://github.com/w3c/respec/pull/556) ([dontcallmedom](https://github.com/dontcallmedom))
- Switch to new travis infastructure [\#555](https://github.com/w3c/respec/pull/555) ([dontcallmedom](https://github.com/dontcallmedom))
- Allow autolinking of overloaded operations [\#554](https://github.com/w3c/respec/pull/554) ([dontcallmedom](https://github.com/dontcallmedom))
- Run respec2html on example files in test suite [\#553](https://github.com/w3c/respec/pull/553) ([dontcallmedom](https://github.com/dontcallmedom))
- Deal with long IDL lines [\#551](https://github.com/w3c/respec/pull/551) ([dontcallmedom](https://github.com/dontcallmedom))
- Avoid duplicating ids on multiple partials [\#549](https://github.com/w3c/respec/pull/549) ([dontcallmedom](https://github.com/dontcallmedom))
- Fix enumeration values references in WebIDL contiguous mode [\#547](https://github.com/w3c/respec/pull/547) ([tidoust](https://github.com/tidoust))
- Set timeout for XHR requests in respec2html.js [\#544](https://github.com/w3c/respec/pull/544) ([dontcallmedom](https://github.com/dontcallmedom))
- \[Urgent\] Avoid assigning property to a string object \(non-strict compatible\) [\#543](https://github.com/w3c/respec/pull/543) ([dontcallmedom](https://github.com/dontcallmedom))
- Added support for overriding the publication status [\#525](https://github.com/w3c/respec/pull/525) ([halindrome](https://github.com/halindrome))

## [v3.2.92](https://github.com/w3c/respec/tree/v3.2.92) (2015-12-19)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.91...v3.2.92)

## [v3.2.91](https://github.com/w3c/respec/tree/v3.2.91) (2015-12-19)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.78...v3.2.91)

**Implemented enhancements:**

- Use the experimental 2016 stylesheets for EDs [\#520](https://github.com/w3c/respec/issues/520)
- Update npm dependencies [\#532](https://github.com/w3c/respec/pull/532) ([tripu](https://github.com/tripu))
- Made some initial changes to test new styles [\#522](https://github.com/w3c/respec/pull/522) ([halindrome](https://github.com/halindrome))

**Fixed bugs:**

- Missing the protocol [\#530](https://github.com/w3c/respec/pull/530) ([plehegar](https://github.com/plehegar))
- Use www.w3.org for experimental style sheets [\#529](https://github.com/w3c/respec/pull/529) ([plehegar](https://github.com/plehegar))

**Closed issues:**

- Duplicate error for overloaded methods in contiguous WebIDL [\#536](https://github.com/w3c/respec/issues/536)
- Experimental Stylesheets [\#526](https://github.com/w3c/respec/issues/526)

**Merged pull requests:**

- Add --exclude-script to respec2html [\#541](https://github.com/w3c/respec/pull/541) ([dontcallmedom](https://github.com/dontcallmedom))
- Accet data-for and data-link-for as equivalents to for and link-for [\#537](https://github.com/w3c/respec/pull/537) ([dontcallmedom](https://github.com/dontcallmedom))
- Add support for maplike construct in WebIDL contiguous [\#535](https://github.com/w3c/respec/pull/535) ([dontcallmedom](https://github.com/dontcallmedom))
- Fix bug in generation of ids for enum values [\#534](https://github.com/w3c/respec/pull/534) ([dontcallmedom](https://github.com/dontcallmedom))
- WebIDL: setID removes digits from the id [\#533](https://github.com/w3c/respec/pull/533) ([deniak](https://github.com/deniak))
- Support for static attributes in WebIDL oldschool [\#527](https://github.com/w3c/respec/pull/527) ([dontcallmedom](https://github.com/dontcallmedom))
- Add support for FrozenArray in WebIDL oldschool [\#524](https://github.com/w3c/respec/pull/524) ([dontcallmedom](https://github.com/dontcallmedom))
- Fix bug linked to using bind\(this\) in phantomjs [\#523](https://github.com/w3c/respec/pull/523) ([dontcallmedom](https://github.com/dontcallmedom))
- A comma was missing before the first 'extras' in the header [\#519](https://github.com/w3c/respec/pull/519) ([iherman](https://github.com/iherman))
- Use navigation role for TOC [\#499](https://github.com/w3c/respec/pull/499) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.78](https://github.com/w3c/respec/tree/v3.2.78) (2015-11-09)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.77...v3.2.78)

**Merged pull requests:**

- Apply "missing name" fix to authors as well [\#517](https://github.com/w3c/respec/pull/517) ([dontcallmedom](https://github.com/dontcallmedom))

## [v3.2.77](https://github.com/w3c/respec/tree/v3.2.77) (2015-11-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.76...v3.2.77)

**Closed issues:**

- gh-pages branch gone? breaks respec2html [\#513](https://github.com/w3c/respec/issues/513)

**Merged pull requests:**

- Fix bug in editor name check [\#516](https://github.com/w3c/respec/pull/516) ([dontcallmedom](https://github.com/dontcallmedom))
- Avoid double commas bug in WebIDL oldschool [\#515](https://github.com/w3c/respec/pull/515) ([dontcallmedom](https://github.com/dontcallmedom))
- Upgrade node to latest version [\#512](https://github.com/w3c/respec/pull/512) ([marcoscaceres](https://github.com/marcoscaceres))
- Extra name entries [\#508](https://github.com/w3c/respec/pull/508) ([iherman](https://github.com/iherman))

## [v3.2.76](https://github.com/w3c/respec/tree/v3.2.76) (2015-09-29)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.75...v3.2.76)

**Merged pull requests:**

- Align wording with specberus expectations [\#509](https://github.com/w3c/respec/pull/509) ([plehegar](https://github.com/plehegar))

## [v3.2.75](https://github.com/w3c/respec/tree/v3.2.75) (2015-09-28)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.74...v3.2.75)

**Implemented enhancements:**

- Additional author information [\#507](https://github.com/w3c/respec/issues/507)

**Merged pull requests:**

- Default to new doc+software license \(closes \#505\) [\#506](https://github.com/w3c/respec/pull/506) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.74](https://github.com/w3c/respec/tree/v3.2.74) (2015-09-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.73...v3.2.74)

**Fixed bugs:**

- Prevent whitespaces in methodObject.idlId [\#503](https://github.com/w3c/respec/pull/503) ([plehegar](https://github.com/plehegar))

**Merged pull requests:**

- Removed outdated version text \(closes \#327\) [\#498](https://github.com/w3c/respec/pull/498) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.73](https://github.com/w3c/respec/tree/v3.2.73) (2015-09-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.72...v3.2.73)

**Merged pull requests:**

- Export config fixup [\#502](https://github.com/w3c/respec/pull/502) ([marcoscaceres](https://github.com/marcoscaceres))
- Small improvement to error reporting [\#495](https://github.com/w3c/respec/pull/495) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.72](https://github.com/w3c/respec/tree/v3.2.72) (2015-09-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.71...v3.2.72)

**Implemented enhancements:**

- Adding a \<script\> element with the config information to the generated output [\#478](https://github.com/w3c/respec/issues/478)

**Fixed bugs:**

- IE hates \<pre\> elements [\#110](https://github.com/w3c/respec/issues/110)

**Closed issues:**

- Is README out of date? [\#327](https://github.com/w3c/respec/issues/327)
- Double commas appear in WebIDL interface attributes with nullables [\#295](https://github.com/w3c/respec/issues/295)
- Comment support in WebIDL [\#160](https://github.com/w3c/respec/issues/160)

**Merged pull requests:**

- Fix save-ui for respec2html [\#500](https://github.com/w3c/respec/pull/500) ([dontcallmedom](https://github.com/dontcallmedom))
- using .innerHTML makes JSON reappear \(closes \#478\) [\#490](https://github.com/w3c/respec/pull/490) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.71](https://github.com/w3c/respec/tree/v3.2.71) (2015-09-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.70...v3.2.71)

**Closed issues:**

- "for" attributes used for WebIDL references remain in generated snapshot [\#483](https://github.com/w3c/respec/issues/483)
- Duplicate definition warnings when using contiguous IDL [\#480](https://github.com/w3c/respec/issues/480)
- Prepare code for new publication process \(2015\) [\#462](https://github.com/w3c/respec/issues/462)

**Merged pull requests:**

- Make invalid attrs to data-\* attrs \(closes \#483\) [\#494](https://github.com/w3c/respec/pull/494) ([marcoscaceres](https://github.com/marcoscaceres))
- added contiguous webidl to basic.html [\#492](https://github.com/w3c/respec/pull/492) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.70](https://github.com/w3c/respec/tree/v3.2.70) (2015-09-09)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.69...v3.2.70)

**Closed issues:**

- Release tool breaks [\#488](https://github.com/w3c/respec/issues/488)
- ReSpec Template for Pandoc ? [\#387](https://github.com/w3c/respec/issues/387)

**Merged pull requests:**

- Add ability to save as EPUB as a service [\#487](https://github.com/w3c/respec/pull/487) ([iherman](https://github.com/iherman))

## [v3.2.69](https://github.com/w3c/respec/tree/v3.2.69) (2015-09-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.59...v3.2.69)

**Fixed bugs:**

- Contiguous WebIDL definitions are duplicates  [\#475](https://github.com/w3c/respec/issues/475)
- Attribute for not allowed on element a at this point. [\#454](https://github.com/w3c/respec/issues/454)

**Closed issues:**

- Double definition of term when data-lt is used [\#470](https://github.com/w3c/respec/issues/470)
- Drop support/requirement for the non-HTML "lt" attribute, use a data-linkterm \(or whatever\) attribute instead. [\#467](https://github.com/w3c/respec/issues/467)
- Revert the change that added warnings for use of the "title" attribute with dfn elements [\#466](https://github.com/w3c/respec/issues/466)
- Style: Don't style contiguous-idl dfn targets as italic  [\#465](https://github.com/w3c/respec/issues/465)
- contiguous-idl should use "lt" attributes instead of deprecated "title" for dfn/a [\#464](https://github.com/w3c/respec/issues/464)
- Member-SUBM specStatus for Member Submissions somewhat borked [\#458](https://github.com/w3c/respec/issues/458)
- dfn references broken in latest release [\#383](https://github.com/w3c/respec/issues/383)
- Better GitHub issues support [\#241](https://github.com/w3c/respec/issues/241)
- Cannot pass an array in argument of a constructor [\#162](https://github.com/w3c/respec/issues/162)

**Merged pull requests:**

- Fix alignment with specberus on joint spec [\#489](https://github.com/w3c/respec/pull/489) ([dontcallmedom](https://github.com/dontcallmedom))
- Fix config export with non-serializable content definitionMap [\#485](https://github.com/w3c/respec/pull/485) ([dontcallmedom](https://github.com/dontcallmedom))
- Include config information in generated output \(closes \#478\) [\#484](https://github.com/w3c/respec/pull/484) ([marcoscaceres](https://github.com/marcoscaceres))
- Upgrade jquery to v2.1.4 [\#482](https://github.com/w3c/respec/pull/482) ([marcoscaceres](https://github.com/marcoscaceres))
- Add support for `data-lt-noDefault` attribute [\#481](https://github.com/w3c/respec/pull/481) ([marcoscaceres](https://github.com/marcoscaceres))
- Adapt to specberus expectations for joint publications [\#474](https://github.com/w3c/respec/pull/474) ([dontcallmedom](https://github.com/dontcallmedom))
- Fixed needing double def of term when data-lt is used \(closes \#470\) [\#471](https://github.com/w3c/respec/pull/471) ([marcoscaceres](https://github.com/marcoscaceres))
- Changed webidl generation to use data-lt attribute [\#469](https://github.com/w3c/respec/pull/469) ([halindrome](https://github.com/halindrome))
- Change to prefer data-lt for referring to link-titles [\#468](https://github.com/w3c/respec/pull/468) ([halindrome](https://github.com/halindrome))
- Process 2015 is coming [\#463](https://github.com/w3c/respec/pull/463) ([plehegar](https://github.com/plehegar))
- Improved Member-SUBM and Team-SUBM spec status support [\#459](https://github.com/w3c/respec/pull/459) ([tidoust](https://github.com/tidoust))
- Makes getDfnTitles work when called again [\#456](https://github.com/w3c/respec/pull/456) ([halindrome](https://github.com/halindrome))
- Implemented aliases for definitions [\#455](https://github.com/w3c/respec/pull/455) ([halindrome](https://github.com/halindrome))
- Avoid undefined ids for issues [\#451](https://github.com/w3c/respec/pull/451) ([dontcallmedom](https://github.com/dontcallmedom))
- don't generate a section ID if the heading has one [\#450](https://github.com/w3c/respec/pull/450) ([darobin](https://github.com/darobin))

## [v3.2.59](https://github.com/w3c/respec/tree/v3.2.59) (2015-06-17)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.58...v3.2.59)

**Merged pull requests:**

- Add support for iterable to oldschool IDL [\#449](https://github.com/w3c/respec/pull/449) ([mwatson2](https://github.com/mwatson2))

## [v3.2.58](https://github.com/w3c/respec/tree/v3.2.58) (2015-06-11)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.57...v3.2.58)

**Merged pull requests:**

- Fix Contiguous WebIDL support for callbacks with multiple args. [\#448](https://github.com/w3c/respec/pull/448) ([tobie](https://github.com/tobie))

## [v3.2.57](https://github.com/w3c/respec/tree/v3.2.57) (2015-06-11)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.56...v3.2.57)

**Merged pull requests:**

- This module simplifies acknowledging contributions made through GitHub. [\#447](https://github.com/w3c/respec/pull/447) ([tobie](https://github.com/tobie))

## [v3.2.56](https://github.com/w3c/respec/tree/v3.2.56) (2015-06-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.55...v3.2.56)

**Merged pull requests:**

- Add an Issue summary [\#446](https://github.com/w3c/respec/pull/446) ([tobie](https://github.com/tobie))

## [v3.2.55](https://github.com/w3c/respec/tree/v3.2.55) (2015-06-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.54...v3.2.55)

**Merged pull requests:**

- L10N support + Simplified Chinese [\#445](https://github.com/w3c/respec/pull/445) ([darobin](https://github.com/darobin))

## [v3.2.54](https://github.com/w3c/respec/tree/v3.2.54) (2015-06-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.53...v3.2.54)

**Closed issues:**

- In contiguous IDL mode, typedefs don't produce a definition for the defined type. [\#427](https://github.com/w3c/respec/issues/427)

**Merged pull requests:**

- Including body and title of GitHub issues. [\#443](https://github.com/w3c/respec/pull/443) ([tobie](https://github.com/tobie))
- Update Jasmine External Link [\#442](https://github.com/w3c/respec/pull/442) ([ajsb85](https://github.com/ajsb85))
- Add support for WebIDL RHS identifier list. [\#440](https://github.com/w3c/respec/pull/440) ([tobie](https://github.com/tobie))

## [v3.2.53](https://github.com/w3c/respec/tree/v3.2.53) (2015-05-13)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.52...v3.2.53)

**Merged pull requests:**

- Let people write `\<dfn\>dotted.name\</dfn\>` to define IDL members. [\#439](https://github.com/w3c/respec/pull/439) ([jyasskin](https://github.com/jyasskin))

## [v3.2.52](https://github.com/w3c/respec/tree/v3.2.52) (2015-05-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.49...v3.2.52)

**Closed issues:**

- There should be a way to create an Editor's Note [\#436](https://github.com/w3c/respec/issues/436)

**Merged pull requests:**

- Added support for class ednote [\#437](https://github.com/w3c/respec/pull/437) ([halindrome](https://github.com/halindrome))
- Use promises to yield between phases [\#435](https://github.com/w3c/respec/pull/435) ([jyasskin](https://github.com/jyasskin))
- Add .editorconfig files and fix whitespace [\#434](https://github.com/w3c/respec/pull/434) ([jyasskin](https://github.com/jyasskin))
- Improve linking to and around WebIDL terms [\#433](https://github.com/w3c/respec/pull/433) ([jyasskin](https://github.com/jyasskin))
- Avoid cloning nodes in issues and notes. [\#432](https://github.com/w3c/respec/pull/432) ([jyasskin](https://github.com/jyasskin))
- Support for special operations in WebIDL contiguous mode [\#431](https://github.com/w3c/respec/pull/431) ([dontcallmedom](https://github.com/dontcallmedom))
- allow to filter tests run based on spec name [\#430](https://github.com/w3c/respec/pull/430) ([dontcallmedom](https://github.com/dontcallmedom))

## [v3.2.49](https://github.com/w3c/respec/tree/v3.2.49) (2015-04-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.44...v3.2.49)

**Closed issues:**

- `required` sequence dictionary fields lose their parameters [\#424](https://github.com/w3c/respec/issues/424)
- fix-headers incorrectly messes with non-section headers [\#419](https://github.com/w3c/respec/issues/419)
- preProcess like facility, or specific event, at saving? [\#418](https://github.com/w3c/respec/issues/418)
- Support Oct 2015 process [\#415](https://github.com/w3c/respec/issues/415)
- reference not being picked up from specref [\#413](https://github.com/w3c/respec/issues/413)
- Style: Use a sans-serif font for WebIDL label [\#406](https://github.com/w3c/respec/issues/406)
- Handle comments and whitespace in the contiguous IDL processor [\#393](https://github.com/w3c/respec/issues/393)
- \<div class='example'\> not recognized as example  [\#272](https://github.com/w3c/respec/issues/272)

**Merged pull requests:**

- required dict member in webidl oldschool [\#429](https://github.com/w3c/respec/pull/429) ([dontcallmedom](https://github.com/dontcallmedom))
- Support required dictionary members in contiguous-idl mode. [\#428](https://github.com/w3c/respec/pull/428) ([jyasskin](https://github.com/jyasskin))
- Propagate comments and whitespace through the contiguous IDL processor. [\#426](https://github.com/w3c/respec/pull/426) ([jyasskin](https://github.com/jyasskin))
- Feature/notoc [\#421](https://github.com/w3c/respec/pull/421) ([gkellogg](https://github.com/gkellogg))
- Add UI to show a list of definitions. [\#417](https://github.com/w3c/respec/pull/417) ([gkellogg](https://github.com/gkellogg))
- re-reverting to labs.w3.org [\#414](https://github.com/w3c/respec/pull/414) ([dontcallmedom](https://github.com/dontcallmedom))
- Fix maplike errors. [\#412](https://github.com/w3c/respec/pull/412) ([yutakahirano](https://github.com/yutakahirano))
- Maplike update [\#411](https://github.com/w3c/respec/pull/411) ([yutakahirano](https://github.com/yutakahirano))
- Fetch specref.jit.su over HTTPS [\#409](https://github.com/w3c/respec/pull/409) ([jyasskin](https://github.com/jyasskin))

## [v3.2.44](https://github.com/w3c/respec/tree/v3.2.44) (2015-03-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.43...v3.2.44)

**Merged pull requests:**

- Add maplike support. [\#408](https://github.com/w3c/respec/pull/408) ([yutakahirano](https://github.com/yutakahirano))
- Cleanup write as html [\#403](https://github.com/w3c/respec/pull/403) ([yutakahirano](https://github.com/yutakahirano))

## [v3.2.43](https://github.com/w3c/respec/tree/v3.2.43) (2015-03-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.41...v3.2.43)

**Closed issues:**

- Provide a way to refer to \[\[internal slots\]\] of JS objects [\#407](https://github.com/w3c/respec/issues/407)
- Copyright uses comma where it should use period, fails pubrules [\#405](https://github.com/w3c/respec/issues/405)

**Merged pull requests:**

- pubrules expects a period not a comma in w3c copyright [\#402](https://github.com/w3c/respec/pull/402) ([dontcallmedom](https://github.com/dontcallmedom))
- Update ReSpec to heroku URL. [\#401](https://github.com/w3c/respec/pull/401) ([tobie](https://github.com/tobie))

## [v3.2.41](https://github.com/w3c/respec/tree/v3.2.41) (2015-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.40...v3.2.41)

**Merged pull requests:**

- Webspec issues [\#400](https://github.com/w3c/respec/pull/400) ([darobin](https://github.com/darobin))

## [v3.2.40](https://github.com/w3c/respec/tree/v3.2.40) (2015-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.39...v3.2.40)

**Merged pull requests:**

- Support for producing WebSpecs using ReSpec [\#396](https://github.com/w3c/respec/pull/396) ([darobin](https://github.com/darobin))

## [v3.2.39](https://github.com/w3c/respec/tree/v3.2.39) (2015-02-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.19...v3.2.39)

**Implemented enhancements:**

- Add a "disposition of comments" heading in the top dl  [\#97](https://github.com/w3c/respec/issues/97)
- Add syntax for extended attributes on interfaces [\#63](https://github.com/w3c/respec/issues/63)
- Add a "bug tracker" heading to the top dl [\#36](https://github.com/w3c/respec/issues/36)
- Add a "discussion" heading in the top dl [\#35](https://github.com/w3c/respec/issues/35)
- FileSaver [\#7](https://github.com/w3c/respec/issues/7)

**Fixed bugs:**

- Error when "noRecTrack" is used [\#367](https://github.com/w3c/respec/issues/367)
- Include pointer to mailing list in CG template [\#34](https://github.com/w3c/respec/issues/34)
- Stringifier support [\#31](https://github.com/w3c/respec/issues/31)

**Closed issues:**

- Permalinks get messed up "content" attribute if heading text has special characters [\#389](https://github.com/w3c/respec/issues/389)
- add style for warning class [\#381](https://github.com/w3c/respec/issues/381)
- Empty string enum value breaks ReSpec [\#372](https://github.com/w3c/respec/issues/372)
- File it! link should point to the issue page in the main GitHub repo [\#362](https://github.com/w3c/respec/issues/362)
- Document @title on @class=example [\#356](https://github.com/w3c/respec/issues/356)
- New WebIDL types like CancelablePromise cause \<types\> to disappear [\#352](https://github.com/w3c/respec/issues/352)
- SOTD custom paragraph ordering [\#351](https://github.com/w3c/respec/issues/351)
- Add ability to show / hide sections [\#349](https://github.com/w3c/respec/issues/349)
- RFC 2119 keyword boilerplate incomplete [\#345](https://github.com/w3c/respec/issues/345)
- URL encode subjectPrefix when inserting in mailto: link [\#340](https://github.com/w3c/respec/issues/340)
- noLegacyStyle removes member documentation entirely [\#334](https://github.com/w3c/respec/issues/334)
- Support Promise\<sequence\<T\>\> [\#331](https://github.com/w3c/respec/issues/331)
- Missing documentation for Community Group publications [\#328](https://github.com/w3c/respec/issues/328)
- Respec should allow the inclusion of a canonical URL [\#317](https://github.com/w3c/respec/issues/317)
- unecessary role=document added to body element [\#309](https://github.com/w3c/respec/issues/309)
- Switch build to Grunt [\#267](https://github.com/w3c/respec/issues/267)
- Hard-codes in-page links unnecessarily [\#249](https://github.com/w3c/respec/issues/249)
- Document noLegacyStyle [\#237](https://github.com/w3c/respec/issues/237)
- Show issues in spec [\#221](https://github.com/w3c/respec/issues/221)
- Support custom header links in CG template [\#216](https://github.com/w3c/respec/issues/216)
- Improper handling of getter [\#185](https://github.com/w3c/respec/issues/185)
- Contributors section? [\#152](https://github.com/w3c/respec/issues/152)
- Move all of WebIDL Legacy to templates [\#96](https://github.com/w3c/respec/issues/96)
- Create a Datatype encapsulation [\#55](https://github.com/w3c/respec/issues/55)

**Merged pull requests:**

- Allow to specify editors id in doc configuration [\#398](https://github.com/w3c/respec/pull/398) ([dontcallmedom](https://github.com/dontcallmedom))
- Binary install [\#397](https://github.com/w3c/respec/pull/397) ([darobin](https://github.com/darobin))
- use labs.w3.org url for specrefs; see \#314 [\#392](https://github.com/w3c/respec/pull/392) ([dontcallmedom](https://github.com/dontcallmedom))
- Ensure that apostrophes in headers are escaped [\#391](https://github.com/w3c/respec/pull/391) ([halindrome](https://github.com/halindrome))
- Handle wg\* arrays better, with linting and some headers code cleanup [\#388](https://github.com/w3c/respec/pull/388) ([darobin](https://github.com/darobin))
- Fix bad interaction between inlines and dfn [\#384](https://github.com/w3c/respec/pull/384) ([darobin](https://github.com/darobin))
- adding .warning feature to respec [\#382](https://github.com/w3c/respec/pull/382) ([hallvors](https://github.com/hallvors))
- Specref search highlight & reverse lookup [\#380](https://github.com/w3c/respec/pull/380) ([tobie](https://github.com/tobie))
- no need to count the usage of RFC2119 terms, just flag their presence [\#379](https://github.com/w3c/respec/pull/379) ([darobin](https://github.com/darobin))
- Split finding \<dfn\> elements from using them to link \<a\> tags. [\#377](https://github.com/w3c/respec/pull/377) ([jyasskin](https://github.com/jyasskin))
- fix handling of empty string enums [\#376](https://github.com/w3c/respec/pull/376) ([darobin](https://github.com/darobin))
- Feature/rdfa lite [\#375](https://github.com/w3c/respec/pull/375) ([gkellogg](https://github.com/gkellogg))
- Add the ability to process contiguous WebIDL blocks [\#373](https://github.com/w3c/respec/pull/373) ([jyasskin](https://github.com/jyasskin))
- Addressed role of heading on h\* elements [\#371](https://github.com/w3c/respec/pull/371) ([halindrome](https://github.com/halindrome))
- The SotD must include a public mailing list reference [\#369](https://github.com/w3c/respec/pull/369) ([halindrome](https://github.com/halindrome))
- Make sure all arguments pub\(\) passes to postMessage are structured-cloneable. [\#368](https://github.com/w3c/respec/pull/368) ([jyasskin](https://github.com/jyasskin))
- Added handling for perEnd [\#365](https://github.com/w3c/respec/pull/365) ([halindrome](https://github.com/halindrome))
- Changed bug reporting link [\#364](https://github.com/w3c/respec/pull/364) ([halindrome](https://github.com/halindrome))
- Added control to permit moving custom sotd [\#360](https://github.com/w3c/respec/pull/360) ([halindrome](https://github.com/halindrome))
- deal with scheme-relative imports of respec in respec2html [\#358](https://github.com/w3c/respec/pull/358) ([dontcallmedom](https://github.com/dontcallmedom))
- report errors/warnings from cmd line tool [\#357](https://github.com/w3c/respec/pull/357) ([dontcallmedom](https://github.com/dontcallmedom))
- Print ReSpec version into the console log [\#354](https://github.com/w3c/respec/pull/354) ([halindrome](https://github.com/halindrome))
- add new parametric types for issue \#352 [\#353](https://github.com/w3c/respec/pull/353) ([darobin](https://github.com/darobin))
- Don't generate RDFa for the abstract if the config says no \(typo fix\) [\#350](https://github.com/w3c/respec/pull/350) ([foolip](https://github.com/foolip))
- Support bug tracker and other links in CG documents [\#348](https://github.com/w3c/respec/pull/348) ([foolip](https://github.com/foolip))
- Ensured whitespace is collapsed in terms [\#347](https://github.com/w3c/respec/pull/347) ([halindrome](https://github.com/halindrome))
- Added handling to only define used rfc2119 terms [\#346](https://github.com/w3c/respec/pull/346) ([halindrome](https://github.com/halindrome))
- Added mailto handling for CG when it is a draft [\#343](https://github.com/w3c/respec/pull/343) ([halindrome](https://github.com/halindrome))
- Added handling for encoding subjectPrefix [\#342](https://github.com/w3c/respec/pull/342) ([halindrome](https://github.com/halindrome))
- support for sequence\<Promise\<T\>\> ; close \#331 [\#339](https://github.com/w3c/respec/pull/339) ([dontcallmedom](https://github.com/dontcallmedom))
- Add a pointer to respec-docs [\#337](https://github.com/w3c/respec/pull/337) ([halindrome](https://github.com/halindrome))
- add overrideLogo support [\#336](https://github.com/w3c/respec/pull/336) ([sglaser](https://github.com/sglaser))
- Stop setting aria-level on headings [\#325](https://github.com/w3c/respec/pull/325) ([halindrome](https://github.com/halindrome))

## [v3.2.19](https://github.com/w3c/respec/tree/v3.2.19) (2014-09-22)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.18...v3.2.19)

**Closed issues:**

- Mechanism to identify governing process \(part of Process 2014 adoption\) [\#324](https://github.com/w3c/respec/issues/324)

**Merged pull requests:**

- Update requireConfig.paths.ui to fix 'Save Snapshot' regression from migration. [\#338](https://github.com/w3c/respec/pull/338) ([anssiko](https://github.com/anssiko))
- Saving should support a respecEvent [\#335](https://github.com/w3c/respec/pull/335) ([halindrome](https://github.com/halindrome))

## [v3.2.18](https://github.com/w3c/respec/tree/v3.2.18) (2014-08-08)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.17...v3.2.18)

**Closed issues:**

- Document the 'format' option [\#333](https://github.com/w3c/respec/issues/333)
- Incorrect sorting order [\#323](https://github.com/w3c/respec/issues/323)
- incorrect aria-level on headings? [\#308](https://github.com/w3c/respec/issues/308)

## [v3.2.17](https://github.com/w3c/respec/tree/v3.2.17) (2014-07-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.16...v3.2.17)

## [v3.2.16](https://github.com/w3c/respec/tree/v3.2.16) (2014-07-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.15...v3.2.16)

**Closed issues:**

- rawDate seems to be ignored in localBiblio [\#321](https://github.com/w3c/respec/issues/321)
- permalinks are not attached to divs [\#315](https://github.com/w3c/respec/issues/315)

**Merged pull requests:**

- Adding permalinks to h\* within div [\#320](https://github.com/w3c/respec/pull/320) ([halindrome](https://github.com/halindrome))
- Support Previous Version on NOTEs [\#319](https://github.com/w3c/respec/pull/319) ([halindrome](https://github.com/halindrome))
- Allow references that are missing href. [\#310](https://github.com/w3c/respec/pull/310) ([tobie](https://github.com/tobie))
- More accessible luminosity contrast on colour for \<code\> [\#307](https://github.com/w3c/respec/pull/307) ([jasonkiss](https://github.com/jasonkiss))

## [v3.2.15](https://github.com/w3c/respec/tree/v3.2.15) (2014-06-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.14...v3.2.15)

**Closed issues:**

- section \> h\*:first selector used in some modules throwing exception on Chrome [\#311](https://github.com/w3c/respec/issues/311)
- pre class="example" does not escape HTML code [\#305](https://github.com/w3c/respec/issues/305)

## [v3.2.14](https://github.com/w3c/respec/tree/v3.2.14) (2014-04-09)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.12...v3.2.14)

**Closed issues:**

- RDFa generation is including incorrect links [\#302](https://github.com/w3c/respec/issues/302)

**Merged pull requests:**

- Adding support for "permalinks" [\#301](https://github.com/w3c/respec/pull/301) ([halindrome](https://github.com/halindrome))
- Add support for Promise\<\> by having a general parameterized support. [\#299](https://github.com/w3c/respec/pull/299) ([mounirlamouri](https://github.com/mounirlamouri))
- Serve JavaScript from GitHub Pages. [\#298](https://github.com/w3c/respec/pull/298) ([mikewest](https://github.com/mikewest))

## [v3.2.12](https://github.com/w3c/respec/tree/v3.2.12) (2014-03-05)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.10...v3.2.12)

**Merged pull requests:**

- Add Specref search to ReSpec UI. [\#297](https://github.com/w3c/respec/pull/297) ([tobie](https://github.com/tobie))
- Notes no longer require previous version [\#296](https://github.com/w3c/respec/pull/296) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.2.10](https://github.com/w3c/respec/tree/v3.2.10) (2014-02-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.9...v3.2.10)

## [v3.2.9](https://github.com/w3c/respec/tree/v3.2.9) (2014-02-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.2.8...v3.2.9)

## [v3.2.8](https://github.com/w3c/respec/tree/v3.2.8) (2014-01-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.65...v3.2.8)

**Implemented enhancements:**

- Rework Save As [\#150](https://github.com/w3c/respec/issues/150)
- Add a UI system [\#6](https://github.com/w3c/respec/issues/6)

**Fixed bugs:**

- Build is broken [\#275](https://github.com/w3c/respec/issues/275)
- Support for "this is informative" in PP [\#139](https://github.com/w3c/respec/issues/139)
- AX: char marks for true/false need accessible clarification alternatives \(prmNullFalse, prmNullTrue, prmOptFalse, prmOptTrue\) [\#108](https://github.com/w3c/respec/issues/108)

**Closed issues:**

- maxTocLevel doesn't continue numbering sections [\#292](https://github.com/w3c/respec/issues/292)
- \<a\> element in a \<figcaption\> is swallowed... [\#290](https://github.com/w3c/respec/issues/290)
- Hide the UI in print stylesheet [\#285](https://github.com/w3c/respec/issues/285)
- Type fields are not rendered correctly for IDLs [\#284](https://github.com/w3c/respec/issues/284)
- Add implemetation report to SotD [\#283](https://github.com/w3c/respec/issues/283)
- Invalid links even though they aren't in the source code [\#282](https://github.com/w3c/respec/issues/282)
- Use of "static" in WebIDL breaks rendering [\#281](https://github.com/w3c/respec/issues/281)
- Replace "NOTE" with "WG-NOTE" [\#280](https://github.com/w3c/respec/issues/280)
- Note style sheet link is wrong [\#279](https://github.com/w3c/respec/issues/279)
- contaner elements breaks ToC [\#278](https://github.com/w3c/respec/issues/278)
- Travis now broken [\#277](https://github.com/w3c/respec/issues/277)
- Upgrade RequireJS [\#266](https://github.com/w3c/respec/issues/266)
- Upgrade jQuery [\#265](https://github.com/w3c/respec/issues/265)
- Conflict with jQuery [\#264](https://github.com/w3c/respec/issues/264)
- respecConfig should not be required [\#258](https://github.com/w3c/respec/issues/258)
- Broken links in WebIDL for constants [\#250](https://github.com/w3c/respec/issues/250)
- Puts meta Content-type instead of Content-Type [\#246](https://github.com/w3c/respec/issues/246)
- puts 0="" on some \<section\> elements [\#245](https://github.com/w3c/respec/issues/245)
- document how to use otherLinks in main documentation [\#220](https://github.com/w3c/respec/issues/220)
- document how to use previousVersions [\#219](https://github.com/w3c/respec/issues/219)
- Include subjectPrefix in the documentation [\#218](https://github.com/w3c/respec/issues/218)
- Default last modified date uses GMT rather than Locale time [\#107](https://github.com/w3c/respec/issues/107)

**Merged pull requests:**

- Issue292 maxTocLevel doesn't continue numbering sections [\#293](https://github.com/w3c/respec/pull/293) ([sspeiche](https://github.com/sspeiche))
- Pretty print [\#288](https://github.com/w3c/respec/pull/288) ([KevinCathcart](https://github.com/KevinCathcart))
- Fix travis build status to point to the develop branch. [\#276](https://github.com/w3c/respec/pull/276) ([tobie](https://github.com/tobie))

## [v3.1.65](https://github.com/w3c/respec/tree/v3.1.65) (2013-09-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.64...v3.1.65)

**Closed issues:**

- extraCSS has no effect [\#271](https://github.com/w3c/respec/issues/271)
- References to sections with manually assigned section ids not shown [\#270](https://github.com/w3c/respec/issues/270)
- status sections have vanished from specs!!!!!! [\#268](https://github.com/w3c/respec/issues/268)
- docsprint to update documentation [\#224](https://github.com/w3c/respec/issues/224)

**Merged pull requests:**

- Changed XHTML1 source generation [\#253](https://github.com/w3c/respec/pull/253) ([halindrome](https://github.com/halindrome))

## [v3.1.64](https://github.com/w3c/respec/tree/v3.1.64) (2013-09-09)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.63...v3.1.64)

**Implemented enhancements:**

- Add a "implementaion report" heading to the top dl [\#95](https://github.com/w3c/respec/issues/95)
- Add a "test suite" heading to the top dl [\#94](https://github.com/w3c/respec/issues/94)
- Allow specifying an explicit previous version of a document \(as in v1\) [\#65](https://github.com/w3c/respec/issues/65)
- Make it possible for reference sections to disappear when they are empty [\#61](https://github.com/w3c/respec/issues/61)
- Make sure that the document is scrolled to anchor [\#10](https://github.com/w3c/respec/issues/10)

**Fixed bugs:**

- Constructors extended attributes not represented if there isn't another extended attribute [\#261](https://github.com/w3c/respec/issues/261)
- Redirect from old docs [\#137](https://github.com/w3c/respec/issues/137)
- Template is wrong [\#76](https://github.com/w3c/respec/issues/76)

**Closed issues:**

- sequence\<\> in constructor argument not properly escaped [\#260](https://github.com/w3c/respec/issues/260)
- sequence in typedef not properly escaped [\#259](https://github.com/w3c/respec/issues/259)
- Update documentation for biblio options [\#257](https://github.com/w3c/respec/issues/257)
- Provide options on copyright/licensing \(for unofficial drafts, in particular\) [\#255](https://github.com/w3c/respec/issues/255)
- Broken link for short name [\#254](https://github.com/w3c/respec/issues/254)
- need way of editing published stable documents, e.g., by idempotent or undo [\#240](https://github.com/w3c/respec/issues/240)
- Switch from Handlebars to doT [\#232](https://github.com/w3c/respec/issues/232)
- Replace document.write with something that makes ReSpec work with XHTML files [\#157](https://github.com/w3c/respec/issues/157)
- Sliders [\#93](https://github.com/w3c/respec/issues/93)
- Update old docs to point to new version [\#30](https://github.com/w3c/respec/issues/30)
- Recommend using async on the loading script? [\#24](https://github.com/w3c/respec/issues/24)
- Port documentation [\#3](https://github.com/w3c/respec/issues/3)

**Merged pull requests:**

- display Constructor extended attributes even where there is no other ext... [\#262](https://github.com/w3c/respec/pull/262) ([dontcallmedom](https://github.com/dontcallmedom))

## [v3.1.63](https://github.com/w3c/respec/tree/v3.1.63) (2013-08-29)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.62...v3.1.63)

**Closed issues:**

- Adding references inline in JavaScript [\#256](https://github.com/w3c/respec/issues/256)

## [v3.1.62](https://github.com/w3c/respec/tree/v3.1.62) (2013-08-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.61...v3.1.62)

**Closed issues:**

- Uses https for non SSL links [\#247](https://github.com/w3c/respec/issues/247)

**Merged pull requests:**

- Changed the @role attribute on the table of contents and the IDs on major sections [\#252](https://github.com/w3c/respec/pull/252) ([halindrome](https://github.com/halindrome))
- Moved all WAI-ARIA @aria-level and @role handling to its own module [\#251](https://github.com/w3c/respec/pull/251) ([halindrome](https://github.com/halindrome))

## [v3.1.61](https://github.com/w3c/respec/tree/v3.1.61) (2013-07-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.60...v3.1.61)

**Merged pull requests:**

- Adding instructions on how to run the test suite to the README file. [\#244](https://github.com/w3c/respec/pull/244) ([tobie](https://github.com/tobie))
- Develop [\#243](https://github.com/w3c/respec/pull/243) ([halindrome](https://github.com/halindrome))

## [v3.1.60](https://github.com/w3c/respec/tree/v3.1.60) (2013-06-28)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.59...v3.1.60)

**Merged pull requests:**

- Always use https for W3C stylesheets and logo [\#242](https://github.com/w3c/respec/pull/242) ([lanthaler](https://github.com/lanthaler))
- Added test for local aliases [\#239](https://github.com/w3c/respec/pull/239) ([ylafon](https://github.com/ylafon))
- add docs for noLegacyStyle flag [\#238](https://github.com/w3c/respec/pull/238) ([anssiko](https://github.com/anssiko))
- Fix for locally defined aliases not working [\#235](https://github.com/w3c/respec/pull/235) ([ylafon](https://github.com/ylafon))
- Update legacy.js [\#234](https://github.com/w3c/respec/pull/234) ([htInEdin](https://github.com/htInEdin))

## [v3.1.59](https://github.com/w3c/respec/tree/v3.1.59) (2013-06-05)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.58...v3.1.59)

**Closed issues:**

- Respec pointing to wrong style for Notes? [\#229](https://github.com/w3c/respec/issues/229)

**Merged pull requests:**

- see if using the conf works better here [\#231](https://github.com/w3c/respec/pull/231) ([darobin](https://github.com/darobin))
- fix bug when respec is referenced using https [\#230](https://github.com/w3c/respec/pull/230) ([cconcolato](https://github.com/cconcolato))
- Display identifiers with a leading \_ unescaped in the HTML description of the WebIDL [\#228](https://github.com/w3c/respec/pull/228) ([dontcallmedom](https://github.com/dontcallmedom))
- Ahem. [\#227](https://github.com/w3c/respec/pull/227) ([tobie](https://github.com/tobie))
- Add CI testing using phantomjs and travis. [\#226](https://github.com/w3c/respec/pull/226) ([tobie](https://github.com/tobie))
- Add support for W3C PER status. Yes. It's a thing. [\#225](https://github.com/w3c/respec/pull/225) ([tobie](https://github.com/tobie))

## [v3.1.58](https://github.com/w3c/respec/tree/v3.1.58) (2013-05-22)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.57...v3.1.58)

**Merged pull requests:**

- Second pass at using an API for spec references. [\#223](https://github.com/w3c/respec/pull/223) ([tobie](https://github.com/tobie))

## [v3.1.57](https://github.com/w3c/respec/tree/v3.1.57) (2013-05-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.56...v3.1.57)

## [v3.1.56](https://github.com/w3c/respec/tree/v3.1.56) (2013-05-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.55...v3.1.56)

**Implemented enhancements:**

- Change reference system [\#5](https://github.com/w3c/respec/issues/5)

**Closed issues:**

- Removed some redundancy for biblio.js [\#215](https://github.com/w3c/respec/issues/215)

**Merged pull requests:**

- Rely on a calls to an API for spec references rather than bundling the whole ref file. [\#222](https://github.com/w3c/respec/pull/222) ([tobie](https://github.com/tobie))
- Previous versions \(closes \#215\) [\#217](https://github.com/w3c/respec/pull/217) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.1.55](https://github.com/w3c/respec/tree/v3.1.55) (2013-05-06)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.54...v3.1.55)

**Implemented enhancements:**

- Add microformats to template [\#207](https://github.com/w3c/respec/issues/207)
- ability to create custom front matter [\#87](https://github.com/w3c/respec/issues/87)
- Mailing list subject prefix [\#15](https://github.com/w3c/respec/issues/15)

**Fixed bugs:**

- Include the patches that Travis made to v2 [\#28](https://github.com/w3c/respec/issues/28)

**Closed issues:**

- Duplicate entries in biblio.js [\#213](https://github.com/w3c/respec/issues/213)

**Merged pull requests:**

- Removed duplicate entries, used aliasOf instead \(closes \#213\) [\#214](https://github.com/w3c/respec/pull/214) ([marcoscaceres](https://github.com/marcoscaceres))
- \[WebStorage\] PR published 9-Apr-2013 [\#212](https://github.com/w3c/respec/pull/212) ([AFBarstow](https://github.com/AFBarstow))
- adding RFC2557 reference [\#211](https://github.com/w3c/respec/pull/211) ([efullea](https://github.com/efullea))
- more RFC entries. [\#210](https://github.com/w3c/respec/pull/210) ([ylafon](https://github.com/ylafon))
- Update biblio.js [\#209](https://github.com/w3c/respec/pull/209) ([gps-git](https://github.com/gps-git))
- Support for additional links in header \(closes \#87\) [\#208](https://github.com/w3c/respec/pull/208) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.1.54](https://github.com/w3c/respec/tree/v3.1.54) (2013-04-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.53...v3.1.54)

**Merged pull requests:**

- add RFC 6931 [\#206](https://github.com/w3c/respec/pull/206) ([fhirsch](https://github.com/fhirsch))
- Some telco related references, used by sysapps.  [\#205](https://github.com/w3c/respec/pull/205) ([marcoscaceres](https://github.com/marcoscaceres))
- Modernized some old refs, added some new refs, aliased others [\#204](https://github.com/w3c/respec/pull/204) ([marcoscaceres](https://github.com/marcoscaceres))
- Adding MMS and SysApps Runtime references and fixing SMS reference [\#203](https://github.com/w3c/respec/pull/203) ([efullea](https://github.com/efullea))
- Added reference to app: URI [\#202](https://github.com/w3c/respec/pull/202) ([marcoscaceres](https://github.com/marcoscaceres))
- Add bib ref alias support. [\#201](https://github.com/w3c/respec/pull/201) ([tobie](https://github.com/tobie))
- Added URL spec [\#200](https://github.com/w3c/respec/pull/200) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.1.53](https://github.com/w3c/respec/tree/v3.1.53) (2013-04-16)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.52...v3.1.53)

## [v3.1.52](https://github.com/w3c/respec/tree/v3.1.52) (2013-04-16)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.51...v3.1.52)

**Closed issues:**

- WebIDL: using of union types in callbacks and dictionaries [\#182](https://github.com/w3c/respec/issues/182)

**Merged pull requests:**

- Lowercasing dfn and a links [\#199](https://github.com/w3c/respec/pull/199) ([silviapfeiffer](https://github.com/silviapfeiffer))
- Add JSON-LD LC Working Drafts [\#197](https://github.com/w3c/respec/pull/197) ([lanthaler](https://github.com/lanthaler))
- Added ZIP reference [\#196](https://github.com/w3c/respec/pull/196) ([marcoscaceres](https://github.com/marcoscaceres))
- Use scheme-relative stylesheet URLs [\#194](https://github.com/w3c/respec/pull/194) ([lanthaler](https://github.com/lanthaler))

## [v3.1.51](https://github.com/w3c/respec/tree/v3.1.51) (2013-04-09)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.50...v3.1.51)

**Merged pull requests:**

- Fix xmlsec bilbio.js entries, add .gitignore, add test file [\#193](https://github.com/w3c/respec/pull/193) ([fhirsch](https://github.com/fhirsch))
- Use right padding for union types in dictionaries [\#191](https://github.com/w3c/respec/pull/191) ([lanthaler](https://github.com/lanthaler))
- Add support for union types to callbacks [\#190](https://github.com/w3c/respec/pull/190) ([lanthaler](https://github.com/lanthaler))
- Bibref fixes. [\#189](https://github.com/w3c/respec/pull/189) ([tobie](https://github.com/tobie))
- Bibref. Some more cleanup. [\#188](https://github.com/w3c/respec/pull/188) ([tobie](https://github.com/tobie))
- Added a script to normalize biblio refs \(and sort them\) and ran the biblio refs through it. [\#187](https://github.com/w3c/respec/pull/187) ([tobie](https://github.com/tobie))
- Ensure that URL fragment identifiers work as intended [\#184](https://github.com/w3c/respec/pull/184) ([lanthaler](https://github.com/lanthaler))

## [v3.1.50](https://github.com/w3c/respec/tree/v3.1.50) (2013-04-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.49...v3.1.50)

**Merged pull requests:**

- Allow issues to be marked atrisk [\#183](https://github.com/w3c/respec/pull/183) ([lanthaler](https://github.com/lanthaler))
- Update MDNS + DNS-SD references in biblio.js [\#173](https://github.com/w3c/respec/pull/173) ([richtr](https://github.com/richtr))

## [v3.1.49](https://github.com/w3c/respec/tree/v3.1.49) (2013-03-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.48...v3.1.49)

**Merged pull requests:**

- Clean-up IETF refs. [\#181](https://github.com/w3c/respec/pull/181) ([tobie](https://github.com/tobie))
- Biblio: fix OMA-URI-SCHEMES ref. [\#180](https://github.com/w3c/respec/pull/180) ([tobie](https://github.com/tobie))
- Fhirsch cherry pick [\#179](https://github.com/w3c/respec/pull/179) ([tobie](https://github.com/tobie))
- Add RFC5988 and RFC6906 [\#178](https://github.com/w3c/respec/pull/178) ([lanthaler](https://github.com/lanthaler))
- Biblio: fix WEBGL ref. [\#177](https://github.com/w3c/respec/pull/177) ([tobie](https://github.com/tobie))
- Biblio: Fix ECMA refs. [\#176](https://github.com/w3c/respec/pull/176) ([tobie](https://github.com/tobie))
- Biblio: Fix syntax error in JSON. [\#175](https://github.com/w3c/respec/pull/175) ([tobie](https://github.com/tobie))
- Biblio: Fix SSE references. [\#174](https://github.com/w3c/respec/pull/174) ([tobie](https://github.com/tobie))
- Add navigation timing reference [\#172](https://github.com/w3c/respec/pull/172) ([luser](https://github.com/luser))
- update WEBIDL ref [\#171](https://github.com/w3c/respec/pull/171) ([anssiko](https://github.com/anssiko))
- Ref to SVG2, CSS Masking, Filter Effects, Compositing [\#169](https://github.com/w3c/respec/pull/169) ([dirkschulze](https://github.com/dirkschulze))
- Updated RDF-Syntax to be to 2004 [\#168](https://github.com/w3c/respec/pull/168) ([sspeiche](https://github.com/sspeiche))

## [v3.1.48](https://github.com/w3c/respec/tree/v3.1.48) (2013-03-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.47...v3.1.48)

**Merged pull requests:**

- Add support for Constructor and NamedConstructor [\#166](https://github.com/w3c/respec/pull/166) ([dirkschulze](https://github.com/dirkschulze))
- Added ECMAS-402 - ES i18n API [\#165](https://github.com/w3c/respec/pull/165) ([marcoscaceres](https://github.com/marcoscaceres))
- Allow keywords stringifier and inherit on attribute [\#164](https://github.com/w3c/respec/pull/164) ([dirkschulze](https://github.com/dirkschulze))
- Allow comments on interfaces [\#163](https://github.com/w3c/respec/pull/163) ([dirkschulze](https://github.com/dirkschulze))
- Add FILE-SYSTEM and WEB-SQL biblio references [\#161](https://github.com/w3c/respec/pull/161) ([kinu](https://github.com/kinu))

## [v3.1.47](https://github.com/w3c/respec/tree/v3.1.47) (2013-03-06)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.46...v3.1.47)

**Merged pull requests:**

- Add RFC4646, "Tags for Identifying Languages" [\#156](https://github.com/w3c/respec/pull/156) ([mounirlamouri](https://github.com/mounirlamouri))
- added a bunch of dated references [\#155](https://github.com/w3c/respec/pull/155) ([gps-git](https://github.com/gps-git))
- Update biblio.js [\#154](https://github.com/w3c/respec/pull/154) ([gps-git](https://github.com/gps-git))
- EARL bibref and dfn re-definition [\#153](https://github.com/w3c/respec/pull/153) ([gkellogg](https://github.com/gkellogg))

## [v3.1.46](https://github.com/w3c/respec/tree/v3.1.46) (2013-03-01)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.45...v3.1.46)

## [v3.1.45](https://github.com/w3c/respec/tree/v3.1.45) (2013-02-28)
[Full Changelog](https://github.com/w3c/respec/compare/3.1.45...v3.1.45)

## [3.1.45](https://github.com/w3c/respec/tree/3.1.45) (2013-02-28)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.44...3.1.45)

## [v3.1.44](https://github.com/w3c/respec/tree/v3.1.44) (2013-02-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.43...v3.1.44)

**Merged pull requests:**

- Hopefully additions not breaking anything this time  [\#149](https://github.com/w3c/respec/pull/149) ([cconcolato](https://github.com/cconcolato))
- Update js/w3c/headers.js [\#148](https://github.com/w3c/respec/pull/148) ([plinss](https://github.com/plinss))

## [v3.1.43](https://github.com/w3c/respec/tree/v3.1.43) (2013-02-12)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.42...v3.1.43)

**Implemented enhancements:**

- Find a batch option [\#11](https://github.com/w3c/respec/issues/11)

**Closed issues:**

- Allow Constructor description [\#146](https://github.com/w3c/respec/issues/146)
- In-page anchor links do not work at page load time [\#116](https://github.com/w3c/respec/issues/116)

**Merged pull requests:**

- Add respec2html.js documentation; make valid HTML. [\#147](https://github.com/w3c/respec/pull/147) ([anssiko](https://github.com/anssiko))
- Make the stringification of structured biblio refs more robust.   [\#145](https://github.com/w3c/respec/pull/145) ([tobie](https://github.com/tobie))
- Develop [\#144](https://github.com/w3c/respec/pull/144) ([plinss](https://github.com/plinss))
- Adding a reference to the Shadow DOM [\#142](https://github.com/w3c/respec/pull/142) ([shs96c](https://github.com/shs96c))
- respec2html is a command line utility that converts a ReSpec source file... [\#133](https://github.com/w3c/respec/pull/133) ([anssiko](https://github.com/anssiko))

## [v3.1.42](https://github.com/w3c/respec/tree/v3.1.42) (2013-02-05)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.41...v3.1.42)

**Fixed bugs:**

- New copyright [\#138](https://github.com/w3c/respec/issues/138)

**Merged pull requests:**

- Updated biblio entries for some ARIA specs. [\#141](https://github.com/w3c/respec/pull/141) ([sideshowbarker](https://github.com/sideshowbarker))
- Update refs [\#136](https://github.com/w3c/respec/pull/136) ([tobie](https://github.com/tobie))
- Update js/w3c/headers.js [\#135](https://github.com/w3c/respec/pull/135) ([plinss](https://github.com/plinss))
- Add support for 'scheme' config variable: if defined, loads external res... [\#134](https://github.com/w3c/respec/pull/134) ([anssiko](https://github.com/anssiko))
- Update bibref/biblio.js [\#132](https://github.com/w3c/respec/pull/132) ([gps-git](https://github.com/gps-git))
- Update data-merge documentation. [\#131](https://github.com/w3c/respec/pull/131) ([anssiko](https://github.com/anssiko))

## [v3.1.41](https://github.com/w3c/respec/tree/v3.1.41) (2013-01-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.40...v3.1.41)

## [v3.1.40](https://github.com/w3c/respec/tree/v3.1.40) (2013-01-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.39...v3.1.40)

**Merged pull requests:**

- Allow structured biblio references. [\#130](https://github.com/w3c/respec/pull/130) ([tobie](https://github.com/tobie))
- Add support for 'noLegacyStyle' config flag: if set, removes legacy DOM-... [\#129](https://github.com/w3c/respec/pull/129) ([anssiko](https://github.com/anssiko))
- serializer needs to be shown in HTML description as well [\#128](https://github.com/w3c/respec/pull/128) ([dontcallmedom](https://github.com/dontcallmedom))

## [v3.1.39](https://github.com/w3c/respec/tree/v3.1.39) (2013-01-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.38...v3.1.39)

**Merged pull requests:**

- support for WebIDL "serializer" syntax [\#127](https://github.com/w3c/respec/pull/127) ([dontcallmedom](https://github.com/dontcallmedom))
- update publication date for xmlsec publications [\#126](https://github.com/w3c/respec/pull/126) ([fhirsch](https://github.com/fhirsch))
- Add CSSOM. [\#125](https://github.com/w3c/respec/pull/125) ([tobie](https://github.com/tobie))

## [v3.1.38](https://github.com/w3c/respec/tree/v3.1.38) (2013-01-08)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.37...v3.1.38)

**Merged pull requests:**

- make implReport optional in PR handling, update documentation [\#123](https://github.com/w3c/respec/pull/123) ([fhirsch](https://github.com/fhirsch))
- Add STREAMS-API, Update HTML5, Rename DOM4-EVENTS to BiblioDB [\#122](https://github.com/w3c/respec/pull/122) ([jacobrossi](https://github.com/jacobrossi))
- add PR support [\#121](https://github.com/w3c/respec/pull/121) ([fhirsch](https://github.com/fhirsch))

## [v3.1.37](https://github.com/w3c/respec/tree/v3.1.37) (2013-01-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.36...v3.1.37)

## [v3.1.36](https://github.com/w3c/respec/tree/v3.1.36) (2013-01-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.35...v3.1.36)

**Closed issues:**

- Support callbacks... [\#103](https://github.com/w3c/respec/issues/103)

**Merged pull requests:**

- Added DOM4-EVENTS to the Biblio DB [\#119](https://github.com/w3c/respec/pull/119) ([jacobrossi](https://github.com/jacobrossi))
- Add reference to pointerevents spec. [\#118](https://github.com/w3c/respec/pull/118) ([tobie](https://github.com/tobie))
- Add reference to screen-orientation spec. [\#117](https://github.com/w3c/respec/pull/117) ([tobie](https://github.com/tobie))
- Added more biblio refs needed for LDP-UCR work from LDP WG [\#115](https://github.com/w3c/respec/pull/115) ([sspeiche](https://github.com/sspeiche))
- Add CSP to biblio.js [\#112](https://github.com/w3c/respec/pull/112) ([mounirlamouri](https://github.com/mounirlamouri))
- Fix a bug where some nested headers would get appended to the incorrect ... [\#111](https://github.com/w3c/respec/pull/111) ([tobie](https://github.com/tobie))
- Update D3E ref [\#109](https://github.com/w3c/respec/pull/109) ([travisleithead](https://github.com/travisleithead))
- update URIs for XMLENC-CBC-ATTACK and XMLENC-PKCS15-ATTACK [\#106](https://github.com/w3c/respec/pull/106) ([fhirsch](https://github.com/fhirsch))

## [v3.1.35](https://github.com/w3c/respec/tree/v3.1.35) (2012-12-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.34...v3.1.35)

**Merged pull requests:**

- added reference to html5 25 october 2012 dated snapshot [\#105](https://github.com/w3c/respec/pull/105) ([gps-git](https://github.com/gps-git))
- Properly handle section elements in markdown mode. [\#104](https://github.com/w3c/respec/pull/104) ([tobie](https://github.com/tobie))
- Update biblio.js  [\#102](https://github.com/w3c/respec/pull/102) ([fhirsch](https://github.com/fhirsch))
- Added partial dictionary to 'W3C ReSpec WebIDL tests' [\#101](https://github.com/w3c/respec/pull/101) ([ksons](https://github.com/ksons))

## [v3.1.34](https://github.com/w3c/respec/tree/v3.1.34) (2012-11-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.33...v3.1.34)

**Merged pull requests:**

- Quick hack to support partial dictionaries [\#100](https://github.com/w3c/respec/pull/100) ([ksons](https://github.com/ksons))
- Update bibref/biblio.js [\#99](https://github.com/w3c/respec/pull/99) ([gps-git](https://github.com/gps-git))

## [v3.1.33](https://github.com/w3c/respec/tree/v3.1.33) (2012-11-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.32...v3.1.33)

**Implemented enhancements:**

- Ability to create local references [\#44](https://github.com/w3c/respec/issues/44)

**Merged pull requests:**

- Added High Resolution Time and MIDI references. [\#98](https://github.com/w3c/respec/pull/98) ([cwilso](https://github.com/cwilso))

## [v3.1.32](https://github.com/w3c/respec/tree/v3.1.32) (2012-10-31)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.31...v3.1.32)

## [v3.1.31](https://github.com/w3c/respec/tree/v3.1.31) (2012-10-23)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.30...v3.1.31)

**Merged pull requests:**

- Update bibref/biblio.js [\#92](https://github.com/w3c/respec/pull/92) ([gps-git](https://github.com/gps-git))
- Update bibref/biblio.js [\#91](https://github.com/w3c/respec/pull/91) ([gps-git](https://github.com/gps-git))
- Add specs for core/requirements. [\#89](https://github.com/w3c/respec/pull/89) ([tobie](https://github.com/tobie))

## [v3.1.30](https://github.com/w3c/respec/tree/v3.1.30) (2012-10-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.29...v3.1.30)

## [v3.1.29](https://github.com/w3c/respec/tree/v3.1.29) (2012-10-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.28...v3.1.29)

**Merged pull requests:**

- Add Markdown support \(with bugfixes and specs\). [\#90](https://github.com/w3c/respec/pull/90) ([tobie](https://github.com/tobie))
- Add a core/requirements module. [\#88](https://github.com/w3c/respec/pull/88) ([tobie](https://github.com/tobie))

## [v3.1.28](https://github.com/w3c/respec/tree/v3.1.28) (2012-10-16)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.27...v3.1.28)

## [v3.1.27](https://github.com/w3c/respec/tree/v3.1.27) (2012-10-16)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.26...v3.1.27)

**Merged pull requests:**

- Update bibref/biblio.js [\#86](https://github.com/w3c/respec/pull/86) ([fhirsch](https://github.com/fhirsch))
- Added refs for GSM-SMS, OMA-PUSH, and RFC3428 [\#85](https://github.com/w3c/respec/pull/85) ([blsaws](https://github.com/blsaws))
- Update bibref/biblio.js [\#84](https://github.com/w3c/respec/pull/84) ([halindrome](https://github.com/halindrome))
- Add \[x\] to the respec-err popup which allows closing it. [\#83](https://github.com/w3c/respec/pull/83) ([tobie](https://github.com/tobie))

## [v3.1.26](https://github.com/w3c/respec/tree/v3.1.26) (2012-10-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.25...v3.1.26)

**Merged pull requests:**

- upldate biblio.js xmlsec chg names [\#82](https://github.com/w3c/respec/pull/82) ([fhirsch](https://github.com/fhirsch))

## [v3.1.25](https://github.com/w3c/respec/tree/v3.1.25) (2012-09-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.24...v3.1.25)

## [v3.1.24](https://github.com/w3c/respec/tree/v3.1.24) (2012-09-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.23...v3.1.24)

## [v3.1.23](https://github.com/w3c/respec/tree/v3.1.23) (2012-09-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.22...v3.1.23)

## [v3.1.22](https://github.com/w3c/respec/tree/v3.1.22) (2012-09-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.21...v3.1.22)

**Merged pull requests:**

- Added ALT-TECHNIQUES and CSS4-IMAGES...  [\#77](https://github.com/w3c/respec/pull/77) ([marcoscaceres](https://github.com/marcoscaceres))

## [v3.1.21](https://github.com/w3c/respec/tree/v3.1.21) (2012-09-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.20...v3.1.21)

**Closed issues:**

- data-oninclude does not seem to work for data-include [\#67](https://github.com/w3c/respec/issues/67)

**Merged pull requests:**

- Only display reference sections when there are references. [\#75](https://github.com/w3c/respec/pull/75) ([tobie](https://github.com/tobie))
- Please pull LINKED-DATA ref, we need it for LDP ED [\#74](https://github.com/w3c/respec/pull/74) ([mhausenblas](https://github.com/mhausenblas))
- Update bibref/biblio.js [\#71](https://github.com/w3c/respec/pull/71) ([gps-git](https://github.com/gps-git))
- Update bibref/biblio.js [\#70](https://github.com/w3c/respec/pull/70) ([adamretter](https://github.com/adamretter))
- updated biblio.js for SP800-57 update [\#69](https://github.com/w3c/respec/pull/69) ([fhirsch](https://github.com/fhirsch))
- Add support for prevED to CG-DRAFT. [\#68](https://github.com/w3c/respec/pull/68) ([tobie](https://github.com/tobie))
- Update bibref/biblio.js [\#66](https://github.com/w3c/respec/pull/66) ([silviapfeiffer](https://github.com/silviapfeiffer))

## [v3.1.20](https://github.com/w3c/respec/tree/v3.1.20) (2012-08-19)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.19...v3.1.20)

**Merged pull requests:**

- Update bibref/biblio.js [\#64](https://github.com/w3c/respec/pull/64) ([adamretter](https://github.com/adamretter))

## [v3.1.19](https://github.com/w3c/respec/tree/v3.1.19) (2012-08-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.18...v3.1.19)

## [v3.1.18](https://github.com/w3c/respec/tree/v3.1.18) (2012-08-08)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.17...v3.1.18)

## [v3.1.17](https://github.com/w3c/respec/tree/v3.1.17) (2012-08-03)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.16...v3.1.17)

## [v3.1.16](https://github.com/w3c/respec/tree/v3.1.16) (2012-07-31)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.15...v3.1.16)

**Merged pull requests:**

- Update RDFA-CORE and CURIE bibrefs, added MICRODATA and MICRODATA-RDF [\#58](https://github.com/w3c/respec/pull/58) ([gkellogg](https://github.com/gkellogg))

## [v3.1.15](https://github.com/w3c/respec/tree/v3.1.15) (2012-07-16)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.14...v3.1.15)

**Closed issues:**

- Injected resources should be loaded from https if the page is [\#57](https://github.com/w3c/respec/issues/57)
- Links are not properly removed in ToC [\#56](https://github.com/w3c/respec/issues/56)

## [v3.1.14](https://github.com/w3c/respec/tree/v3.1.14) (2012-07-10)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.13...v3.1.14)

## [v3.1.13](https://github.com/w3c/respec/tree/v3.1.13) (2012-07-06)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.12...v3.1.13)

**Fixed bugs:**

- array dictionary members have their \[\] eaten [\#32](https://github.com/w3c/respec/issues/32)

**Closed issues:**

- Types linked to non-existing definitions [\#54](https://github.com/w3c/respec/issues/54)
- Do not generate duplicate IDs for interface names [\#53](https://github.com/w3c/respec/issues/53)
- Remove rel=biblioentry [\#52](https://github.com/w3c/respec/issues/52)
- Allow custom number for issues  [\#50](https://github.com/w3c/respec/issues/50)
- With return union types \(at least\) methods are no longer aligned vertically [\#48](https://github.com/w3c/respec/issues/48)

**Merged pull requests:**

- Use abbr in copyright boilerplate, not acronym. [\#51](https://github.com/w3c/respec/pull/51) ([sideshowbarker](https://github.com/sideshowbarker))
- Add QUOTA-API and OMA-URI-SCHEME refs. [\#49](https://github.com/w3c/respec/pull/49) ([tobie](https://github.com/tobie))

## [v3.1.12](https://github.com/w3c/respec/tree/v3.1.12) (2012-07-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.11...v3.1.12)

## [v3.1.11](https://github.com/w3c/respec/tree/v3.1.11) (2012-07-02)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.10...v3.1.11)

**Merged pull requests:**

- update HTMLMEDIACAPTURE ref [\#47](https://github.com/w3c/respec/pull/47) ([anssiko](https://github.com/anssiko))

## [v3.1.10](https://github.com/w3c/respec/tree/v3.1.10) (2012-06-27)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.9...v3.1.10)

**Fixed bugs:**

- WebIDL-generated subsections have h2-headings [\#46](https://github.com/w3c/respec/issues/46)

**Closed issues:**

- W3C Pubrules issues [\#45](https://github.com/w3c/respec/issues/45)

## [v3.1.9](https://github.com/w3c/respec/tree/v3.1.9) (2012-06-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.8...v3.1.9)

**Fixed bugs:**

- SOTD Paragraphs duplicated after TOC [\#42](https://github.com/w3c/respec/issues/42)

## [v3.1.8](https://github.com/w3c/respec/tree/v3.1.8) (2012-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.7...v3.1.8)

## [v3.1.7](https://github.com/w3c/respec/tree/v3.1.7) (2012-06-22)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.6...v3.1.7)

## [v3.1.6](https://github.com/w3c/respec/tree/v3.1.6) (2012-06-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.5...v3.1.6)

## [v3.1.5](https://github.com/w3c/respec/tree/v3.1.5) (2012-06-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.4...v3.1.5)

## [v3.1.4](https://github.com/w3c/respec/tree/v3.1.4) (2012-06-21)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.3...v3.1.4)

**Closed issues:**

- Navigation to fragment identifiers is busted [\#43](https://github.com/w3c/respec/issues/43)

## [v3.1.3](https://github.com/w3c/respec/tree/v3.1.3) (2012-06-20)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.2...v3.1.3)

**Fixed bugs:**

- If abstract and SotD are in the wrong order, strange things happen [\#37](https://github.com/w3c/respec/issues/37)

## [v3.1.2](https://github.com/w3c/respec/tree/v3.1.2) (2012-06-19)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.1...v3.1.2)

**Implemented enhancements:**

- Use CSS WG style for examples, notes, issues [\#39](https://github.com/w3c/respec/issues/39)

**Closed issues:**

- Remove all CSS generated content [\#23](https://github.com/w3c/respec/issues/23)

**Merged pull requests:**

- Add ref for: WEBAPPS-MANIFEST-API [\#41](https://github.com/w3c/respec/pull/41) ([tobie](https://github.com/tobie))

## [v3.1.1](https://github.com/w3c/respec/tree/v3.1.1) (2012-06-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.3.1...v3.1.1)

## [v3.3.1](https://github.com/w3c/respec/tree/v3.3.1) (2012-06-18)
[Full Changelog](https://github.com/w3c/respec/compare/v3.1.0...v3.3.1)

**Fixed bugs:**

- Custom paragraph is not removed properly [\#38](https://github.com/w3c/respec/issues/38)

**Closed issues:**

- Add title, possibly with markup, to examples [\#22](https://github.com/w3c/respec/issues/22)
- Add support for CG reports [\#19](https://github.com/w3c/respec/issues/19)
- Change syntax highlighter [\#4](https://github.com/w3c/respec/issues/4)

## [v3.1.0](https://github.com/w3c/respec/tree/v3.1.0) (2012-06-15)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.15...v3.1.0)

## [v3.0.15](https://github.com/w3c/respec/tree/v3.0.15) (2012-06-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.14...v3.0.15)

**Merged pull requests:**

- Add references for ANIMATION-TIMING, RFC3966 \(tel:\) and RFC6068 \(mailto:\) [\#40](https://github.com/w3c/respec/pull/40) ([tobie](https://github.com/tobie))

## [v3.0.14](https://github.com/w3c/respec/tree/v3.0.14) (2012-06-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.13...v3.0.14)

## [v3.0.13](https://github.com/w3c/respec/tree/v3.0.13) (2012-06-14)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.12...v3.0.13)

**Merged pull requests:**

- Added missing references. [\#33](https://github.com/w3c/respec/pull/33) ([tobie](https://github.com/tobie))

## [v3.0.12](https://github.com/w3c/respec/tree/v3.0.12) (2012-06-13)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.11...v3.0.12)

**Closed issues:**

- Switch from Jasmine to Mocha? [\#25](https://github.com/w3c/respec/issues/25)

## [v3.0.11](https://github.com/w3c/respec/tree/v3.0.11) (2012-06-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.10...v3.0.11)

## [v3.0.10](https://github.com/w3c/respec/tree/v3.0.10) (2012-06-07)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.9...v3.0.10)

**Closed issues:**

- Add RDFa 1.1 markup from ReSpec v1 [\#26](https://github.com/w3c/respec/issues/26)
- New templating system [\#9](https://github.com/w3c/respec/issues/9)

## [v3.0.9](https://github.com/w3c/respec/tree/v3.0.9) (2012-06-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.8...v3.0.9)

## [v3.0.8](https://github.com/w3c/respec/tree/v3.0.8) (2012-06-04)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.7...v3.0.8)

**Closed issues:**

- Check rules for XGR support [\#18](https://github.com/w3c/respec/issues/18)

**Merged pull requests:**

- As per Gregg's request, I did the 'merge-up' of V1 stuff into V3 for RDFa [\#29](https://github.com/w3c/respec/pull/29) ([halindrome](https://github.com/halindrome))

## [v3.0.7](https://github.com/w3c/respec/tree/v3.0.7) (2012-06-01)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.6...v3.0.7)

**Closed issues:**

- Enum support [\#16](https://github.com/w3c/respec/issues/16)

**Merged pull requests:**

- References needed for WebRTC / getUserMedia [\#27](https://github.com/w3c/respec/pull/27) ([dontcallmedom](https://github.com/dontcallmedom))

## [v3.0.6](https://github.com/w3c/respec/tree/v3.0.6) (2012-05-31)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.5...v3.0.6)

**Closed issues:**

- Simpler callback entry [\#14](https://github.com/w3c/respec/issues/14)

## [v3.0.5](https://github.com/w3c/respec/tree/v3.0.5) (2012-05-31)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.4...v3.0.5)

## [v3.0.4](https://github.com/w3c/respec/tree/v3.0.4) (2012-05-31)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.3...v3.0.4)

## [v3.0.3](https://github.com/w3c/respec/tree/v3.0.3) (2012-05-30)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.2...v3.0.3)

**Closed issues:**

- Test System [\#2](https://github.com/w3c/respec/issues/2)

## [v3.0.2](https://github.com/w3c/respec/tree/v3.0.2) (2012-05-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.1...v3.0.2)

## [v3.0.1](https://github.com/w3c/respec/tree/v3.0.1) (2012-05-25)
[Full Changelog](https://github.com/w3c/respec/compare/v3.0.0...v3.0.1)

**Closed issues:**

- Make tool? [\#13](https://github.com/w3c/respec/issues/13)
- Use eventing for progress and communication [\#12](https://github.com/w3c/respec/issues/12)
- Progress signalled through postMessage [\#8](https://github.com/w3c/respec/issues/8)
- Switch to RequireJS loader and build [\#1](https://github.com/w3c/respec/issues/1)

## [v3.0.0](https://github.com/w3c/respec/tree/v3.0.0) (2012-05-24)
[Full Changelog](https://github.com/w3c/respec/compare/v2.9.9...v3.0.0)

## [v2.9.9](https://github.com/w3c/respec/tree/v2.9.9) (2012-05-24)
[Full Changelog](https://github.com/w3c/respec/compare/v2.0.0...v2.9.9)

## [v2.0.0](https://github.com/w3c/respec/tree/v2.0.0) (2012-05-21)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*