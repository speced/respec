"use strict";
describe("Core - Inlines", () => {
  afterAll(flushIframes);
  it("processes inline cite content", async () => {
    const body = `
      <section>
        <p>[[dom]] and [[!html]] are normative in normative section.</p>
        <p>Normative section can have informative refs [[?infra]].</p>
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
    expect(norm.length).toEqual(3);
    expect(norm.map(el => el.textContent)).toEqual([
      "[dom]",
      "[html]",
      "[svg]",
    ]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform.length).toEqual(2);
    expect(inform.map(el => el.textContent)).toEqual(["[infra]", "[webidl]"]);

    const links = [...doc.querySelectorAll("section cite a")];
    expect(links.length).toEqual(6);
    expect(links[0].textContent).toEqual("dom");
    expect(links[0].getAttribute("href")).toEqual("#bib-dom");
    expect(links[4].textContent).toEqual("svg");
    expect(links[4].getAttribute("href")).toEqual("#bib-svg");

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
    expect(abbr.length).toEqual(2);
    expect([...abbr].every(({ textContent: t }) => t === "ABBR")).toBeTruthy();

    const rfc2119 = [...inl.querySelectorAll("em.rfc2119")];
    expect(rfc2119.length).toEqual(2);
    expect(rfc2119[0].textContent).toEqual("MUST");
    expect(rfc2119[1].textContent).toEqual("NOT RECOMMENDED");
  });
});
