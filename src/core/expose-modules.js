const inAmd = !!window.require;
if (!inAmd) {
  window.require = function(deps, callback) {
    const modules = deps.map(dep => {
      if (!(dep in window.require.modules)) {
        throw new Error(`Unsupported dependency name: ${dep}`);
      }
      return window.require.modules[dep];
    });
    callback(...modules);
  };
  window.require.modules = {};
}

export function expose(name, object) {
  if (!inAmd) {
    window.require.modules[name] = object;
  }
}
