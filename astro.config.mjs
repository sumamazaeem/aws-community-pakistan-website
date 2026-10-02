import { defineConfig } from 'astro/config';

// The existing CodePipeline syncs this repository to S3 verbatim, with no build
// step. So the built output is committed: `format: 'directory'` emits
// <section>/<slug>/index.html, and the one shared stylesheet is emitted to
// _assets/ at the root, shared by every generated section.
//
// Committed generated paths are therefore:
//   user-groups/  community-days/  student-builder-groups/  _assets/
//
// Nothing here changes how the site deploys. See docs/deployment.md.
export default defineConfig({
  site: 'https://awscommunity.pk',
  outDir: './dist',
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
    assets: '_assets',
  },
  devToolbar: { enabled: false },
});
