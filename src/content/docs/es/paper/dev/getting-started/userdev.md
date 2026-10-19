---
title: paperweight-userdev
description: Guía sobre cómo usar el plugin de Gradle paperweight-userdev para acceder al código interno.
slug: es/paper/dev/userdev
---

**paperweight** es el nombre de las herramientas de compilación personalizadas de Paper. La parte correspondiente al plugin de Gradle
**paperweight-userdev** proporciona acceso al código interno (también conocido como NMS) durante el desarrollo.

:::note

Esta guía utiliza Gradle Kotlin DSL y presupone que tienes conocimientos básicos de Gradle.
Si quieres ver un plugin completamente funcional que use **paperweight-userdev**,
consulta este [plugin de ejemplo](https://github.com/PaperMC/paperweight-test-plugin).

:::

## Por qué resulta útil
Es la única forma admitida de acceder a los componentes internos del servidor, ya que redistribuir el JAR del servidor infringe la
EULA de Minecraft y las condiciones generales de la licencia. Aunque dependieras manualmente del servidor parcheado,
dificultarías el trabajo de otras personas en tu proyecto y no tendrías en el IDE los Javadocs ni el código fuente de la API desplegada.

Además, Spigot y las versiones de Paper anteriores a 1.20.5 siguen usando mappings de Spigot, que combinan campos y métodos ofuscados
con clases cuyos nombres están mapeados o personalizados. Esto puede dificultar el trabajo en un entorno de desarrollo. Este plugin permite
usar tipos, nombres y campos completamente desofuscados durante el desarrollo y luego remapea tu plugin para que siga siendo compatible
con el servidor ofuscado. Sin embargo, esto no se aplica a la reflexión. Si quieres admitir servidores ofuscados y usar nombres sin ofuscar
en la reflexión, puedes consultar una biblioteca como [esta](https://github.com/jpenilla/reflection-remapper).

:::note[Eliminación de la ofuscación en 26.1]

A partir de Minecraft **26.1**, Paper ya no admite plugins ofuscados porque Mojang ha eliminado la ofuscación de su JAR del servidor.
Como Minecraft ahora se distribuye sin ofuscar, ya no hay mappings de Spigot 26.1 a los que ofuscar. Por este motivo, la función de
reofuscación ya no funciona con los dev bundles de 26.1 y versiones posteriores.

:::

## Añadir el plugin
Añade el plugin al archivo `build.gradle.kts`.

```kts title="build.gradle.kts" replace
plugins {
  id("io.papermc.paperweight.userdev") version "\{LATEST_USERDEV_RELEASE}"
}
```

:::note[Versión de Gradle]

Asegúrate de usar la versión estable más reciente de Gradle.
Para obtener más información sobre cómo actualizar Gradle, consulta la [documentación de Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html).

:::

La versión más reciente de `paperweight-userdev` admite dev bundles para Minecraft 1.17.1 y posteriores, así que se recomienda mantenerla actualizada.
Solo se admite oficialmente la versión más reciente de `paperweight-userdev`; si tienes problemas con versiones antiguas, primero te pediremos que la actualices.
Además, si tienes problemas con `paperweight-userdev`, pregunta en el canal
[`#build-tooling-help`](https://discord.com/channels/289587909051416579/1078993196924813372) de nuestro [servidor de Discord](https://discord.gg/PaperMC).

:::note[Snapshots]

Las versiones SNAPSHOT (preliminares) de **paperweight-userdev** solo están disponibles en el repositorio Maven de Paper.
```kotlin title="settings.gradle.kts"
pluginManagement {
  repositories {
    gradlePluginPortal()
    maven("https://repo.papermc.io/repository/maven-public/")
  }
}
```

:::

## Añadir la dependencia del dev bundle
Si ahora intentas cargar tu proyecto de Gradle, recibirás un error que indica que debes declarar una dependencia de dev bundle.
Puedes hacerlo añadiendo lo siguiente al bloque `dependencies` de tu archivo `build.gradle.kts`.

```kotlin title="build.gradle.kts" replace
dependencies {
  // Otras dependencias
  paperweight.paperDevBundle("\{LATEST_PAPER_RELEASE}.build.+")
}
```

:::tip

Deberías eliminar cualquier dependencia de la API de Paper, ya que el dev bundle la incluye.

:::

:::note[Configuración de la cadena de herramientas de Java para la preparación de userdev]

Es posible que un dev bundle determinado no admita siempre la cadena de herramientas de Java que Gradle tiene configurada
(ya sea de forma explícita o heredada del entorno de ejecución de Gradle).
Si se produce un error al ejecutar `paperweightUserdevSetup` (especialmente errores al aplicar parches),
puedes probar a configurar la propiedad `javaLauncher` de paperweight con otra versión de Java.

Por ejemplo, con 1.17.1:
```kts title="build.gradle.kts"
paperweight {
  javaLauncher = javaToolchains.launcherFor {
    // Ejemplo:
    // Paper 1.17.1 se compiló originalmente con JDK 16 y el paquete
    // no se ha actualizado para funcionar con JDK 21 o posterior (pero queremos compilar con una cadena de herramientas de la versión 25).
    languageVersion = JavaLanguageVersion.of(17)
  }
}
```

Entre otros, la [rama multi-project de PaperMC/paperweight-test-plugin](https://github.com/PaperMC/paperweight-test-plugin/tree/multi-project)
hace uso de esta función.

:::

## Reofuscación (hasta 1.21.11)

:::danger

Desde Minecraft **26.1**, Paper ya no admite remapear tu plugin a los mappings de ejecución de Spigot.
Esta sección se conserva como referencia para versiones anteriores; sin embargo,
los plugins reofuscados no funcionarán en Paper 26.1 ni en versiones posteriores.

:::

La tarea `reobfJar` crea un JAR de plugin reofuscado con los mappings de ejecución de Spigot.
Esto significa que funcionará en servidores Paper estándar.

El resultado estará en la carpeta `build/libs`. El JAR cuyo nombre de archivo incluye `-dev` está mapeado por Mojang
(no está reofuscado) y no funcionará en servidores que no sean Paper.

:::note[Shadow]

Si aplicas el plugin de Gradle Shadow en tu script de compilación, **paperweight-userdev** lo detectará y usará el JAR sombreado como entrada de la tarea `reobfJar`.

El archivo `-dev-all.jar` de `build/libs` tiene las dependencias sombreadas, pero no está reofuscado.

:::

Puedes hacer que la tarea `reobfJar` se ejecute como parte de la tarea predeterminada `build`:
```kotlin title="build.gradle(.kts)"
tasks.assemble {
  dependsOn(tasks.reobfJar)
}
```

### De 1.20.5 a 1.21.11

Desde la versión 1.20.5, Paper se distribuye con un entorno de ejecución mapeado por Mojang, en lugar de reofuscar el servidor con los mappings de Spigot.
Además, las clases de CraftBukkit ya no se reubican en un paquete con versión.
Por ello, cuando sea necesario, los plugins deben desofuscarse antes de cargarse.

paperweight automatiza gran parte de este proceso, pero hay algunos aspectos importantes que debes conocer sobre el uso de componentes internos del servidor (o «NMS»).

#### Suposición de mappings predeterminada

* De forma predeterminada, se supondrá que todos los plugins de Spigot/Bukkit usan mappings de Spigot si no especifican el espacio de nombres de mappings en el manifiesto.
  Del mismo modo, se supondrá que todos los plugins de Paper usan mappings de Mojang si no especifican el espacio de nombres de mappings en el manifiesto.
* Los plugins con mappings de Spigot deberán desofuscarse en la primera carga; los plugins con mappings de Mojang no.

#### Compilar con mappings de Mojang

:::note

Esta es la opción preferida, ya que se omitirá el remapeo único del plugin durante el inicio del servidor y
podría permitirte mantener la compatibilidad entre actualizaciones menores sin cambios ni módulos adicionales.
Sin embargo, tu plugin no será compatible con servidores Spigot.

:::

Si quieres que el artefacto principal use mappings de Mojang, elimina todas las líneas `dependsOn(reobfJar)` y añade el siguiente código al script de compilación:

```kotlin title="build.gradle.kts"
paperweight.reobfArtifactConfiguration = io.papermc.paperweight.userdev.ReobfArtifactConfiguration.MOJANG_PRODUCTION
```

#### Compilar con mappings de Spigot

Si quieres que el artefacto principal use mappings de Spigot, añade el siguiente código al script de compilación:

```kotlin title="build.gradle.kts"
paperweight.reobfArtifactConfiguration = io.papermc.paperweight.userdev.ReobfArtifactConfiguration.REOBF_PRODUCTION
```

Esto resulta útil para plugins que tienen cargadores tanto para Spigot como para Paper y quieren ser compatibles con ambos.

:::note

Si usas Gradle con Groovy DSL, debes acceder a los campos mediante métodos estáticos, como `getMOJANG_PRODUCTION()`.

:::
