 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 167e45ada01900de2424afb5b45d10a726a564ee..717d32804743aea8ab249f9ddeb1b1848879e422 100644
--- a/README.md
+++ b/README.md
@@ -1,10 +1,47 @@
 # About
 
-This is repository hosts the UI and content of an RSS feed reader.
+This repository hosts the UI and content of an RSS feed reader. The
+generated site is published via GitHub Pages at
+https://basedtrees.github.io/RSS-Feed-Reader/, where you can browse the
+latest aggregated articles. After the scheduled build workflow finishes,
+the raw cache that external tools can consume is published alongside the
+site at https://basedtrees.github.io/RSS-Feed-Reader/cache.json.
 
 ## Links and references
 
 - [How does it work?](https://github.com/osmoscraft/osmosfeed#osmosfeed)
 - [File an issue about the template](https://github.com/osmoscraft/osmosfeed-template)
 - [File an issue about the tool](https://github.com/osmoscraft/osmosfeed)
 - [Lastest documentation](https://github.com/osmoscraft/osmosfeed)
+
+## Repository quick links
+
+Use these shortcuts to jump directly to the key files in this repository when viewing it on GitHub:
+
+- [Main README](./README.md)
+- [Feed configuration](./osmosfeed.yaml)
+- [Build script](./package.json)
+
+## Build & deployment notes
+
+- The GitHub Actions workflow in `.github/workflows/update-feed.yaml`
+  installs dependencies, runs `npm run build`, and deploys the contents
+  of the `public/` directory to the `gh-pages` branch. Make sure that
+  branch is selected as the GitHub Pages source so the live site reflects
+  the generated cache.
+- `osmosfeed.yaml` intentionally leaves `cacheUrl` unset so the CLI falls
+  back to an empty cache instead of trying to download the previously
+  published JSON. That prevents `npm run build` from aborting with HTTP
+  403 errors on networks that block access to
+  `https://basedtrees.github.io/RSS-Feed-Reader/cache.json`.
+- The build still needs outbound access to the RSS sources listed in the
+  config. If those requests are blocked locally, rely on the GitHub
+  Actions workflow (which runs on GitHub’s infrastructure) to refresh the
+  live cache and site content.
+
+If you have already published the project to GitHub, you can also add deep links to common repository pages by replacing `YOUR-USERNAME` with your GitHub handle:
+
+- [Repository home](https://github.com/YOUR-USERNAME/RSS-Feed-Reader)
+- [Open issues](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/issues)
+- [Project discussions](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/discussions)
+- [Latest releases](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/releases)
 
EOF
)
