// @ts-check
// Module w3c/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text
import { html } from "../core/import-maps.js";
import { l10n } from "../core/l10n.js";
export const name = "w3c/l10n";
const additions = {
  en: {
    status_at_publication: html`This section describes the status of this
      document at the time of its publication. Other documents may supersede
      this document. A list of current W3C publications and the latest revision
      of this technical report can be found in the
      <a href="https://www.w3.org/TR/">W3C technical reports index</a> at
      https://www.w3.org/TR/.`,
  },
  ko: {
    status_at_publication: html`이 부분은 현재 문서의 발행 당시 상태에 대해
      기술합니다. 다른 문서가 이 문서를 대체할 수 있습니다. W3C 발행 문서의 최신
      목록 및 테크니컬 리포트 최신판을 https://www.w3.org/TR/ 의
      <a href="https://www.w3.org/TR/">W3C technical reports index</a> 에서
      열람할 수 있습니다.`,
  },
  zh: {
    status_at_publication: html`本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列
      表和最新版本可通过<a href="https://www.w3.org/TR/">W3C技术报告</a
      >索引访问。`,
  },
  ja: {
    status_at_publication: html`この節には、公開時点でのこの文書の位置づけが記されている。他の文書によって置き換えられる可能性がある。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。
      <a href="https://www.w3.org/TR/">W3C technical reports index</a>
      (https://www.w3.org/TR/)`,
  },
  es: {
    status_at_publication: html`Esta sección describe el estado del presente
      documento al momento de su publicación. El presente documento puede ser
      remplazado por otros. Una lista de las publicaciones actuales del W3C y la
      última revisión del presente informe técnico puede hallarse en
      http://www.w3.org/TR/
      <a href="https://www.w3.org/TR/">el índice de informes técnicos</a> del
      W3C.`,
  },
  de: {
    status_at_publication: html`Dieser Abschnitt beschreibt den Status des
      Dokuments zum Zeitpunkt der Publikation. Neuere Dokumente können dieses
      Dokument obsolet machen. Eine Liste der aktuellen Publikatinen des W3C und
      die aktuellste Fassung dieser Spezifikation kann im
      <a href="https://www.w3.org/TR/">W3C technical reports index</a> unter
      https://www.w3.org/TR/ abgerufen werden.`,
  },
};

Object.keys(additions).forEach(key => {
  if (!l10n[key]) l10n[key] = {};
  Object.assign(l10n[key], additions[key]);
});
