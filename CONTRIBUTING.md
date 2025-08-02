# Contributing to PaperMC Docs

Thank you for considering contributing to the PaperMC Docs repository! We appreciate your help in making our documentation better.
To ensure a smooth and collaborative contribution process, please follow the guidelines below.

## Table of contents

1. [Introduction](#introduction)
2. [How to add a page](#adding-a-page)
3. [Submitting contributions](#submitting-contributions)
4. [Style guidelines](#style-guidelines)
5. [Version tags](#version-tags)
6. [Automatic constant replacement](#automatic-constant-replacement)
7. [Linking to Javadocs](#linking-to-javadocs)
8. [Referencing a build system dependency](#referencing-a-build-system-dependency)
9. [Code of Conduct](#code-of-conduct)

## Introduction

The PaperMC Docs repository contains the documentation for the PaperMC project, which is used to provide essential
information, instructions, and guidelines to our users, developers, and contributors. Your contributions play a
significant role in improving and maintaining the quality of our documentation.

We use [Starlight](https://starlight.astro.build/) to build and deploy the documentation website.
Starlight has [extensive documentation](https://starlight.astro.build/guides/authoring-content/) detailing what is possible with it.

The bulk of Paper's documentation is written with Markdown, which is a simple markup language that is easy to learn.
Take a look at some of the existing documentation to get a feel for how it is written.

### Adding a page

To add a new page to the documentation, create a new Markdown file in the appropriate folder. For example, if you want to add
a new page to the Paper Admin docs, create a new Markdown file in the `src/content/docs/paper/admin/` folder. The file name should be in
lowercase and use hyphens to separate words. For example, `my-new-page.md`.

The page should start with a slug and title. For example:

```markdown
---
title: Paper plugins
slug: paper/reference/paper-plugins
---

This documentation page serves to explain all the new semantics and possible confusions that Paper plugins may introduce.
```

This will place the page at the `/paper/reference/paper-plugins` URL on the website. The slug should be unique and follow the
folder structure of the documentation. The title is the name of the page that will be displayed on the website and in the sidebar.

You must also add the page to the sidebar. In this instance we will go to the `astro.config.ts` file and
add the file to the `items` tag for that section. You must use the slug for that file, for example `paper/reference/paper-plugins`.
Take a look at the existing sidebar elements to get a feel for how it is structured.

## Submitting contributions

If you wish to contribute to the PaperMC Docs, please follow these steps:

1. Fork the repository to your GitHub account.

2. Create a new branch from the `main` branch.

3. Make your changes or add new documentation following the style guidelines mentioned below.

4. Commit your changes and push them to your fork.

5. Submit a pull request (PR) to the `main` branch of the Docs repository.
   Cloudflare Pages will automatically deploy a preview of your changes to the PR. The link to the preview will be available in a PR comment.

6. Your PR will be reviewed, and feedback may be provided if necessary.

7. Once your contribution meets the guidelines and requirements, it will be merged into the main repository.

## Style guidelines

To maintain consistency and readability across the documentation, please adhere to the following style guidelines:

1. **American English**: All documentation should be written in American English. Please use American spellings, grammar, and punctuation.
   Take a look at [this guide](https://www.oxfordinternationalenglish.com/differences-in-british-and-american-spelling/) which outlines
   the differences between American and British English.

2. **Embrace sentence case**: Use sentence case instead of Title Case, if it makes sense. Sentence case along with active voice creates a more natural, conversational tone.

3. **Markdown format**: Documentation should be written in Markdown format (.md or .mdx) for easy rendering on the website.
   If you don't use any MDX features, use a plain Markdown file (.md) instead to improve portability of your markup.

4. **Heading structure**: Use the `title` front matter property for the main title, `h2` (##) for section headings, and follow this pattern for subsequent subheadings.

5. **Code blocks**: When including code snippets or terminal commands, use fenced code blocks with the appropriate syntax highlighting.

6. **Admonitions**: Use admonitions to highlight important information. For example, use `:::note` for general notes, `:::tip` for tips,
   `:::caution` for warnings, and `:::danger` for critical warnings.

7. **Links and references**: When referencing external sources or linking to other pages, use descriptive anchor text and provide full URLs.

8. **Images**: Include images if necessary to illustrate concepts, ensure the images are clear and relevant to the content, and store them in the repository rather than external CDNs (i.e. imgur).

9. **Format code**: After you've made changes, don't forget to run the formatting script with `pnpm run format`.

10. **Keep it concise**: Write clear and concise sentences. Avoid unnecessary jargon and explanations.

11. **Be inclusive**: Be mindful of all readers and contributors. Use language that is inclusive and welcoming to everyone.

12. **Capitalize Vanilla**: When referring to the base game, use "Vanilla" with a capital "V".

## Version tags

All of our documentation which is potentially relevant to a specific version of the software should be tagged with the
`version` front matter value. This allows the user to see which version of the software the documentation was written for.

It is important to keep this up to date, as it allows users to see if the documentation is still relevant to the version,
however it is not required for all documentation. For example, a page about the history of the project would not need a
`version` value.

```markdown
---
title: My awesome page
description: My awesome page about my awesome topic for 1.20.
slug: paper/my-awesome-page
version: "1.20"
---

.....
```

## Automatic constant replacement

There are quite a few constants you may want to use in your pages, such as the latest Paper/Velocity/Minecraft version.

These constants can be imported and used in MDX, like so:

```mdxjs
import {
  LATEST_MC_RELEASE,
  LATEST_PAPER_RELEASE,
  LATEST_VELOCITY_RELEASE,
  LATEST_FOLIA_RELEASE,
  LATEST_WATERFALL_RELEASE,
  LATEST_USERDEV_RELEASE,
} from "/src/utils/versions";

Latest Paper version is {LATEST_PAPER_RELEASE}.
Latest Velocity version is {LATEST_VELOCITY_RELEASE}.
Latest Minecraft version is {LATEST_MC_RELEASE}.
Latest Folia version is {LATEST_FOLIA_RELEASE}.
Latest Waterfall version is {LATEST_WATERFALL_RELEASE}.
Latest `paperweight-userdev` version is {LATEST_USERDEV_RELEASE}.
```

If you want to perform these replacements in code blocks, you need to use a special `replace` meta property.
It works in plain .md files too, and you don't need to import anything:

````markdown
```yaml replace
name: Paper-Test-Plugin
version: "1.0"
main: io.papermc.testplugin.TestPlugin
description: Paper Test Plugin
api-version: '\{LATEST_PAPER_RELEASE}'
bootstrapper: io.papermc.testplugin.TestPluginBootstrap
loader: io.papermc.testplugin.TestPluginLoader
```
````

For inline code blocks, i.e. `my code block` (`` `my code block` `` in Markdown), you do not need to use a property - replacements are done for all inline code blocks.

```markdown
- `api-version: '\{LATEST_PAPER_RELEASE}'`
```

## Linking to Javadocs

Many Javadoc sites support a `latest` tag, such as javadoc.io or similar, in which case, just use that in a plain Markdown link.
However, you may also want to reference the Javadocs of the latest version of Paper, Velocity or a centrally defined version of Java, which do not support a `latest` tag.

For that, you can use the `jd:project_name[:module_name][:class_or_member_reference]` Markdown link shortcut:

```md
[my `Event` link](jd:paper:org.bukkit.event.Event)
[`ProxyInitializeEvent`](jd:velocity:com.velocitypowered.api.event.proxy.ProxyInitializeEvent)
[`repeat(long, TimeUnit)`](jd:velocity:com.velocitypowered.api.scheduler.Scheduler$TaskBuilder#repeat(long,java.util.concurrent.TimeUnit))
[java.base's List](jd:java:java.util.List)
[java.sql's Connection](jd:java:java.sql:java.sql.Connection)
```

## Referencing a build system dependency

If you wish to reference a build system (i.e. Gradle or Maven) dependency, you can use the `Dependency` component.

```mdxjs
import { LATEST_ADVENTURE_API_RELEASE } from "/src/utils/versions";

{/* uses the "default" template */}
<Dependency group="net.kyori" name="adventure-api" version={LATEST_ADVENTURE_API_RELEASE} />
```

The `default` template is fit for use with a simple `implementation`/`compile`-scope dependency from Maven Central,
however you can also make your own template.

If you need to declare the dependency in a unique way and/or need to add other configuration in the build script, simply use
the `Tabs` component with the corresponding code blocks - **do not make a template unless you plan to use it more than once**.

```mdxjs
import { Tabs, TabItem } from "@astrojs/starlight/components";

<Tabs syncKey="build-system">
  <TabItem label="Gradle (Kotlin)">
    ```kotlin title="build.gradle.kts"
    // my awesome build script in Kotlin
    ```
  </TabItem>
  <TabItem label="Gradle (Groovy)">
    ```groovy title="build.gradle"
    // my awesome build script in Groovy
    ```
  </TabItem>
  <TabItem label="Maven">
    ```xml title="pom.xml"
    <!-- my awesome build script in XML -->
    ```
  </TabItem>
</Tabs>
```

## Code of Conduct

Contributors are expected to follow the [Community Guidelines](https://papermc.io/community/guidelines) of the PaperMC organization in all
interactions related to this repository.

Thank you for contributing to the PaperMC Docs! Your dedication helps improve the documentation for the entire
community. If you have any questions or need further assistance, feel free to reach out to us on the PaperMC Discord server
or create an issue on the repository.
