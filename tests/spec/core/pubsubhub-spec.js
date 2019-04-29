import { pub, sub, unsub } from "../../../src/core/pubsubhub.js";

describe("Core - pubsubhub", () => {
  it("subscribes", () => {
    let result = "fail";
    const obj = sub("test", ({ value }) => {
      result = `pass ${value}`;
    });
    for (const i of [1, 2, 3]) {
      pub("test", { value: i });
      expect(result).toBe(`pass ${i}`);
    }
    unsub(obj);
  });

  it("unsubscribes", () => {
    let result = "pass";
    const obj = sub("test", () => {
      result = "fail";
    });
    unsub(obj);
    pub("test");
    expect(result).toBe("pass");
  });

  it("publishes messages to subscribed events once", () => {
    let result = "fail";
    const obj = sub(
      "test",
      ({ value }) => {
        result = value;
      },
      { once: true }
    );
    pub("test", { value: "pass" });
    for (const i of [1, 2, 3]) {
      pub("test", { value: `fail ${i}` });
    }
    expect(result).toBe("pass");
    unsub(obj);
  });
});
