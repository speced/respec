"use strict";

import {
  flushIframes,
  makeDefaultBody,
  makeRSDoc,
  makeStandardAomOps,
} from "../SpecHelper.js";

describe("AOM — Headers", () => {
  afterEach(flushIframes);

  describe("specStatus", () => {
    it("takes specStatus into account", async () => {
      const ops = makeStandardAomOps({
        specStatus: "PD",
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector(".head h2").textContent).toContain("Pre-Draft");
    });
  });

  describe("precedence order of document title when h1#title and <title> elements are present", () => {
    it('makes h1 always win even when h1#title textContent is ""', async () => {
      const body = `
        <title>Doc Title</title>
        <h1 id='title'></h1>
        ${makeDefaultBody()}
      `;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");
      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("");
      expect(h1.classList).toContain("respec-offending-element");
    });

    it("uses h1#title content and overrides <title> when h1#title has content", async () => {
      const body = `
        <title>hi</title>
        <h1 id='title'>
          override!!!
        </h1>
        ${makeDefaultBody()}`;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("override!!!");
      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("override!!!");
      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent.trim()).toBe("override!!!");
    });
  });

  describe("precedence rules for h1#title is present and <title> is absent", () => {
    it("always uses h1#title content for all the document's titles", async () => {
      const body = `
      <h1 id='title'>This should be <code>pass</code>.</h1>${makeDefaultBody()}`;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("This should be pass.");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("This should be pass.");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.innerHTML).toBe("This should be <code>pass</code>.");
    });

    it("uses h1#title content when h1#title has content", async () => {
      const ops = makeStandardAomOps();
      ops.body = `
        <h1 id='title'><code>pass</code></h1>
        ${makeDefaultBody()}
      `;
      const doc = await makeRSDoc(ops);

      // Title was relocated to head
      const titleInHead = doc.querySelector(".head h1");
      expect(titleInHead.id).toBe("title");

      // html is not escaped
      expect(titleInHead.firstChild.localName).toBe("code");
      expect(titleInHead.textContent).toBe("pass");
    });

    it("makes h1 win even when h1#title is only whitespace", async () => {
      const body = `
        <h1 id='title'>       </h1>
        ${makeDefaultBody()}
      `;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.classList).toContain("respec-offending-element");
    });

    it('makes h1 always win even when h1#title is ""', async () => {
      const body = `
      <h1 id='title'></h1>${makeDefaultBody()}`;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("");
      expect(h1.classList).toContain("respec-offending-element");
    });
  });

  describe("precedence rules for title when h1#title element is not present", () => {
    it("uses <title> when it contains a non-empty string", async () => {
      const body = `<title>Title!!!</title>${makeDefaultBody()}`;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("Title!!!");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("Title!!!");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("Title!!!");
    });

    it("uses a default title when the document excludes a title", async () => {
      const ops = makeStandardAomOps({}, makeDefaultBody());
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("No Title");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("No Title");

      const h1 = doc.querySelector("h1#title");
      expect(h1.textContent).toBe("No Title");
    });

    it("uses a default title when <title> contains an empty string", async () => {
      const body = `<title></title>${makeDefaultBody()}`;
      const ops = makeStandardAomOps({}, body);
      const doc = await makeRSDoc(ops);
      expect(doc.title).toBe("No Title");

      const titleElem = doc.querySelector("title");
      expect(titleElem).toBeTruthy();
      expect(titleElem.textContent).toBe("No Title");

      const h1 = doc.querySelector("h1#title");
      expect(h1).toBeTruthy();
      expect(h1.textContent).toBe("No Title");
    });
  });

  describe("subtitle", () => {
    it("handles missing subtitle", async () => {
      const ops = makeStandardAomOps();
      const newProps = {
        specStatus: "REC",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      expect(doc.getElementById("subtitle")).toBeNull();
    });

    it("uses existing h2#subtitle as subtitle", async () => {
      const ops = makeStandardAomOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      const subTitleElements = doc.querySelectorAll("h2#subtitle");
      expect(subTitleElements).toHaveSize(1);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");

      const [h2Elem] = subTitleElements;
      expect(h2Elem.textContent).toBe("pass");

      // make sure it was relocated to head
      expect(h2Elem.closest(".head")).toBeTruthy();

      expect(h2Elem.firstElementChild.localName).toBe("code");
      expect(h2Elem.firstElementChild.textContent).toBe("pass");
    });

    it("overwrites conf.subtitle if it exists", async () => {
      const ops = makeStandardAomOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const newProps = {
        subtitle: "fail - this should have been overridden by the <h2>",
      };
      Object.assign(ops.config, newProps);

      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");
    });

    it("sets conf.subtitle if it doesn't exist, but h2#subtitle exists", async () => {
      const ops = makeStandardAomOps();
      ops.body = `<h2 id='subtitle'><code>pass</code></h2>${makeDefaultBody()}`;
      const doc = await makeRSDoc(ops);

      const { subtitle } = doc.defaultView.respecConfig;
      expect(subtitle).toBe("pass");
    });

    it("generates a subtitle from the `subtitle` configuration option", async () => {
      const ops = makeStandardAomOps();
      const newProps = {
        specStatus: "REC",
        subtitle: "pass",
      };
      Object.assign(ops.config, newProps);
      const doc = await makeRSDoc(ops);
      const h2Elem = doc.getElementById("subtitle");
      expect(h2Elem).toBeTruthy();
      expect(h2Elem.textContent.trim()).toBe("pass");
    });
  });

  describe("license configuration", () => {
    it("makes sure that p.copyright wins", async () => {
      const config = {
        specStatus: "PD",
        shortName: "whatever",
        editors: [{ name: "foo" }],
      };
      const body = "<p class='copyright'>pass</p>";
      const ops = makeStandardAomOps(config, body);

      const doc = await makeRSDoc(ops);
      const copyright = doc.querySelectorAll("div.head p.copyright");
      expect(copyright).toHaveSize(1);
      expect(copyright[0].tagName).toBe("P");
      expect(copyright[0].textContent).toBe("pass");
    });
  });

  describe("otherLinks", () => {
    it("renders otherLinks with value and href", async () => {
      const otherLinks = [
        {
          class: "key-other-link",
          key: "KEY:",
          data: [{ value: "VALUE", href: "HREF" }],
        },
      ];
      const ops = makeStandardAomOps({ otherLinks });
      const doc = await makeRSDoc(ops);

      const dt = doc.querySelector(".head dt.key-other-link");
      expect(dt.textContent).toBe("KEY:");
      const dd = dt.nextElementSibling;
      expect(dd.localName).toBe("dd");
      expect(dd.querySelector("a").textContent).toBe("VALUE");
      expect(dd.querySelector("a").getAttribute("href")).toBe("HREF");
    });

    it("renders otherLinks without href", async () => {
      const otherLinks = [
        {
          class: "key-other-link",
          key: "KEY:",
          data: [{ value: "VALUE" }],
        },
      ];
      const ops = makeStandardAomOps({ otherLinks });
      const doc = await makeRSDoc(ops);

      const dt = doc.querySelector(".head dt.key-other-link");
      expect(dt.textContent).toBe("KEY:");
      const dd = dt.nextElementSibling;
      expect(dd.localName).toBe("dd");
      expect(dd.textContent.trim()).toBe("VALUE");
      expect(dd.querySelector("a")).toBeNull();
    });
  });

  it("it allows custom copyright directly in document, which gets relocated to the .head", async () => {
    const body = `
      <p class="copyright">
        No copyright intended.
      </p>
    `;
    const ops = makeStandardAomOps({}, body);
    const doc = await makeRSDoc(ops);
    const copyright = doc.querySelector(".head p.copyright");
    expect(copyright).toBeTruthy();
    expect(copyright.textContent.trim()).toBe("No copyright intended.");
    expect(doc.querySelectorAll(".copyright")).toHaveSize(1);
  });

  describe("logos", () => {
    it("adds logos defined by configuration", async () => {
      const ops = makeStandardAomOps();
      const logos = [
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          alt: "this is a small gif",
          height: 765,
          width: 346,
          url: "http://hyperlink/",
        },
        {
          src: 'data:image/svg+xml,<svg%20xmlns="http://www.w3.org/2000/svg"/>',
          alt: "this is an svg",
          height: 315,
          width: 961,
          url: "http://prod/",
        },
        {
          src: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
          alt: "this is a larger gif",
          height: 876,
          width: 283,
          url: "http://shiny/",
        },
      ];
      Object.assign(ops.config, { logos });
      const doc = await makeRSDoc(ops);
      // get logos
      const logosAnchors = doc.querySelectorAll(".logo");
      expect(logos).toHaveSize(3);
      logosAnchors.forEach((anchor, i) => {
        const logo = logos[i];
        const img = anchor.querySelector("img");
        expect(anchor.href).toBe(logo.url);
        expect(img.src).toBe(logo.src);
        expect(img.alt).toBe(logo.alt);
        expect(img.height).toBe(logo.height);
        expect(img.width).toBe(logo.width);
      });
    });
  });
});
