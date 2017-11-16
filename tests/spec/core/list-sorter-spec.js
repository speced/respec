"use strict";
describe("Core — list-sorter", () => {
  let doc;
  beforeAll(async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `
        <dl data-sort="ascending">
          <dt>Z</dt>
          <dd>First</dd>
          <dd>Last when sorted.</dd>
          <dt>h</dt>
          <dt>a</dt>
          <dt>W</dt>
        </dl>
        <dl data-sort="descending">
          <dt>9</dt>
          <dt>3</dt>
          <dt>1</dt>
        </dl>
        <dl id="dont-sort">
          <dt>dont</dt>
          <dt>sort</dt>
          <dt>me</dt>
        </dl>
        <dl id="default-sort" data-sort>
          <dt>9</dt>
          <dt>3</dt>
          <dt>1</dt>
        </dl>
      `,
    };
    doc = await makeRSDoc(ops);
  });
  
  afterAll(flushIframes);

  it("sorts definition lists in ascending order", () => {
    const list = doc.querySelector("dl[data-sort='ascending']");
    const firstDt = list.querySelector("dt:first-of-type");
    const lastDt = list.querySelector("dt:last-of-type");
    expect(firstDt.textContent).toEqual("a");
    expect(lastDt.textContent).toEqual("Z");
    expect(lastDt.nextElementSibling.textContent).toEqual("First");
    expect(list.lastElementChild.textContent).toEqual("Last when sorted.");
  });

  it("sorts definition lists in descending order", () => {
    const list = doc.querySelector("dl[data-sort='descending']");
    expect(list.firstElementChild.textContent).toEqual("9");
    expect(list.lastElementChild.textContent).toEqual("1");
  });

  it("defaults to sorting in definition lists in ascending order", () => {
    const list = doc.querySelector("#default-sort");
    expect(list.firstElementChild.textContent).toEqual("1");
    expect(list.lastElementChild.textContent).toEqual("9");
  });

  it("leaves unmarked lists alone", () => {
    const list = doc.querySelector("#dont-sort");
    expect(list.firstElementChild.textContent).toEqual("dont");
    expect(list.lastElementChild.textContent).toEqual("me");
  });
});
