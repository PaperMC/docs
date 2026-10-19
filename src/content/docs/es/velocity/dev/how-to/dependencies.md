---
title: Gestión de dependencias
description: Cómo gestionar las dependencias de tu plugin de Velocity.
slug: es/velocity/dev/dependency-management
---

Las dependencias son habituales. Quizá necesites integrarte con otro plugin o no quieras volver a escribir código
que otra persona ya ha resuelto. Sea cual sea el caso, necesitas gestionar tus dependencias
de forma eficaz.

## Dependencias de plugins

Para añadir una dependencia de otro plugin, usa la anotación
[`@Plugin`](jd:velocity:com.velocitypowered.api.plugin.Plugin)
en la clase principal. Veamos brevemente el ejemplo:

```java
@Plugin(
  id = "myfirstplugin",
  name = "Mi plugin",
  version = "0.1.0"
)
public class VelocityTest {
  // ...
}
```

Supongamos que dependemos de otro plugin llamado `wonderplugin`. Para añadirlo como dependencia, haz
lo siguiente:

```java
@Plugin(
  id = "myfirstplugin",
  name = "Mi plugin",
  version = "0.1.0",
  dependencies = {
    @Dependency(id = "wonderplugin")
  }
)
public class VelocityTest {
  // ...
}
```

El id de la dependencia coincide con el `id` del otro plugin en su anotación `@Plugin`. Por eso es
importante mantener estable el ID del plugin.

¡Eso es todo! Ahora tu plugin necesitará `wonderplugin` para cargarse y, cuando lo haga, se cargará
_después_ de `wonderplugin`.

Para especificar varias dependencias, sepáralas con comas:
`dependencies = {@Dependency(id = "wonderplugin"), @Dependency(id = "otherplugin")}`

## Dependencias opcionales de plugins

Para que una dependencia sea opcional, añade `optional = true`, como se muestra:

```java
@Plugin(
  id = "myfirstplugin",
  name = "Mi plugin",
  version = "0.1.0",
  dependencies = {
    @Dependency(id = "wonderplugin", optional = true)
  }
)
public class VelocityTest {
  // ...
}
```

## Dependencias externas

:::caution

Recuerda reubicar las dependencias que incluyas en el plugin. Si no lo haces, pueden producirse conflictos de dependencias
con otros plugins.

:::

Velocity no gestiona las dependencias de otras bibliotecas. Tendrás que añadirlas mediante tu
sistema de compilación.

Si tu plugin no incluye sus dependencias directamente, sino que las carga desde un directorio, puedes
usar el método de [](jd:velocity:com.velocitypowered.api.plugin.PluginManager)
[`addToClasspath`](jd:velocity:com.velocitypowered.api.plugin.PluginManager#addToClasspath(java.lang.Object,java.nio.file.Path))
en lugar de usar reflexión para acceder a
[](jd:java:java.lang.ClassLoader).
