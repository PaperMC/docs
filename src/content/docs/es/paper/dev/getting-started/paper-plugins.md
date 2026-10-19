---
title: Plugins de Paper
description: Guía de desarrollo para escribir plugins específicos de Paper.
slug: es/paper/dev/getting-started/paper-plugins
sidebar:
  badge:
    text: Experimental
    variant: danger
---

Los plugins de Paper permiten a los desarrolladores aprovechar conceptos más modernos introducidos por Mojang, como los datapacks, para
ampliar las posibilidades de la API de Paper.

:::danger[Experimental]

Esta función es experimental y podría cambiar.

:::

- [Bootstrapper](#bootstrapper)
- [Loader](#loaders)
- [Diferencias](#diferencias)

## ¿Cómo se usan?
Al igual que con los plugins de Bukkit, debes incluir un archivo `paper-plugin.yml` en la carpeta de recursos del JAR.
No sustituye directamente a `plugin.yml`, ya que algunos elementos, como se explica en esta guía, deben declararse de otra forma.

Ten en cuenta que puedes incluir tanto `paper-plugin.yml` como `plugin.yml` en el mismo JAR.

Este es un ejemplo de configuración:
```yaml replace
name: Example-Plugin
version: '1.0'
main: com.example.paperplugin.ExamplePlugin
description: A Paper plugin showcase
api-version: '\{LATEST_PAPER_RELEASE}'
bootstrapper: com.example.paperplugin.ExamplePluginBootstrap
loader: com.example.paperplugin.ExamplePluginLoader
```

### Declaración de dependencias

Los plugins de Paper cambian la forma de declarar dependencias en `paper-plugin.yml`:

```yml
dependencies:
  bootstrap:
    # Supongamos que RegistryPlugin registra datos que tu plugin necesita usar.
    # No lo necesitamos durante la ejecución, así que no es obligatorio en la sección server.
    # Sin embargo, si hace falta, puedes añadirla a ambas secciones.
    RegistryPlugin:
      load: BEFORE
      required: true
      join-classpath: true # Defaults to true
  server:
    # Añade una dependencia obligatoria "RequiredPlugin", que se cargará DESPUÉS de tu plugin.
    RequiredPlugin:
      load: AFTER
      required: true
      # Esto significa que tu plugin no tendrá acceso a su classpath.
      join-classpath: false
```

En los plugins de Paper, las dependencias se dividen en dos secciones:
- `bootstrap`: dependencias que usarás en el [bootstrap](#bootstrapper).
- `server`: dependencias que se usan para la funcionalidad principal del plugin mientras el servidor está en ejecución.

Veamos una dependencia:
```yml
RegistryPlugin:
  load: BEFORE # Defaults to OMIT
  required: true # Defaults to true
  join-classpath: true # Defaults to true
```

- `load` (`BEFORE`|`AFTER`|`OMIT`): indica si este plugin debe cargarse antes o después del **tuyo**. Nota: el orden de `OMIT` no está definido.
- `required`: indica si el plugin es necesario para cargar el tuyo.
- `join-classpath`: indica si tu plugin debe tener acceso al classpath del otro plugin. Se usa cuando un plugin necesita acceder directamente a componentes internos de otros plugins.

:::note[Carga cíclica]

Ten en cuenta que, en ciertos casos, los plugins pueden generar ciclos de carga que impidan iniciar el servidor.
Consulta la [guía sobre carga cíclica](#carga-cíclica-de-plugins) para obtener más información.

:::

Estos son algunos ejemplos:
```yml
# Supongamos que nuestro plugin necesita que ProtocolLib esté cargado.
ProtocolLib:
  load: BEFORE
  required: true

# Ahora registraremos algunos datos para un plugin de tienda.
# Por eso, el plugin de tienda debe cargarse después del nuestro.
SuperShopsXUnlimited:
  load: AFTER
  required: false

# Ahora necesitaremos acceder al classpath de un plugin.
# Así podremos interactuar correctamente con él.
SuperDuperTacoParty:
  required: true
  join-classpath: true
```

## ¿Para qué se usan?
Los plugins de Paper sientan las bases de futuras API. Nuestro objetivo es ofrecer más API modernas que se ajusten mejor a Vanilla.
Los plugins de Paper nos permiten hacerlo al introducir una nueva forma de cargar recursos de plugins antes de que se inicie el servidor,
mediante [bootstrappers](#bootstrapper).

## Bootstrapper
Los plugins de Paper pueden especificar su propio bootstrapper implementando
[](jd:paper:io.papermc.paper.plugin.bootstrap.PluginBootstrap)
y añadiendo la clase de la implementación al campo `bootstrapper` de `paper-plugin.yml`.
```java title="ExamplePluginBootstrap.java"
public final class ExamplePluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(final BootstrapContext context) {

    }

    @Override
    public JavaPlugin createPlugin(final PluginProviderContext context) {
        return new ExamplePlugin("My custom parameter");
    }

}
```

Un bootstrapper también permite cambiar la forma de inicializar el plugin y pasar valores al constructor.
Actualmente, los bootstrappers no ofrecen muchas API nuevas y son muy experimentales. Esto podría cambiar cuando se introduzcan más API.

## Loaders
Los plugins de Paper pueden especificar su propio loader implementando
[](jd:paper:io.papermc.paper.plugin.loader.PluginLoader)
y añadiendo la clase de la implementación al campo `loader` de `paper-plugin.yml`.

El objetivo del loader es crear un entorno previsto o dinámico en el que cargar el plugin.
Por ahora, esto solo se aplica a la creación del classpath esperado para el plugin; por ejemplo, permite proporcionar bibliotecas externas al plugin.
```java title="ExamplePluginLoader.java"
public final class ExamplePluginLoader implements PluginLoader {

    @Override
    public void classloader(final PluginClasspathBuilder classpathBuilder) {
        classpathBuilder.addLibrary(new JarLibrary(Path.of("dependency.jar")));

        final MavenLibraryResolver resolver = new MavenLibraryResolver();
        resolver.addDependency(new Dependency(new DefaultArtifact("com.example:example:version"), null));
        resolver.addRepository(new RemoteRepository.Builder("paper", "default", "https://repo.papermc.io/repository/maven-public/").build());

        classpathBuilder.addLibrary(resolver);
    }
}
```
Actualmente, puedes añadir dos tipos de bibliotecas:
[](jd:paper:io.papermc.paper.plugin.loader.library.impl.JarLibrary) y
[](jd:paper:io.papermc.paper.plugin.loader.library.impl.MavenLibraryResolver).

:::danger

Si quieres resolver bibliotecas desde Maven Central, usa un mirror. El uso directo de Maven Central como CDN infringe las condiciones de servicio de Maven Central y puede hacer que los usuarios de tu plugin alcancen los límites de solicitudes.

Usa el mirror predeterminado de Paper, configurado mediante la variable de entorno
[`PAPER_DEFAULT_CENTRAL_REPOSITORY`](/es/paper/reference/system-properties#paper_default_central_repository) y la propiedad del sistema
[`org.bukkit.plugin.java.LibraryLoader.centralURL`](/es/paper/reference/system-properties#orgbukkitpluginjavalibraryloadercentralurl):
```java
resolver.addRepository(new RemoteRepository.Builder("central", "default", MavenLibraryResolver.MAVEN_CENTRAL_DEFAULT_MIRROR).build());
```

Si usas el repositorio Maven Central (es decir, `*.maven.org` o `*.maven.apache.org`), se mostrará una advertencia en la consola.

:::

## Diferencias

### Sistema de serialización de Bukkit
Los plugins de Paper siguen admitiendo el sistema de serialización (`org.bukkit.configuration.serialization`) que usa Bukkit.
Sin embargo, las clases personalizadas no se registran automáticamente para la serialización. Para usar
[](jd:paper:org.bukkit.configuration.ConfigurationSection#getObject(java.lang.String,java.lang.Class)),
**debes** llamar a [](jd:paper:org.bukkit.configuration.serialization.ConfigurationSerialization#registerClass(java.lang.Class))
antes de intentar recuperar objetos de las configuraciones.

### Aislamiento de carga de clases
Los plugins de Paper no pueden acceder a otros plugins a menos que se les conceda acceso explícito, por ejemplo, mediante una dependencia.
Esto ayuda a evitar que accedan accidentalmente a las dependencias de otros plugins y, en general, garantiza que solo puedan acceder
a aquello de lo que dependen de forma explícita.

Los plugins de Paper pueden saltarse esta restricción y acceder a los classloaders de OTROS plugins añadiendo una opción `join-classpath` a su `paper-plugin.yml`.

```yml
Plugin:
  join-classpath: true # Means you have access to their classpath
```

Ten en cuenta que los demás plugins de Paper seguirán sin poder acceder al classloader del tuyo.

### Separación de la lógica de orden de carga
Para aprovechar mejor el aislamiento de carga de clases, los plugins de Paper **no** usan el campo `dependencies` para determinar el orden de carga.
Esto se hizo por varios motivos, principalmente para permitir un mayor control y que los plugins puedan compartir classloaders correctamente.

Consulta la sección sobre [declaración de dependencias](#declaración-de-dependencias) para obtener más información sobre cómo declarar el orden de carga del plugin.

### Comandos
Los plugins de Paper no usan el campo `commands` para registrar comandos. Por tanto, no hace falta incluir todos
los comandos en el archivo `paper-plugin.yml`. En su lugar, puedes registrarlos mediante la
[API de comandos Brigadier](/es/paper/dev/command-api/basics/introduction).

### Carga cíclica de plugins

La carga cíclica describe el fenómeno en el que la carga de un plugin genera un ciclo que vuelve al plugin original.
A diferencia de los plugins de Bukkit, los plugins de Paper no intentan resolver los problemas de carga cíclica.

```d2
style.fill: transparent
direction: right

Plugin A -> Plugin B
Plugin B -> Plugin C
Plugin C -> Plugin D
Plugin D -> Plugin A
```

Sin embargo, si Paper detecta un ciclo que no se puede resolver, aparecerá un error como este:
```
[ERROR]: [LoadOrderTree] =================================
[ERROR]: [LoadOrderTree] Circular plugin loading detected:
[ERROR]: [LoadOrderTree] 1) PluginA -> PluginB -> PluginA
[ERROR]: [LoadOrderTree]    PluginA loadbefore: [PluginB]
[ERROR]: [LoadOrderTree]    PluginB loadbefore: [PluginA]
[ERROR]: [LoadOrderTree] Please report this to the plugin authors of the first plugin of each loop or join the PaperMC Discord server for further help.
[ERROR]: [LoadOrderTree] =================================
```

Te corresponde resolver estos problemas de carga cíclica.
