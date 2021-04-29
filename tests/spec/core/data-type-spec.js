import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — data-type attribute", () => {
  afterAll(flushIframes);
  it("assigns the return type as the type for a method", async () => {
    const body = `
      <section>
        <h2><dfn>PaymentRequest</dfn></h2>
        <pre class="idl">
          interface PaymentRequest {
            Promise&lt;undefined&gt; returnsPromise();
            undefined returnsUndefined(DOMString someArg);
          };
        </pre>
        <div data-dfn-for="PaymentRequest">
          <dfn>returnsPromise()</dfn> method
          <dfn>returnsUndefined()</dfn> method
        </div>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // Promise&lt;undefined&gt; returnsPromise();
    const returnsPromise = doc.getElementById(
      "dom-paymentrequest-returnspromise"
    );
    expect(returnsPromise.dataset.type).toBe("Promise");

    // undefined returnsUndefined(DOMString someArg);
    const returnsUndefined = doc.getElementById(
      "dom-paymentrequest-returnsundefined"
    );
    expect(returnsUndefined.dataset.type).toBe("undefined");
  });

  it("adds data-type to an interface's attribute definitions", async () => {
    const body = `
      <section>
        <h2><dfn>PaymentRequest</dfn></h2>
        <pre class="idl">
          interface PaymentRequest {
            readonly attribute unsigned short entryType;
            readonly attribute ( unsigned short or unsigned long long or DOMString ) entryType2;
            readonly attribute (DOMString or ArrayBuffer)? result;
            readonly attribute DOMString id;
            readonly attribute PaymentAddress? shippingAddress;
            readonly attribute FrozenArray&lt;DOMString> addressLine;
            attribute EventHandler onmerchantvalidation;
          };
        </pre>
        <div data-dfn-for="PaymentRequest">
          <dfn>entryType</dfn> attribute
          <dfn>entryType2</dfn> attribute
          <dfn>result</dfn> attribute
          <dfn>id</dfn> attribute
          <dfn>shippingAddress</dfn> attribute
          <dfn>addressLine</dfn> attribute
          <dfn>onmerchantvalidation</dfn> attribute
        </div>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // readonly attribute (DOMString or ArrayBuffer)? result;
    const entryType2 = doc.getElementById("dom-paymentrequest-entrytype2");
    expect(entryType2.dataset.type).toBe(
      "unsigned short|unsigned long long|DOMString"
    );

    // readonly attribute (DOMString or ArrayBuffer)? result;
    const entryType = doc.getElementById("dom-paymentrequest-entrytype");
    expect(entryType.dataset.type).toBe("unsigned short");

    // readonly attribute (DOMString or ArrayBuffer)? result;
    const result = doc.getElementById("dom-paymentrequest-result");
    expect(result.dataset.type).toBe("DOMString|ArrayBuffer");

    // readonly attribute DOMString id;
    const id = doc.getElementById("dom-paymentrequest-id");
    expect(id.dataset.type).toBe("DOMString");

    // readonly attribute PaymentAddress? shippingAddress;
    const shippingAddress = doc.getElementById(
      "dom-paymentrequest-shippingaddress"
    );
    expect(shippingAddress.dataset.type).toBe("PaymentAddress");

    // readonly attribute FrozenArray<DOMString> addressLine;
    const addressLine = doc.getElementById("dom-paymentrequest-addressline");
    expect(addressLine.dataset.type).toBe("FrozenArray");

    // attribute EventHandler onmerchantvalidation;
    const onmerchantvalidation = doc.getElementById(
      "dom-paymentrequest-onmerchantvalidation"
    );
    expect(onmerchantvalidation.dataset.type).toBe("EventHandler");
  });

  it("adds data-type to an dictionary's member definitions", async () => {
    const body = `
      <section>
        <h2><dfn>PaymentMethodData</dfn> dictionary</h2>
        <pre class="idl">
          dictionary PaymentMethodData {
            required DOMString supportedMethods;
            object? data = null;
            sequence&lt;PaymentItem&gt; displayItems;
          };
        </pre>
        <div data-dfn-for="PaymentMethodData">
          <dfn>supportedMethods</dfn> member
          <dfn>data </dfn> member
          <dfn>displayItems</dfn> member
        </div>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // required DOMString supportedMethods;
    const supportedMethods = doc.getElementById(
      "dom-paymentmethoddata-supportedmethods"
    );
    expect(supportedMethods.dataset.type).toBe("DOMString");

    // object data;
    const dataMember = doc.getElementById("dom-paymentmethoddata-data");
    expect(dataMember.dataset.type).toBe("object");

    // sequence<PaymentItem> displayItems;
    const displayItems = doc.getElementById(
      "dom-paymentmethoddata-displayitems"
    );
    expect(displayItems.dataset.type).toBe("sequence");
  });

  it("propagates data-type to subsequent instances of a <var>", async () => {
    const body = `
    <section>
      <p id="a1">First instance of |varA|.</p>
      <p id="a2">Second instance of |varA: DOMString|.</p>
      <p id="a3">Third instance of |varA|.</p>
      <p id="a4">Fourth instance of |varA: float|.</p>
      <p id="b1">First instance of |varB:DOMString|.</p>
      <p id="a5">Fifth instance of |varA|.</p>
      <section>
        <p id="a6">First instance of |varA| in this section.</p>
        <p id="b2">First instance of |varB: sequence&lt;Promise>|.</p>
        <p id="b3">Second instance of |varB|.</p>
      </section>
    </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const a1 = doc.querySelector("#a1 var");
    expect(a1.textContent).toBe("varA");
    expect(a1.dataset.type).toBeUndefined();

    const a2 = doc.querySelector("#a2 var");
    expect(a2.textContent).toBe("varA");
    expect(a2.dataset.type).toBe("DOMString");

    const a3 = doc.querySelector("#a3 var");
    expect(a3.textContent).toBe("varA");
    expect(a3.dataset.type).toBe("DOMString");

    const a4 = doc.querySelector("#a4 var");
    expect(a4.textContent).toBe("varA");
    expect(a4.dataset.type).toBe("float");

    const a5 = doc.querySelector("#a5 var");
    expect(a5.textContent).toBe("varA");
    expect(a5.dataset.type).toBe("float");

    const b1 = doc.querySelector("#b1 var");
    expect(b1.textContent).toBe("varB");
    expect(b1.dataset.type).toBe("DOMString");

    const a6 = doc.querySelector("#a6 var");
    expect(a6.textContent).toBe("varA");
    expect(a6.dataset.type).toBeUndefined();

    const b2 = doc.querySelector("#b2 var");
    expect(b2.textContent).toBe("varB");
    expect(b2.dataset.type).toBe("sequence<Promise>");

    const b3 = doc.querySelector("#b2 var");
    expect(b3.textContent).toBe("varB");
    expect(b3.dataset.type).toBe("sequence<Promise>");
  });
});
