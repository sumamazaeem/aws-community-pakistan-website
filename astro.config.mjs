import { defineConfig } from 'astro/config';

// The existing CodePipeline syncs this repository to S3 verbatim, with no build
// step. So the built output has to be self-contained and committed: CSS is
// inlined into every page and `format: 'directory'` emits
// user-groups/<slug>/index.html, which the S3 website origin serves directly.
//
// Nothing here changes how the site deploys. See docs/restructure-plan.md.
export default defineConfig({
  site: 'https://awscommunity.pk',
  outDir: './dist',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
