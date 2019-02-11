describe("Core — Style", () => {
  afterAll(flushIframes);
  test("includes ReSpec's style element", async () => {
    const doc = await makeRSDoc(makeStandardOps());
    const style = doc.getElementById("respec-mainstyle");
    expect(style).toBeTruthy();
  });
});
