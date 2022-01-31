import { pub, sub } from "../../../src/core/pubsubhub.js";

describe("Core - pubsubhub", () => {
  it("subscribes", () => {
    let result = "fail";
    sub("test-1", ({ value }) => {
      result = `pass ${value}`;
    });
    for (const i of [1, 2, 3]) {
      pub("test-1", { value: i });
      expect(result).toBe(`pass ${i}`);
    }
  });

  it("publishes messages to subscribed events once", () => {
    let result = "fail";
    sub(
      "test-2",
      ({ value }) => {
        result = value;
      },
      { once: true }
    );
    pub("test-2", { value: "pass" });
    for (const i of [1, 2, 3]) {
      pub("test-2", { value: `fail ${i}` });
    }
    expect(result).toBe("pass");
  });
});
