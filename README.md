# docs [![Discord](https://img.shields.io/discord/289587909051416579.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/papermc) ![Deployment Status](https://img.shields.io/github/deployments/PaperMC/docs/production?label=deployment&logo=github) ![License](https://img.shields.io/github/license/PaperMC/docs)

This is the repository for all project documentation under the PaperMC umbrella. Content in this
repository is published to [docs.papermc.io](https://docs.papermc.io) for viewing.

## Getting Started

How to get docs running on your local machine for development.

### Prerequisites

- [node 22](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [d2](https://d2lang.com/) (optional for development - used for generating diagrams)

### Local Development

1. Clone the repository. If you plan to make changes, create a fork first!

```bash
$ git clone https://github.com/PaperMC/docs
```

2. Install all required dependencies.

```bash
$ pnpm install
```

3. Start the development server.

```bash
$ pnpm run dev
```

This will start a local development server and open a browser window. The majority of changes will
be instantly reflected live without the need to restart the development server or reload the page in
your browser. Edit away!

### Building

```bash
$ pnpm run build
```

This command builds a production-ready deployment into the `build` directory. These files are ready
to be hosted on any static content server.

## License

The PaperMC Documentation (e.g., `.md` files in the `/src/content/docs` folder) is
[CC-BY-SA-4.0](https://github.com/PaperMC/docs/blob/main/LICENSE-docs) licensed.

The supporting code is
[BSD-2-Clause](https://github.com/PaperMC/docs/blob/main/LICENSE) licensed.

The PaperMC logomark is subject to its [own terms](https://docs.papermc.io/misc/assets) and does not
inherit a license from any of the projects it represents.
