// @ts-check
/**
 * The Status of This Document of a Community Group specification using the
 * redesign.
 *
 * It adds nothing. Everything the old CG boilerplate said here -- what kind of
 * document this is, which agreement applies, how much to rely on it, where to
 * send comments -- the redesigned header box and the "Get involved" section
 * now say, in the places a reader actually looks. Saying it twice is two
 * wordings to keep in step, so this template carries only the heading and
 * whatever the editors wrote themselves.
 */

import { l10n, renderPreview } from "./sotd.js";
import { html } from "../../core/import-maps.js";

/**
 * @param {Conf} conf
 * @param {{ additionalContent: DocumentFragment; additionalSections: NodeList }} opts
 */
export default (conf, opts) => {
  return html`
    <h2>${l10n.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""} ${opts.additionalContent}
    ${opts.additionalSections}
  `;
};
