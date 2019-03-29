describe("Core Post Process", () => {
  it("emits an error if post-process array contains non-functions", async () => {
    const ops = makeStandardOps({
      collectErrors: true,
      postProcess: [
        {
          text: "this should not be here",
        },
      ],
    });
    const doc = await makeRSDoc(ops);
    const { collectedErrors } = doc.defaultView.respecConfig;
    expect(collectedErrors.size).toEqual(1);
    expect(
      collectedErrors.has("Every item in `postProcess` must be a JS function.")
    ).toBe(true);
  });
});
