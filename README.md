# The Parrot

An editorial portfolio for The Parrot Art & Design Foundation, built with imagery and content from its supplied 2026 portfolio.

## Website

`site/` contains the complete static website: homepage, ten project pages, locally hosted fonts and image assets. No build step, package install, backend, analytics or environment variables are required.

Open `site/index.html` directly, or serve the site locally:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory site
```

## Vercel

Import this repository with framework preset **Other**, root directory **./**, and output directory **site**. Leave build/install commands unset. The root `vercel.json` specifies the static output directory. Connect the repository through Vercel's GitHub integration for automatic deployments.

## Features

- Filterable archive: exhibitions, spaces, public programmes and collection.
- Project galleries with accessible image enlargement and keyboard navigation.
- Headline entrances, scroll-triggered reveals and restrained image hover motion.
- Motion on/off setting and device reduced-motion support.
- Responsive layouts and English copy with Chinese exhibition titles.

## Content and rights

The reference PDF and development environment are not included in this repository. Artwork and photographs remain the property of their respective rights holders; this repository does not grant reuse rights. Font licences are included in `site/assets/`.

This version is a curated archive, not a current exhibition or visiting schedule. Shanghai is the place of origin, Hong Kong the foundation location and New York a liaison office, as described by the source portfolio. Contact details and individual photographer credits still require owner confirmation. The collection-page cover is from *Parrot's Monologue* (2024); it is separate from the three individually captioned works below. Programme frequency and English title variants should be confirmed with the foundation.
