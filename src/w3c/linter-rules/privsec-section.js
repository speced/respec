/**
 * Checks that there is a section that has at least privacy and/or
 * security and considerations.
 *
 * The rule is "privacy" or "security", and "considerations", in any order,
 * case-insensitive, multi-line check.
 *
 */
import LinterRule from "../../core/LinterRule";
import { lang as defaultLang } from "../../core/l10n";
const name = "privsec-section";
const meta = {
  en: {
    description:
      "Document must a 'Privacy and/or Security' Considerations section.",
    howToFix: "Add a privacy and/or security considerations section.",
    help:
      "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

function hasPriSecConsiderations(doc) {
  return Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6")).some(
    ({ textContent: text }) => {
      const saysPrivOrSec = /(privacy|security)/im.test(text);
      const saysConsiderations = /(considerations)/im.test(text);
      return (saysPrivOrSec && saysConsiderations) || saysPrivOrSec;
    }
  );
}

function lintingFunction(conf, doc) {
  const results = [];
  if (conf.isRecTrack && !hasPriSecConsiderations(doc)) {
    results.push({ name, occurrences: 1, ...meta[lang] });
  }
  return results;
}

export const rule = new LinterRule(name, lintingFunction);
