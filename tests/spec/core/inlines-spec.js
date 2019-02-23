"use strict";
describe("Core - Inlines", () => {
  afterAll(flushIframes);
  it("processes inline cite content", async () => {
    const body = `
      <section id="conformance">
        <p>[[dom]] and [[html]] are normative in normative section.</p>
        <p>Normative section can have informative refs [[?infra]].</p>
        <p>Adding a MUST, MAY, SHOULD, adds RFC2119.</p>
      </section>
      <section class="informative">
        <p>[[webidl]] is informative.</p>
        <p id="illegal">A normative reference in informative section [[!svg]] is illegal.
        But we keep it as normative and emit a warning.</p>
        <p id="illegal-no-warn">A normative reference in informative section [[dom]] is illegal.
        But as it is already declared as normative above, we keep it as normative and do not emit warning.</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const norm = [...doc.querySelectorAll("#normative-references dt")];
    expect(norm.length).toBe(4);
    expect(norm.map(el => el.textContent)).toEqual([
      "[dom]",
      "[html]",
      "[RFC2119]", // added by conformance section
      "[svg]",
    ]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform.length).toBe(2);
    expect(inform.map(el => el.textContent)).toEqual(["[infra]", "[webidl]"]);

    const links = [...doc.querySelectorAll("section cite a")];
    expect(links.length).toBe(7);
    expect(links[0].textContent).toBe("RFC2119");
    expect(links[0].getAttribute("href")).toBe("#bib-rfc2119");
    expect(links[1].textContent).toBe("dom");
    expect(links[1].getAttribute("href")).toBe("#bib-dom");
    expect(links[5].textContent).toBe("svg");
    expect(links[5].getAttribute("href")).toBe("#bib-svg");

    const illegalCite = doc.querySelector("#illegal cite");
    expect(illegalCite.classList.contains("respec-offending-element")).toBe(
      true
    );

    const illegalCiteNoWarn = doc.querySelector("#illegal-no-warn cite");
    expect(
      illegalCiteNoWarn.classList.contains("respec-offending-element")
    ).toBe(false);
  });

  it("processes abbr and rfc2119 content", async () => {
    const body = `
      <section id='inlines'>
        <p><abbr title='ABBR-TIT'>ABBR</abbr> ABBR</p>
        <p>MUST and NOT RECOMMENDED</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const inl = doc.getElementById("inlines");

    const abbr = inl.querySelectorAll("abbr[title='ABBR-TIT']");
    expect(abbr.length).toBe(2);
    expect([...abbr].every(({ textContent: t }) => t === "ABBR")).toBeTruthy();

    const rfc2119 = [...inl.querySelectorAll("em.rfc2119")];
    expect(rfc2119.length).toBe(2);
    expect(rfc2119[0].textContent).toBe("MUST");
    expect(rfc2119[1].textContent).toBe("NOT RECOMMENDED");
  });
});
