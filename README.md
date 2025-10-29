# About

This repository hosts the UI and content of an RSS feed reader. The
generated site is published via GitHub Pages at
https://basedtrees.github.io/RSS-Feed-Reader/, where you can browse the
latest aggregated articles. After the scheduled build workflow finishes,
the raw cache that external tools can consume is published alongside the
site at https://basedtrees.github.io/RSS-Feed-Reader/cache.json.

> **Tip:** If the GitHub Pages site renders this README instead of the
> dynamic feed UI, open the repository settings and set **GitHub Pages →
> Branch** to `gh-pages`. The deployment workflow publishes the rendered
> site there on every push to `main` and on the nightly schedule.

## Links and references

- [How does it work?](https://github.com/osmoscraft/osmosfeed#osmosfeed)
- [File an issue about the template](https://github.com/osmoscraft/osmosfeed-template)
- [File an issue about the tool](https://github.com/osmoscraft/osmosfeed)
- [Lastest documentation](https://github.com/osmoscraft/osmosfeed)

## Repository quick links

Use these shortcuts to jump directly to the key files in this repository when viewing it on GitHub:

- [Main README](./README.md)
- [Feed configuration](./osmosfeed.yaml)
- [Build script](./package.json)

## Build & deployment notes

- The GitHub Actions workflow in `.github/workflows/update-feed.yaml`
  installs dependencies, runs `npm run build`, and deploys the contents
  of the `public/` directory to the `gh-pages` branch. Make sure that
  branch is selected as the GitHub Pages source so the live site reflects
  the generated cache.
- During CI builds the CLI restores the previously published cache from
  `https://basedtrees.github.io/RSS-Feed-Reader/cache.json` so the site
  keeps serving articles even if a feed is temporarily offline.
- When running the build locally on a network that blocks access to
  GitHub Pages, invoke `npm run build:skip-cache` to disable the remote
  cache restore step. This variant temporarily strips the `cacheUrl`
  entry from `osmosfeed.yaml` before executing the CLI.
- The build still needs outbound access to the RSS sources listed in the
  config. If those requests are blocked locally, rely on the GitHub
  Actions workflow (which runs on GitHub’s infrastructure) to refresh the
  live cache and site content.

If you have already published the project to GitHub, you can also add deep links to common repository pages by replacing `YOUR-USERNAME` with your GitHub handle:

- [Repository home](https://github.com/YOUR-USERNAME/RSS-Feed-Reader)
- [Open issues](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/issues)
- [Project discussions](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/discussions)
- [Latest releases](https://github.com/YOUR-USERNAME/RSS-Feed-Reader/releases)
