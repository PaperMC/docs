# Contributing to PaperMC Docs

Thank you for considering contributing to the PaperMC Docs repository! We appreciate your help in making our documentation better. 
To ensure a smooth and collaborative contribution process, please follow the guidelines below.

## Table of Contents
1. [Introduction](#introduction)
2. [How to add a page](#adding-a-page)
3. [Submitting Contributions](#submitting-contributions)
4. [Style Guidelines](#style-guidelines)
5. [Code of Conduct](#code-of-conduct)

## Introduction

The PaperMC Docs repository contains the documentation for the PaperMC project, which is used to provide essential 
information, instructions, and guidelines to our users, developers, and contributors. Your contributions play a 
significant role in improving and maintaining the quality of our documentation.

We use [Docusaurus](https://docusaurus.io/) to build and deploy the documentation website.
Docusarus has [extensive documentation](https://docusaurus.io/docs/category/guides) detailing what is possible with it.

The bulk of Paper's documentation is written with Markdown, which is a simple markup language that is easy to learn. 
Take a look at some of the existing documentation to get a feel for how it is written.

### Adding a page

To add a new page to the documentation, create a new Markdown file in the appropriate folder. For example, if you want to add
a new page to the Paper Admin docs, create a new Markdown file in the `docs/paper/admin/` folder. The file name should be in 
lowercase and use hyphens to separate words. For example, `my-new-page.md`.

The page should start with a slug and title. For example:

```markdown
---
slug: /reference/paper-plugins
---

# Paper Plugins

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce.
```

This will place the page at the `/paper/reference/paper-plugins` URL on the website. The slug should be unique and follow the   
folder structure of the documentation. The title is the name of the page that will be displayed on the website and in the sidebar.

You must also add the page to the sidebar. In this instance we will go to the `config/sidebar.paper.ts` file and
add the file to the `items` tag for that section. You must use the file structure for that file. One example would be
`admin/reference/paper-plugins` where you omit the file extension and use slashes to denote folders. Take a look at the 
existing sidebar elements to get a feel for how it is structured.

## Submitting Contributions

If you wish to contribute to the PaperMC Docs, please follow these steps:

1. Fork the repository to your GitHub account.

2. Create a new branch from the `main` branch.

3. Make your changes or add new documentation following the style guidelines mentioned below.

4. Commit your changes and push them to your fork.

5. Submit a pull request (PR) to the `main` branch of the Docs repository.
   Vercel will automatically deploy a preview of your changes to the PR. The link to the preview will be available in a PR comment.

6. Your PR will be reviewed, and feedback may be provided if necessary.

7. Once your contribution meets the guidelines and requirements, it will be merged into the main repository.

## Style Guidelines

To maintain consistency and readability across the documentation, please adhere to the following style guidelines:

1. **American English**: All documentation should be written in American English. Please use American spellings, grammar, and punctuation.
   Take a look at [this guide](https://www.oxfordinternationalenglish.com/differences-in-british-and-american-spelling/) which outlines 
   the differences between American and British English.

2. **Markdown Format**: Documentation should be written in Markdown format (.md or .mdx) for easy rendering on the website.

3. **Heading Structure**: Use `h1` (#) for the main title, `h2` (##) for section headings, and follow this pattern for subsequent subheadings.

4. **Code Blocks**: When including code snippets or terminal commands, use fenced code blocks with the appropriate syntax highlighting.

5. **Admonitions**: Use admonitions to highlight important information. For example, use `:::note` for general notes, `:::tip`for tips,
   `:::caution` for warnings, and `:::danger` for critical warnings.

6. **Links and References**: When referencing external sources or linking to other pages, use descriptive anchor text and provide full URLs.

7. **Images**: Include images if necessary to illustrate concepts. Ensure the images are clear and relevant to the content.

8. **Keep It Concise**: Write clear and concise sentences. Avoid unnecessary jargon and explanations.

9. **Be Inclusive**: Be mindful of all readers and contributors. Use language that is inclusive and welcoming to everyone.

## Code of Conduct

Contributors are expected to follow the [Community Guidelines](https://papermc.io/community/guidelines) of the PaperMC organization in all 
interactions related to this repository.

Thank you for contributing to the PaperMC Docs! Your dedication helps improve the documentation for the entire 
community. If you have any questions or need further assistance, feel free to reach out to us on the PaperMC Discord server
or create an issue on the repository.
