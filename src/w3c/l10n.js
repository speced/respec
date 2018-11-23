// Module w3c/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text
import { l10n } from "../core/l10n";
export const name = "w3c/l10n";
const additions = {
  en: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
  ko: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
  zh: {
    status_at_publication:
      "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过<a href='https://www.w3.org/TR/'>W3C技术报告</a>索引访问。",
  },
  ja: {
    status_at_publication:
      "この節には、公開時点でのこの文書の位置づけが記されている。他の文書によって置き換えられる可能性がある。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。 <a href='https://www.w3.org/TR/'>W3C technical reports index</a> (https://www.w3.org/TR/)",
  },
  nl: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
};

Object.keys(additions).reduce((l10n, key) => {
  Object.assign(l10n[key], additions[key]);
  return l10n;
}, l10n);
