"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core - Figures", () => {
  afterAll(flushIframes);
  it("creates autolinks from the anchor to the figure", async () => {
    const body = `
       <figure id='fig'>
        <figcaption>test figure caption</figcaption>
       </figure>
       <a id='anchor-fig-title-empty' title='' href='#fig'></a>
       <a id='anchor-fig-title-set' title='pass' href='#fig'></a>
       <a id='anchor-fig' href='#fig'></a>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const anchorFig = doc.getElementById("anchor-fig");
    const anchorFigTitleSet = doc.getElementById("anchor-fig-title-set");
    const anchorFigTitleEmpty = doc.getElementById("anchor-fig-title-empty");

    expect(anchorFig.textContent).toBe("Figure 1");
    expect(anchorFig.title).toBe("test figure caption");

    expect(anchorFigTitleSet.textContent).toBe("Figure 1");
    expect(anchorFigTitleSet.title).toBe("pass");

    expect(anchorFigTitleEmpty.textContent).toBe("Figure 1");
    expect(anchorFigTitleEmpty.title).toBe("");
  });

  it("creates autolinks from the caption to the figure", async () => {
    const body = `
       <figure id='fig'>
        <figcaption>test figure caption</figcaption>
       </figure>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const caption = doc.getElementsByTagName("figcaption")[0];
    const link = caption.querySelector("a");

    expect(link.classList).toContain("self-link");
    expect(link.hash).toBe("#fig");
  });

  it("localizes the anchor of figure", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}<figure id='fig'> <img src='img' alt=''>
        <figcaption>漢字と仮名のサイズの示し方</figcaption>
       </figure>
       <a id='anchor-fig' href='#fig'></a>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("anchor-fig");
    expect(anchorFig.innerText).toBe("図 1");
    expect(anchorFig.title).toBe("漢字と仮名のサイズの示し方");
  });

  it("generates list of figures", async () => {
    const body = `
      <figure>
        <img src='img' alt=''>
        <figcaption>test 1</figcaption>
      </figure>
      <figure>
        <img src='img' alt=''>
        <figcaption>test 2</figcaption>
      </figure>
      <section id=tof></section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const tof = doc.getElementById("tof");
    const tofHeader = tof.querySelector("h2");
    const tofItems = tof.querySelectorAll("ul li");
    const figLinks = tof.querySelectorAll("ul li a");
    expect(tof.querySelector("figcaption")).toBeNull();
    expect(tofHeader).toBeTruthy();
    expect(tofHeader.textContent).toBe("1. List of Figures");
    expect(tofItems).toHaveSize(2);
    expect(figLinks[0].textContent).toBe("Figure 1 test 1");
    expect(figLinks[1].textContent).toBe("Figure 2 test 2");
  });

  it("warns when no <figcaption>", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}<figure id='fig'><img src='img' alt=''></figure>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("fig");
    expect(anchorFig.classList).toContain("respec-offending-element");
  });

  it("excludes figures with no <figcaption>", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body: `${makeDefaultBody()}
      <figure><img src='img' alt=''></figure>
      <figure><img src='img' alt=''><figcaption>Geralt of Rivia</figcaption</figure>
      <section id=tof></section>`,
    };
    const doc = await makeRSDoc(ops);
    const tof = doc.getElementById("tof");
    const tofItems = tof.querySelectorAll("ul li");
    expect(tof.querySelector("figcaption")).toBeNull();
    expect(tofItems).toHaveSize(1);
  });

  it("localizes list of figures", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "nl",
      },
      body: `
      <section id="tof" class="informative appendix"></section>
      <section>
        <figure id='figure'> <img src='img' alt=''>
          <figcaption>Example Figure</figcaption>
        </figure>
      </section>`,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.querySelector("#tof h2");
    expect(doc.documentElement.lang).toBe("nl");
    expect(textContent).toContain("Lijst met figuren");
  });
});
