import hyperHTML from "../../deps/hyperhtml";

export default () => {
  const html = hyperHTML;
  return html`
    <h2>Conformance</h2>
    <p>
      As well as sections marked as non-normative, all authoring guidelines,
      diagrams, examples, and notes in this specification are non-normative.
      Everything else in this specification is normative.
    </p>
    <p id="respecRFC2119">to be interpreted as described in [[!RFC2119]].</p>
  `;
};
