---
slug: /velocity/developers/creating-your-first-plugin
---

# Creating Your First Plugin

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

It is very simple to create a plugin for Velocity. This section will teach you how to setup your
IDE, your plugin identifiers, and give you an introduction to the basics of the Velocity API.

## Before you continue...

You will need proficiency in the Java programming language. If you don't know Java yet, we strongly
recommend you learn some basic Java before you continue.

## Set up your environment

You're going to need the [JDK](../../../common/java-install.md) and an IDE. If you don't have an
IDE, IntelliJ IDEA is recommended.

## Creating the project in your IDE

- Open your IDE
- Click `Create New Project` or the equivalent
- Select either `Gradle` or `Maven`
- Make sure your **Project JDK** is Java 8 or later
- **Finish** the dialog and open the project.

Now we have created our project, we need configure our build system.

## I know how to do this. Give me what I need!

### Maven repository

| Name      | URL                                                |
| --------- | -------------------------------------------------- |
| `papermc` | `https://papermc.io/repo/repository/maven-public/` |

### Dependency

| Group ID              | Artifact ID    | Version |
| --------------------- | -------------- | ------- |
| `com.velocitypowered` | `velocity-api` | `3.1.1` |

### Javadocs

Javadocs are available at [jd.velocitypowered.com/3.0.0](https://jd.velocitypowered.com/3.0.0).

## Set up your build system

You will need to setup a build system before you continue. While it is possible to write Velocity
plugins without one, having a build system will make your life a lot less difficult.

How to set up a build system is outside the scope of this page, but you can look at your build
system's documentation ([Gradle](https://docs.gradle.org/current/userguide/userguide.html) or
[Maven](https://maven.apache.org/guides/getting-started/index.html)) for assistance.

### Setting up the dependency

<Tabs groupId="author-front-matter">
  <TabItem value="maven" label="Maven POM">

```xml name="pom.xml"
<project>
    <repositories>
        <repository>
            <id>papermc</id>
            <url>https://papermc.io/repo/repository/maven-public/</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>com.velocitypowered</groupId>
            <artifactId>velocity-api</artifactId>
            <version>3.1.1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

  </TabItem>
  <TabItem value="gradle-kotlin" label="Gradle Kotlin DSL" default>

```kotlin name="build.gradle.kts"
repositories {
    maven {
        name = "papermc"
        url = uri("https://papermc.io/repo/repository/maven-public/")
    }
}

dependencies {
    compile("com.velocitypowered:velocity-api:3.1.1")
    annotationProcessor("com.velocitypowered:velocity-api:3.1.1")
}
```

  </TabItem>
  <TabItem value="gradle-groovy" label="Gradle Groovy DSL">

```groovy name="build.gradle"
repositories {
    maven {
        name 'papermc'
        url 'https://papermc.io/repo/repository/maven-public/'
    }
}

dependencies {
    compile 'com.velocitypowered:velocity-api:3.1.1'
    annotationProcessor 'com.velocitypowered:velocity-api:3.1.1'
}
```

  </TabItem>
</Tabs>
