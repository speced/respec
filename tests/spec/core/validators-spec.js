import {
  validateCommonName,
  validateDOMName,
  validateMimeType,
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
        expect(validateDOMName(element, "element", dfn, "foo/bar"))
          .withContext(`element name: ${element}`)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element")).toBeFalse();
      }
    });

    it("generates an error if the element name is not valid", () => {
      const elements = ["my element", "crypto$", "🪳", "-something", ""];
      for (const element of elements) {
        const dfn = document.createElement("dfn");
        expect(validateDOMName(element, "element", dfn, "foo/bar"))
          .withContext(`element name: ${element}`)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element")).toBeTrue();
      }
    });

    it("doesn't generates an error if the attribute is valid", () => {
      const attributes = ["crossorigin", "aria-hidden", "aria-roledescription"];
      for (const attribute of attributes) {
        const dfn = document.createElement("dfn");
        expect(validateDOMName(attribute, "attribute", dfn, "foo/bar"))
          .withContext(`attribute name: ${attribute}`)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element")).toBeFalse();
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
        expect(validateMimeType(mimeType, "mimetype", dfn, "foo/bar"))
          .withContext(`mime type: ${mimeType}`)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element")).toBeFalse();
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
        expect(validateMimeType(mimeType, "mimetype", dfn, "foo/bar"))
          .withContext(`invalid mimetype: ${mimeType}`)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element")).toBeTrue();
      }
    });
  });
  describe("validateCommonName", () => {
    it("generates no error if the name is valid", () => {
      const names = ["foo", "bar", "baz", "quux"];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        expect(validateCommonName(name, "event", dfn, "foo/bar"))
          .withContext(`name: ${name}`)
          .toBeTrue();
        expect(dfn.classList.contains("respec-offending-element")).toBeFalse();
      }
    });

    it("it generates an error if the name is not valid", () => {
      const names = ["my event", "crypto$", "🪳", "-something"];
      for (const name of names) {
        const dfn = document.createElement("dfn");
        expect(validateCommonName(name, "event", dfn, "foo/bar"))
          .withContext(`invalid name: ${name}`)
          .toBeFalse();
        expect(dfn.classList.contains("respec-offending-element")).toBeTrue();
      }
    });
  });
});
