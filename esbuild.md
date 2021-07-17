```bash
# respec-worker
npx esbuild worker/respec-worker.js --outdir=builds --bundle --format=esm

# respec-highlight
npx esbuild worker/respec-highlight.js --outdir=builds --bundle --minify --format=iife --global-name=hljs
```
