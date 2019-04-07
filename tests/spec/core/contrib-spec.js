"use strict";
describe("Core — Contributors", () => {
  afterAll(flushIframes);
  it("lists contributors and commenters", async () => {
    const githubConfig = {
      github: "https://github.com/mock-company/mock-repository",
      githubAPI: `${window.location.origin}/tests/data/mock-repo.json`,
      editors: [
        {
          name: "Markus Lanthaler",
        },
      ],
    };
    const ops = {
      config: githubConfig,
      body: `${makeDefaultBody()}
        <section id="contrib">
          <div id='gh-contributors'></div>
          <div id='gh-commenters'></div>
        </section>
        
      `,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("#contrib div")[0].textContent).toBe(
      "Foo Bar and John Doe"
    );
    expect(doc.querySelectorAll("#contrib div")[1].textContent).toBe(
      "John Doe"
    );
  });
});
