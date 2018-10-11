describe("Core — data-type attribute", () => {
  afterAll(flushIframes);
  it("assigns the return type as the type for a method", async () => {
    const body = `
      <section>
        <h2><dfn>PaymentRequest</dfn></h2>
        <pre class="idl">
          interface PaymentRequest {
            Promise&lt;void&gt; returnsPromise();
            void returnsVoid(DOMString someArg);
          };
        </pre>
        <div data-dfn-for="PaymentRequest">
          <dfn>returnsPromise()</dfn> method
          <dfn>returnsVoid()</dfn> method
        </div>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // Promise&lt;void&gt; returnsPromise();
    const returnsPromise = doc.getElementById(
      "dom-paymentrequest-returnspromise"
    );
    expect(returnsPromise.dataset.type).toBe("Promise");

    // void returnsVoid(DOMString someArg);
    const returnsVoid = doc.getElementById("dom-paymentrequest-returnsvoid");
    expect(returnsVoid.dataset.type).toBe("void");
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
});
