export default (conf, name, items = []) => {
  // stuff to handle RDFa
  var re = "",
    rp = "",
    rm = "",
    rn = "",
    rwu = "",
    rpu = "",
    bn = "",
    editorid = "",
    propSeeAlso = "";
  if (conf.doRDFa) {
    if (name === "Editor") {
      bn = "_:editor0";
      re = " property='bibo:editor' resource='" + bn + "'";
      rp = " property='rdf:first' typeof='foaf:Person'";
    } else if (name === "Author") {
      rp = " property='dc:contributor' typeof='foaf:Person'";
    }
    rn = " property='foaf:name'";
    rm = " property='foaf:mbox'";
    rwu = " property='foaf:workplaceHomepage'";
    rpu = " property='foaf:homepage'";
    propSeeAlso = " property='rdfs:seeAlso'";
  }
  var ret = "";
  for (var i = 0, n = items.length; i < n; i++) {
    var p = items[i];
    if (p.w3cid) {
      editorid = " data-editor-id='" + parseInt(p.w3cid, 10) + "'";
    }
    if (conf.doRDFa) {
      ret +=
        "<dd class='p-author h-card vcard' " +
        re +
        editorid +
        "><span" +
        rp +
        ">";
      if (name === "Editor") {
        // Update to next sequence in rdf:List
        bn = i < n - 1 ? "_:editor" + (i + 1) : "rdf:nil";
        re = " resource='" + bn + "'";
      }
    } else {
      ret += "<dd class='p-author h-card vcard'" + editorid + ">";
    }
    if (p.url) {
      if (conf.doRDFa) {
        ret +=
          "<meta" +
          rn +
          " content='" +
          p.name +
          "'><a class='u-url url p-name fn' " +
          rpu +
          " href='" +
          p.url +
          "'>" +
          p.name +
          "</a>";
      } else
        ret +=
          "<a class='u-url url p-name fn' href='" +
          p.url +
          "'>" +
          p.name +
          "</a>";
    } else {
      ret += "<span" + rn + " class='p-name fn'>" + p.name + "</span>";
    }
    if (p.company) {
      ret += ", ";
      if (p.companyURL)
        ret +=
          "<a" +
          rwu +
          " class='p-org org h-org h-card' href='" +
          p.companyURL +
          "'>" +
          p.company +
          "</a>";
      else ret += p.company;
    }
    if (p.mailto) {
      ret +=
        ", <span class='ed_mailto'><a class='u-email email' " +
        rm +
        " href='mailto:" +
        p.mailto +
        "'>" +
        p.mailto +
        "</a></span>";
    }
    if (p.note) ret += " (" + p.note + ")";
    if (p.extras) {
      var resultHTML = p.extras
        // Remove empty names
        .filter(function(extra) {
          return extra.name && extra.name.trim();
        })
        // Convert to HTML
        .map(function(extra) {
          var span = document.createElement("span");
          var textContainer = span;
          if (extra.class) {
            span.className = extra.class;
          }
          if (extra.href) {
            var a = document.createElement("a");
            span.appendChild(a);
            a.href = extra.href;
            textContainer = a;
            if (conf.doRDFa) {
              a.setAttribute("property", "rdfs:seeAlso");
            }
          }
          textContainer.innerHTML = extra.name;
          return span.outerHTML;
        })
        .join(", ");
      ret += ", " + resultHTML;
    }
    if (conf.doRDFa) {
      ret += "</span>\n";
      if (name === "Editor")
        ret += "<span property='rdf:rest' resource='" + bn + "'></span>\n";
    }
    ret += "</dd>\n";
  }
  return ret;
}
