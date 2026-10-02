import { defineConfig } from 'astro/config';

// The existing CodePipeline syncs this repository to S3 verbatim, with no build
// step. So the built output is committed: `format: 'directory'` emits
// user-groups/<slug>/index.html, and the one shared stylesheet is emitted inside
// user-groups/_assets/ so the whole generated tree lives under a single
// directory the S3 website origin serves directly.
//
// Nothing here changes how the site deploys. See docs/restructure-plan.md.
export default defineConfig({
  site: 'https://awscommunity.pk',
  outDir: './dist',
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
    assets: 'user-groups/_assets',
  },
  devToolbar: { enabled: false },
});
