"use strict";
describe("Core - Figures", () => {
  afterAll(flushIframes);
  it("creates autolinks from the anchor to the figure", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<figure id='fig'> <img src='img' alt=''>
        <figcaption>test figure caption</figcaption>
       </figure>
       <a id='anchor-fig-title-empty' title='' href='#fig'></a>
       <a id='anchor-fig-title-set' title='pass' href='#fig'></a>
       <a id='anchor-fig' href='#fig'></a>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("anchor-fig");
    const anchorFigTitleSet = doc.getElementById("anchor-fig-title-set");
    const anchorFigTitleEmpty = doc.getElementById("anchor-fig-title-empty");

    expect(anchorFig.innerText).toEqual("Figure 1");
    expect(anchorFig.title).toEqual("test figure caption");

    expect(anchorFigTitleSet.innerText).toEqual("Figure 1");
    expect(anchorFigTitleSet.title).toEqual("pass");

    expect(anchorFigTitleEmpty.innerText).toEqual("Figure 1");
    expect(anchorFigTitleEmpty.title).toEqual("");
  });

  it("localizes the anchor of figure", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body:
        makeDefaultBody() +
        `<figure id='fig'> <img src='img' alt=''>
        <figcaption>漢字と仮名のサイズの示し方</figcaption>
       </figure>
       <a id='anchor-fig' href='#fig'></a>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("anchor-fig");
    expect(anchorFig.innerText).toEqual("図1");
    expect(anchorFig.title).toEqual("漢字と仮名のサイズの示し方");
  });

  it("generates table of figures", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<figure>
          <img src='img' alt=''>
          <figcaption>test 1</figcaption>
        </figure>
        <figure>
          <img src='img' alt=''>
          <figcaption>test 2</figcaption>
        </figure>
        <section id=tof></section>`,
    };
    const doc = await makeRSDoc(ops);
    const tof = doc.getElementById("tof");
    const tofHeader = tof.querySelector("h2");
    const tofItems = tof.querySelectorAll("ul li");
    const figLinks = tof.querySelectorAll("ul li a");
    expect(tofHeader).toBeTruthy();
    expect(tofHeader.textContent).toEqual("1. Table of Figures");
    expect(tofItems.length).toEqual(2);
    expect(figLinks[0].textContent).toEqual("Figure 1 test 1");
    expect(figLinks[1].textContent).toEqual("Figure 2 test 2");
  });

  it("warns when no <figcaption>", async () => {
    const ops = {
      config: makeBasicConfig(),
      htmlAttrs: {
        lang: "ja",
      },
      body:
        makeDefaultBody() + `<figure id='fig'><img src='img' alt=''></figure>`,
    };
    const doc = await makeRSDoc(ops);
    const anchorFig = doc.getElementById("fig");
    expect(
      anchorFig.classList.contains("respec-offending-element")
    ).toBeTruthy();
  });

  describe("normalize images", () => {
    const imgDataURL =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAIAAADUVFKvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gQKACEWdS72PwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAMSURBVAjXY2AgDQAAADAAAceqhY4AAAAASUVORK5CYII=";
    const ops = {
      config: makeBasicConfig(),
      body: `<section>
         <img id="image-with-no-dimensions" src="${imgDataURL}">
         <img id="image-with-dimensions" height=100 width=200 src="${imgDataURL}">
         <img id="image-with-height-only" height=100 src="${imgDataURL}">
         <img id="image-with-width-only" width=200 src="${imgDataURL}">
         <img id="image-with-srcset" srcset="${imgDataURL}">
         <picture>
          <img id="image-inside-picture" src="${imgDataURL}">
         </picture>
      </section>`,
    };

    let doc;
    beforeAll(async () => {
      doc = await makeRSDoc(ops);
    });

    it("sets height and width for images with no height and width", async () => {
      const image = doc.getElementById("image-with-no-dimensions");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("height")).toBeTruthy();
      expect(image.hasAttribute("width")).toBeTruthy();
      expect(image.height).toBe(3);
      expect(image.width).toBe(5);
    });
    it("doesn't change height and width for images with both height and width", async () => {
      const image = doc.getElementById("image-with-dimensions");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("height")).toBeTruthy();
      expect(image.hasAttribute("width")).toBeTruthy();
      expect(image.height).toBe(100);
      expect(image.width).toBe(200);
    });
    it("doesn't change height and width for images with height only", async () => {
      const image = doc.getElementById("image-with-height-only");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("height")).toBeTruthy();
      expect(image.hasAttribute("width")).toBeFalsy();
      expect(image.height).toBe(100);
    });
    it("doesn't change height and width for images with width only", async () => {
      const image = doc.getElementById("image-with-width-only");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("height")).toBeFalsy();
      expect(image.hasAttribute("width")).toBeTruthy();
      expect(image.width).toBe(200);
    });
    it("doesn't change height and width for images with srcset", async () => {
      const image = doc.getElementById("image-with-srcset");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("srcset")).toBeTruthy();
      expect(image.hasAttribute("height")).toBeFalsy();
      expect(image.hasAttribute("width")).toBeFalsy();
      expect(image.srcset).toBe(imgDataURL);
    });
    it("doesn't change height and width for images inside picture", async () => {
      const image = doc.getElementById("image-inside-picture");
      expect(image).toBeTruthy();
      expect(image.hasAttribute("height")).toBeFalsy();
      expect(image.hasAttribute("width")).toBeFalsy();
    });
  });
});
