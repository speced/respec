respecConfig.wg =           "XML Security Working Group";
respecConfig.wgURI =        "http://www.w3.org/2008/xmlsec/";
respecConfig.wgPublicList = "public-xmlsec";
respecConfig.wgPatentURI =  "http://www.w3.org/2004/01/pp-impl/42458/status";
respecConfig.refNote = "Dated references below are to the latest known \
or appropriate edition of the referenced work.  The referenced works \
may be subject to revision, and conformant implementations may follow, \
and are encouraged to investigate the appropriateness of following, \
some or all more recent editions or replacements of the works \
cited. It is in each case implementation-defined which  editions are \
supported."; 

function pad(num, len) {
    var str = String(num),
        diff = len - str.length;
    if(diff <= 0) return str;
    pad.zeros = new Array(diff + 1).join('0');
    return pad.zeros.substr(0, diff) + str;
}

function escapeH (s) {
    return s.replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;"); 
}

function escapeL (s) {
    return s.replace(/</g, "&lt;"); 
}

function escapeLNumber (s, c, start) {
    var pattern = /^(\s*<[^\?])/;
    var lines = s.split('\n');
    if (start) { var cnt = start; } else { var cnt = 1; }
    lines.forEach (
        function(x, i, lines) { 
            var found = lines[i].search(pattern);
            var cntStr = pad(cnt, 2);
            if (found != -1) { 
                lines[i] = lines[i].replace(pattern, '[' + c +  cntStr + ']'
    + "$1");
                cnt += 1; } else {
                    lines[i] = "     " + lines[i];
                }
        }
    );
    var str = lines.join('\n');
    return  str.replace(/</g, "&lt;");
}

function showSchema(doc, content) {
    return '<pre class="dtd sh_xml">Schema Definition:</pre><pre class="dtd sh_xml">' + escapeH(content) + '</pre>';
}

function showXML(doc, content) {
    return '<pre class="example sh_xml">' + escapeL(content) + '</pre>';
}

function showNumberedXMLs(doc, content) {
    return '<pre class="example sh_xml">' + escapeLNumber(content, 's') + '</pre>';
}

function showNumberedXMLt(doc, content) {
    return '<pre class="example sh_xml">' + escapeLNumber(content, 't') + '</pre>';
}

function showNumberedXMLt09(doc, content) {
    return '<pre class="example sh_xml">' + escapeLNumber(content, 't', 9) + '</pre>';
}

/*
respecConfig.localBiblio = { "XMLDSIG-BESTPRACTICES" : "Pratik Datta; Frederick Hirsch. <a href=\"http://www.w3.org/TR/2013/NOTE-xmldsig-bestpractices-20130117/\"><cite>XML Signature Best Practices.</cite></a> 17 January 2013. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2013/NOTE-xmldsig-bestpractices-20130117/\">http://www.w3.org/TR/2013/NOTE-xmldsig-bestpractices-20130117/</a> ",
   "XMLDSIG-CORE1" : "D. Eastlake, J. Reagle, D. Solo, F. Hirsch, T. Roessler, K. Yiu. <a href=\"http://www.w3.org/TR/2013/PR-xmldsig-core1-20130117/\"><cite>XML Signature Syntax and Processing Version 1.1.</cite></a> 17 January 2013. W3C Proposed Recommendation. (Work in progress) URL: <a href=\"http://www.w3.org/TR/2013/PR-xmldsig-core1-20130117/\">http://www.w3.org/TR/2013/PR-xmldsig-core1-20130117/</a> ",
   "XMLDSIG-CORE1-CHGS" : "Frederick Hirsch. <a href=\"http://www.w3.org/TR/2012/NOTE-xmldsig-core1-explain-20121018/\"><cite>Functional Explanation of Changes in XML Signature 1.1</cite></a>. 18 October 2012. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2012/NOTE-xmldsig-core1-explain-20121018/\">http://www.w3.org/TR/2012/NOTE-xmldsig-core1-explain-20121018/</a> ",
   "XMLDSIG-CORE1-INTEROP" : "Frederick Hirsch, Pratik Datta <a href=\"http://www.w3.org/TR/2012/NOTE-xmldsig-core1-interop-20121113/\"><cite>XML Signature 1.1 Interop Test Report</cite></a>. 13 November 2012. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2012/NOTE-xmldsig-core1-interop-20121113/\">http://www.w3.org/TR/2012/NOTE-xmldsig-core1-interop-20121113/</a> ", 
   "XMLDSIG-CORE2" : "Mark Bartel; John Boyer; Barb Fox et al. <a href=\"http://www.w3.org/TR/2012/CR-xmldsig-core2-20120124/\"><cite>XML Signature Syntax and Processing Version 2.0</cite></a>. 24 January 2012.  W3C Candidate Recommendation. (Work in progress.) URL: <a href=\"http://www.w3.org/TR/2012/CR-xmldsig-core2-20120124/\">http://www.w3.org/TR/2012/CR-xmldsig-core2-20120124/</a>", 
   "XMLDSIG-PROPERTIES" : "Frederick Hirsch. <a href=\"http://www.w3.org/TR/2013/PR-xmldsig-properties-20130117/\"><cite>XML Signature Properties.</cite></a> 17 January 2013. W3C Proposed Recommendation. (Work in progress.) URL: <a href=\"http://www.w3.org/TR/2013/PR-xmldsig-properties-20130117/\">http://www.w3.org/TR/2013/PR-xmldsig-properties-20130117/</a> ",
   "XMLENC-BACKWARDS-COMP" : "Tibor Jager, Kenneth G. Paterson, Juraj Somorovsky. <a href=\"http://www.nds.ruhr-uni-bochum.de/research/publications/backwards-compatibility/\"><cite>One Bad Apple: Backwards Compatibility Attacks on State-of-the-Art Cryptography.</cite></a> In Proceedings of the Network and Distributed System Security Symposium (NDSS), 2013. URL: <a href=\"http://www.nds.ruhr-uni-bochum.de/research/publications/backwards-compatibility/\">http://www.nds.ruhr-uni-bochum.de/research/publications/backwards-compatibility/</a>",
   "XMLENC-CBC-ATTACK" : "Tibor Jager; Juraj Somorovsky. <a href=\"http://www.nds.ruhr-uni-bochum.de/research/publications/breaking-xml-encryption/\"><cite>How to Break XML Encryption</cite></a> 17-21 October 2011. CCS&#8217;11, ACM. URL: <a href=\"http://www.nds.ruhr-uni-bochum.de/research/publications/breaking-xml-encryption/\">http://www.nds.ruhr-uni-bochum.de/research/publications/breaking-xml-encryption/</a> ",
   "XMLENC-CBC-ATTACK-COUNTERMEASURES" : "Juraj Somorovsky, J&ouml;rg Schwenk. <a href=\"http://www.w3.org/2008/xmlsec/papers/xmlEncCountermeasuresW3C.pdf\"><cite>Technical Analysis of Countermeasures against Attack on XML Encryption - or - Just Another Motivation for Authenticated Encryption</cite.></a>. 2011.  URL: <a href=\"http://www.w3.org/2008/xmlsec/papers/xmlEncCountermeasuresW3C.pdf\">http://www.w3.org/2008/xmlsec/papers/xmlEncCountermeasuresW3C.pdf</a>",
   "XMLENC-CREF2" : "Frederick Hirsch. <a href=\"http://www.w3.org/TR/2012/CR-xmlenc-transform20-20120313/\">Encryption 1.1 CipherReference Processing Using 2.0 Transforms</cite></a> 13 March 2012. W3C Candidate Recommendation. (Work in progress.) URL: <a href=\" http://www.w3.org/TR/2012/CR-xmlenc-transform20-20120313/\">http://www.w3.org/TR/2012/CR-xmlenc-transform20-20120313/</a>",
   "XMLENC-CORE1" : "J. Reagle; D. Eastlake; F. Hirsch; T. Roessler. <a href=\"http://www.w3.org/TR/2013/PR-xmlenc-core1-20130117/\"><cite>XML Encryption Syntax and Processing Version 1.1.</cite></a> 17 January 2013. W3C Proposed Recommendation. (Work in progress) URL: <a href=\"http://www.w3.org/TR/2013/PR-xmlenc-core1-20130117/\">http://www.w3.org/TR/2013/PR-xmlenc-core1-20130117/</a> ",
   "XMLENC-CORE1-CHGS" : "Frederick Hirsch. <a href=\"http://www.w3.org/TR/2012/NOTE-xmlenc-core1-explain-20121018/\"><cite>Functional Explanation of in XML Encryption 1.1</cite></a>. 18 October 2012. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2012/NOTE-xmlenc-core1-explain-20121018/\">http://www.w3.org/TR/2012/NOTE-xmlenc-core1-explain-20121018/</a> ",
    "XMLENC-CORE1-INTEROP" : "Pratik Datta, Frederick Hirsch <a href=\"http://www.w3.org/TR/2012/NOTE-xmlenc-core1-interop-20121113/\"><cite>XML Encryption 1.1 Interop Test Report</cite></a>. 13 November 2012. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2012/NOTE-xmlenc-core1-interop-20121113/\">http://www.w3.org/TR/2012/NOTE-xmlenc-core1-interop-20121113/</a> ", 
   "XMLENC-PKCS15-ATTACK" : "Tibor Jager; Sebastian Schinzel, Juraj Somorovsky. <a href=\"http://www.nds.rub.de/research/publications/breaking-xml-encryption-pkcs15.pdf\"><cite>Bleichenbacher's Attack Strikes Again: Breaking PKCS#1.5 in XML Encryption</cite></a>. 2012. In Proceedings of the 17th European Symposium on Research in Computer Security (ESO RICS). URL: <a href=\"http://www.nds.rub.de/research/publications/breaking-xml-encryption-pkcs15.pdf\">http://www.nds.rub.de/research/publications/breaking-xml-encryption-pkcs15.pdf</a> ",
   "XMLENC11-TESTCASES" : "Pratik Datta, Frederick Hirsch. <a href=\"http://www.w3.org/TR/2012/WD-xmlenc-core1-testcases-20120105/\"><cite>Test Cases for XML Encryption 1.1.</cite></a> 5 January 2012. W3C First Public Working Draft (Work in progress.) URL: <a href=\"http://www.w3.org/TR/2012/WD-xmlenc-core1-testcases-20120105/\">http://www.w3.org/TR/2012/WD-xmlenc-core1-testcases-20120105/</a>",
   "XHR" : "Anne van Kesteren. <a href='http://www.w3.org/TR/XMLHttpRequest/'>XMLHttpRequest</a>",
   "XMLSEC-ALGORITHMS" : "Thomas Roessler; Frederick Hirsch; Kelvin Yiu. <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-algorithms-20130117/\"><cite>XML Security Algorithm Cross-Reference.</Cite></a> 13 January 2013. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-algorithms-20130117/\">http://www.w3.org/TR/2013/NOTE-xmlsec-algorithms-20130117/</a> ",
   "XMLSEC-DERIVEDKEYS" : "Magnus Nystr&#246;m. <a href=\"http://www.w3.org/TR/2009/WD-xmlsec-derivedkeys-20090226/\"><cite>XML Security Derived Keys.</cite></a> 26 February 2009. W3C Working Draft. (Work in progress.) URL: <a href=\"http://www.w3.org/TR/2009/WD-xmlsec-derivedkeys-20090226\">http://www.w3.org/TR/2009/WD-xmlsec-derivedkeys-20090226</a> ",
   "XMLSEC-GHCIPHERS" : "Magnus Nystr&#246;m; Frederick Hirsch. <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-generic-hybrid-20130117/\"><cite>XML Security Generic Hybrid Ciphers.</cite></a> 17 January 2013. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-generic-hybrid-20130117/\">http://www.w3.org/TR/2013/NOTE-xmlsec-generic-hybrid-20130117/</a> ",
   "XMLSEC-RELAXNG" : "Makoto Murata, Frederick Hirsch. <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-rngschema-20130117/\"><cite>XML Security RELAX NG Schemas.</cite></a> 17 January 2013. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-rngschema-20130117/\">http://www.w3.org/TR/2013/NOTE-xmlsec-rngschema-20130117/</a>",
   "XMLSEC11-REQS" : "Frederick Hirsch, Thomas Roessler. <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-reqs-20130117/\"><cite>XML Security 1.1 Requirements and Design Considerations.</Cite></a> 17 January 2013. W3C Working Group Note. URL: <a href=\"http://www.w3.org/TR/2013/NOTE-xmlsec-reqs-20130117/\">http://www.w3.org/TR/2013/NOTE-xmlsec-reqs-20130117/</a> ",
   "XMLSEC2-REQS" : "Frederick Hirsch, Pratik Datta. <a href=\"http://www.w3.org/TR/2011/WD-xmlsec-reqs2-20110421/\"><cite>XML Security 2.0 Requirements and Design Considerations.</cite></a> 21 April 2011. W3C Working Draft. (Work in progress.) URL: <a href=\"http://www.w3.org/TR/2011/WD-xmlsec-reqs2-20110421/\">http://www.w3.org/TR/2011/WD-xmlsec-reqs2-20110421/</a> ",
};
*/
