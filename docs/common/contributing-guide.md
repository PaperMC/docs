---
title: Contributing to Docs
description: How you can help write documentation.
toc_max_heading_level: 5
---
# Contributing to Docs
Thank you for your intrest in helping out!

## Getting started
This project uses Docusarus to provide documentation. You may either edit the documentation directly using the GitHub editor in your browser or edit them locally. If you edit the files locally, you can preview your changes live before pushing them to the remote repository. In order to preview your changes before pushing them to the repository, you will need to set up a local development environment.

### Environment Setup
1. Install [node.js](https://nodejs.org/en/download/) and
   [yarn package manager](https://yarnpkg.com/getting-started/install).
2. Clone this repository:
   ```
   git clone https://github.com/PaperMC/docs
   cd docs
   ```
3. Install dependicies using yarn
   ```
   yarn install
   ```
4. Run the following to start the local site
   ```
   yarn run start
   ```
   You will be able to access the local site by browsing to `http://localhost:3000/`. Any edits you make will update the page live.

## Editing and Making pages
Documentation is written using the standard
[Markdown syntax](https://www.markdownguide.org/basic-syntax/). There are also advanced features
added by Docusarus, you can find more [here](https://docusaurus.io/docs/markdown-features).

Documentation pages are currently located in the "docs" directory. Each project has it's own directory. The final formatting and orginization of the files and directories is stil in flux, you can find more information in the `#docs` channel on Paper's [Discord server](https://discord.com/invite/papermc).
To add your page to the sidebar, edit `sidebars.js`.

## Discussion
If you need any help making changes, or want to make a larger change, you can discuss it through the `#docs` channel on Paper's [Discord server](https://discord.com/invite/papermc).