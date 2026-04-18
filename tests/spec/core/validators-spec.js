import {
  validateCommonName,
  validateDOMName,
  validateMimeType,
  validateQuotedString,
} from "../../../src/core/dfn-validators.js";

describe("Core - Validators", () => {
  describe("validateDOMName", () => {
    it("doesn't generate an error if the element is valid", () => {
      const elements = [
        "h1",
        "feSpecularLighting",
        "feGaussianBlur",
        "body",
        "html",
      ];
      for (const element of elements) {
        const dfn = document.createElement("dfn");
        const context = `element name: ${element}`;
        expect(validateDOMName(element, "element", dfn, "foo/bar"))
          .withContext(context)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeFalse();
      }
    });

    it("generates an error if the element name is not valid", () => {
      // Note: emoji like 🪳 (U+1FAB3) are valid NameStartChar per XML
      // [#x10000-#xEFFFF], so Chrome correctly does NOT throw for them.
      const elements = ["my element", "crypto$", "-something", ""];
      for (const element of elements) {
        const dfn = document.createElement("dfn");
        const context = `element name: ${element}`;
        expect(validateDOMName(element, "element", dfn, "foo/bar"))
          .withContext(context)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeTrue();
      }
    });

    it("doesn't generates an error if the attribute name is valid", () => {
      const attributes = ["crossorigin", "aria-hidden", "aria-roledescription"];
      for (const attribute of attributes) {
        const context = `attribute name: ${attribute}`;
        const dfn = document.createElement("dfn");
        expect(validateDOMName(attribute, "element-attr", dfn, "foo/bar"))
          .withContext(context)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeFalse();
      }
    });

    it("generates an error if the attribute name is invalid", () => {
      // Note: emoji like 😇 (U+1F607) are valid NameChar per XML
      // [#x10000-#xEFFFF], so "aria-😇" is valid and Chrome does not throw.
      const attributes = ["-crossorigin", "-whatever-"];
      for (const attribute of attributes) {
        const context = `attribute name: ${attribute}`;
        const dfn = document.createElement("dfn");
        expect(validateDOMName(attribute, "element-attr", dfn, "foo/bar"))
          .withContext(context)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeTrue();
      }
    });
  });

  describe("validateMimeType", () => {
    it("generates no error if the mimeType is valid", () => {
      const mimeTypes = [
        "image/svg+xml",
        "application/x-font-woff",
        "image/jpeg",
        "text/plain",
      ];
      for (const mimeType of mimeTypes) {
        const dfn = document.createElement("dfn");
        const context = `mimeType: ${mimeType}`;
        expect(validateMimeType(mimeType, "mimetype", dfn, "foo/bar"))
          .withContext(context)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeFalse();
      }
    });

    it("generates error if the mimeType is not valid", () => {
      const mimeTypes = [
        "text\\plain",
        "not a mimetype",
        "a/b;c=this is quoted;e=f",
      ];
      for (const mimeType of mimeTypes) {
        const dfn = document.createElement("dfn");
        const context = `invalid mimeType: ${mimeType}`;
        expect(validateMimeType(mimeType, "mimetype", dfn, "foo/bar"))
          .withContext(context)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeTrue();
      }
    });
  });

  describe("validateQuotedString", () => {
    it("doesn't generate an error if the string is valid", () => {
      const names = ['"quoted"', '"quoted-string"'];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        const context = `string: ${name}`;
        expect(validateQuotedString(name, "string", dfn, "foo/bar"))
          .withContext(context)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeFalse();
      }
    });

    it("generates errors for unquoted strings", () => {
      const names = [
        "spaced string",
        "thing$",
        '"start only',
        'end only"',
        "-something",
      ];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        const context = `invalid name: ${name}`;
        expect(validateQuotedString(name, "permission", dfn, "foo/bar"))
          .withContext(context)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeTrue();
      }
    });
  });

  describe("validateCommonName", () => {
    it("generates no error if the name is valid", () => {
      const names = ["foo", "bar", "baz", "quux"];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        const context = `name: ${name}`;
        expect(validateCommonName(name, "event", dfn, "foo/bar"))
          .withContext(context)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeFalse();
      }
    });

    it("it generates an error if the name is not valid", () => {
      const names = ["my event", "crypto$", "🪳", "-something"];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        const context = `invalid name: ${name}`;
        expect(validateCommonName(name, "event", dfn, "foo/bar"))
          .withContext(context)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element"))
          .withContext(context)
          .toBeTrue();
      }
    });
  });
});
