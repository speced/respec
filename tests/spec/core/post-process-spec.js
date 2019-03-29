describe("Core Post Process", () => {
  it("emits a warning if post-process array contains non-functions", async () => {
    const ops = {
      config: makeBasicConfig(),
    };

    const errorPromise = new Promise(resolve => {
      ops.config.postProcess = [{ key: "value" }];
      ops.config.onRespecError = error => {
        expect(error).toBe(
          "Every item in `postProcess` must be a JS function."
        );
        resolve();
      };
    });
    await makeRSDoc(ops);
    await Promise.resolve(errorPromise);
  });
});
