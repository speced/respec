"use strict";
describe("Core — Location Hash", () => {
  afterAll(flushIframes);
  const noOp = () => {};
  var ops = makeStandardOps();
  const simpleURL = "/tests/spec/core/simple.html";
  
  describe("legacy fragment format", () => {
    it("leaves editor defined id alone, even if they include illegal chars", async () => {
      const expectedHash = "#custom_id(¡™£¢∞§¶•ªº)";
      const testURL = `${simpleURL}${expectedHash}`;
      const doc = await makeRSDoc(ops, noOp, testURL);
      expect(decodeURIComponent(doc.location.hash)).toEqual(expectedHash);
    });
    it("recovers from legacy IDL methods frags", async () => {
      const testURL = `${simpleURL}#dom-test-foo()`;
      const doc = await makeRSDoc(ops, noOp, testURL);
      expect(doc.location.hash).toEqual("#dom-test-foo");
    });
    it("recovers legacy encoded hashes for slots", async () => {
      const testURL = `${simpleURL}#dfn-%5B%5Bescapedslot%5D%5D`;
      const doc = await makeRSDoc(ops, noOp, testURL);
      expect(doc.location.hash).toEqual("#dfn-escapedslot");
    });
  });
});
