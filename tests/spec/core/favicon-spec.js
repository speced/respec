import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Favicon", () => {
  afterAll(flushIframes);

  it("does not add a favicon by default", async () => {
    const ops = makeStandardOps({});
    const doc = await makeRSDoc(ops);

    const linkTag = doc.querySelector("link[rel='icon']");
    expect(linkTag).toBeNull();
  });

  it("does not add a favicon with a false value", async () => {
    const ops = makeStandardOps({ favicon: false });
    const doc = await makeRSDoc(ops);

    const linkTag = doc.querySelector("link[rel='icon']");
    expect(linkTag).toBeNull();
  });

  it("adds a favicon link", async () => {
    const rbFavRed = "https://berjon.com/ED2B33.png";
    const ops = makeStandardOps({ favicon: rbFavRed });
    const doc = await makeRSDoc(ops);

    const linkTag = doc.querySelector("link[rel='icon']");
    expect(linkTag.href).toBe(rbFavRed);
  });

  it("adds a favicon using Unicode", async () => {
    const ops = makeStandardOps({ favicon: "😻" });
    const doc = await makeRSDoc(ops);

    const linkTag = doc.querySelector("link[rel='icon']");
    // keep this as getAttribute to avoid escaping issues
    expect(linkTag.getAttribute("href")).toBe(
      "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%22105%22>😻</text></svg>"
    );
  });
});
