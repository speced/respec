describe("Core - Pluralize", () => {
  it("adds pluralization when [data-lt] is not specified", async () => {
    const body = `
      <section id="section">
        <dfn>foo</dfn> can be referenced as
        <a>foo</a> or <a>foos</a>
      </section>`;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#section dfn");
    expect(dfn.id).toEqual("dfn-foo");
    expect(dfn.dataset.lt).toBeFalsy();
    expect(dfn.dataset.plurals).toEqual("foos");
    const links = [...doc.querySelectorAll("#section a")];
    expect(links.length).toEqual(2);
    expect(
      links.every(el => el.getAttribute("href") === "#dfn-foo")
    ).toBeTruthy();
  });

  it("adds pluralization when [data-lt] is defined", async () => {
    const body = `
      <section id="section">
        <dfn data-lt="baz">bar</dfn> can be referenced
        as <a>baz</a>
        or <a>bar</a>
        or <a>bars</a>
        or <a>bazs</a>
        but not as <a id="ignored-link" href="/PASS">bar</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#section dfn");
    expect(dfn.id).toEqual("dfn-baz"); // uses first data-lt as `id`
    expect(dfn.dataset.lt).toEqual("baz|bar");
    expect(dfn.dataset.plurals.split("|").sort()).toEqual(["bars", "bazs"]);
    const validLinks = [...doc.querySelectorAll("#section a[href^='#']")];
    expect(validLinks.length).toEqual(4);
    expect(
      validLinks.every(el => el.getAttribute("href") === "#dfn-baz")
    ).toBeTruthy();
    const ignoredLink = doc.getElementById("ignored-link");
    expect(ignoredLink.href).toEqual(`${window.location.origin}/PASS`);
  });

  it("handles pluralization when data-plurals are defined", async () => {
    const body = `
      <section id="test">
        <dfn data-lt="yeast" data-plurals="fungi">fungus</dfn>
        <a>fungus</a>
        <a>fungi</a>
        <a>yeast</a>
        <a>yeasts</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#test dfn");
    expect(dfn.id).toEqual("dfn-yeast");
    const { lt, plurals } = dfn.dataset;
    expect(lt).toEqual("yeast|fungus");
    expect(plurals.split("|").sort()).toEqual(["fungi", "yeasts"]);
    const links = [...doc.querySelectorAll("#test a[href^='#']")];
    expect(links.length).toEqual(4);
    expect(
      links.every(el => el.getAttribute("href") === "#dfn-yeast")
    ).toBeTruthy();
  });

  it("does nothing if conf.pluralize = false", async () => {
    const body = `
      <section id="section">
        <dfn>foo</dfn> can be referenced
        as <a>foo</a>
        but not as <a>foos</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: false }, body);
    const doc = await makeRSDoc(ops);

    const { id: dfnId } = doc.querySelector("#section dfn");
    expect(dfnId).toBe("dfn-foo");
    const [validLink, invalidLink] = [...doc.querySelectorAll("#section a")];
    expect(validLink.getAttribute("href")).toEqual("#dfn-foo");
    expect(
      invalidLink.classList.contains("respec-offending-element")
    ).toBeTruthy();
  });

  it("does nothing if conf.pluralize is not defined", async () => {
    const body = `
      <section id="section">
        <dfn>foo</dfn> can be referenced
        as <a>foo</a>
        but not as <a>foos</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const { id: dfnId } = doc.querySelector("#section dfn");
    expect(dfnId).toBe("dfn-foo");
    const [validLink, invalidLink] = [...doc.querySelectorAll("#section a")];
    expect(validLink.getAttribute("href")).toEqual("#dfn-foo");
    expect(
      invalidLink.classList.contains("respec-offending-element")
    ).toBeTruthy();
  });

  it("doesn't pluralize when [data-lt-noDefault] is defined", async () => {
    const body = `
      <section id="section">
        <dfn data-lt="baz" data-lt-noDefault>bar</dfn> can be referenced
        as <a>baz</a>
        but not as <a>bar</a> or <a>bars</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#section dfn");
    expect(dfn.id).toEqual("dfn-baz");
    const [validLink, badLink1, badLink2] = [
      ...doc.querySelectorAll("#section a"),
    ];
    expect(validLink.getAttribute("href")).toEqual("#dfn-baz");
    expect(
      badLink1.classList.contains("respec-offending-element")
    ).toBeTruthy();
    expect(
      badLink2.classList.contains("respec-offending-element")
    ).toBeTruthy();
  });

  it("doesn't add pluralization when plural <dfn> exists", async () => {
    const body = `
      <section id="section">
        <dfn>bar</dfn>
        <dfn>bars</dfn>

        <dfn>foo</dfn>
        <dfn data-lt="foos">baz</dfn>

        <a id="link-to-bar">bar</a>
        <a id="link-to-bars">bars</a>
        <a id="link-to-foo">foo</a>

        The following refer to same:
        <div id="links-to-foos">
          <a>foos</a>
          <a>baz</a>
          <a>bazs</a>
          <a data-lt="foos">PASS</a>
          <a data-lt="bazs">PASS</a>
          <a data-lt="baz">PASS</a>
        </div>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfnBar = doc.getElementById("dfn-bar");
    expect(dfnBar).toBeTruthy();
    const dfnBars = doc.getElementById("dfn-bars");
    expect(dfnBars).toBeTruthy();
    const dfnFoo = doc.getElementById("dfn-foo");
    expect(dfnFoo).toBeTruthy();
    expect("lt" in dfnFoo.dataset).toBeFalsy();
    const dfnFoos = doc.getElementById("dfn-foos");
    expect(dfnFoos).toBeTruthy();
    expect(dfnFoos.textContent).toEqual("baz");
    expect(dfnFoos.dataset.lt).toEqual("foos|baz");
    expect(dfnFoos.dataset.plurals).toEqual("bazs");

    const linkToBar = doc.getElementById("link-to-bar");
    const linkToBars = doc.getElementById("link-to-bars");
    const linkToFoo = doc.getElementById("link-to-foo");
    const linksToFoos = [...doc.querySelectorAll("#links-to-foos a")];
    expect(linkToBar.getAttribute("href")).toEqual("#dfn-bar");
    expect(linkToBars.getAttribute("href")).toEqual("#dfn-bars");
    expect(linkToFoo.getAttribute("href")).toEqual("#dfn-foo");
    expect(linksToFoos.length).toBe(6);
    expect(
      linksToFoos.every(el => el.getAttribute("href") === "#dfn-foos")
    ).toBeTruthy();
  });

  it("doesn't add pluralization when no <a> references plural term", async () => {
    const body = `
      <section id="section">
        <dfn data-lt="baz">bar</dfn> can be referenced
        as <a>baz</a> or <a>bar</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#section dfn");
    expect(dfn.id).toEqual("dfn-baz");
    const dfnlt = dfn.dataset.lt.split("|").sort();
    const expectedDfnlt = "bar|baz".split("|"); // no "bars" here
    expect(dfnlt).toEqual(expectedDfnlt);
  });

  it("doesn't add pluralization with [data-lt-no-plural]", async () => {
    const body = `
      <section id="section">
        <dfn data-lt-no-plural>baz</dfn> can be referenced
        only as <a id="goodLink">baz</a>
        and not as <a id="badLink">bazs</a>
      </section>
    `;
    const ops = makeStandardOps({ pluralize: true }, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#section dfn");
    expect(dfn.id).toEqual("dfn-baz"); // uses first data-lt as `id`
    expect(dfn.dataset.lt).toEqual(undefined);
    const [goodLink, badLink] = [...doc.querySelectorAll("#section a")];
    expect(goodLink.getAttribute("href")).toEqual("#dfn-baz");
    expect(badLink.classList.contains("respec-offending-element")).toBeTruthy();
  });
});
