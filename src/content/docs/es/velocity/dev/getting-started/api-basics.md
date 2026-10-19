---
title: Conceptos básicos de los plugins de Velocity
description: Cómo empezar a usar la API de Velocity.
slug: es/velocity/dev/api-basics
---

Ahora sentaremos las bases para tu primer plugin. Veremos cómo crear tu primer
plugin de Velocity.

## Crear la clase del plugin

Crea una clase (por ejemplo, `com.example.velocityplugin.VelocityTest`) y pega este código:

```java title="VelocityTest.java" collapse={1-6} showLineNumbers
package com.example.velocityplugin;

import com.google.inject.Inject;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;
import org.slf4j.Logger;

@Plugin(id = "myfirstplugin", name = "Mi primer plugin", version = "0.1.0-SNAPSHOT",
        url = "https://example.org", description = "¡Lo hice!", authors = {"Yo"})
public class VelocityTest {

  private final ProxyServer server;
  private final Logger logger;

  @Inject
  public VelocityTest(ProxyServer server, Logger logger) {
    this.server = server;
    this.logger = logger;

    logger.info("¡Hola! He creado mi primer plugin con Velocity.");
  }
}
```

¿Qué acabas de hacer? Hay bastante que explicar, así que centrémonos en las partes específicas de Velocity:

```java
@Plugin(id = "myfirstplugin", name = "Mi primer plugin", version = "0.1.0-SNAPSHOT",
        url = "awesome.org", description = "¡Lo hice!", authors = {"Yo"})
public class VelocityTest {
```

Esto indica a Velocity que esta clase contiene tu plugin (`myfirstplugin`), para que pueda cargarse
cuando se inicie el proxy. Velocity detectará dónde se encuentra el plugin al compilarlo.

El constructor también recibe estos objetos:

```java
@Inject
public VelocityTest(ProxyServer server, Logger logger) {
  this.server = server;
  this.logger = logger;

  logger.info("¡Hola! Este es un plugin de prueba.");
}
```

Velocity proporciona estos objetos mediante inyección de dependencias. La anotación
[`@Inject`](https://javadoc.io/doc/com.google.inject/guice/latest/com/google/inject/Inject.html)
indica que Velocity debe proporcionar un objeto
[](jd:velocity:com.velocitypowered.api.proxy.ProxyServer)
y un [`Logger`](https://www.slf4j.org/api/org/slf4j/Logger.html) al construir el plugin.
Ambas interfaces te serán útiles al desarrollar con Velocity. No hace falta profundizar más en la
inyección de dependencias: Velocity se encarga de proporcionarte estos objetos.

Compila el plugin, colócalo en el directorio `plugins/` y pruébalo. En la siguiente sección se explica
cómo usar la API.

## Elegir los metadatos de [`@Plugin`](jd:velocity:com.velocitypowered.api.plugin.Plugin)

Elige con cuidado el ID de tu plugin. Otros plugins usarán este ID para declarar una dependencia del tuyo. Si lo cambias,
podrías romper la compatibilidad.

El nombre del plugin es algo menos importante. Se mostrará a los usuarios como el nombre visible de tu
plugin, pero cambiarlo no tendrá consecuencias graves.

Para la versión, recomendamos seguir el versionado semántico; puedes leer más sobre este concepto
en [semver.org](https://semver.org). Básicamente, usa tres números, como 1.4.25.
Incrementa el número mayor cuando hagas un cambio incompatible, el
número menor cuando añadas funcionalidad compatible con versiones anteriores y el número de parche
cuando corrijas un error o realices un cambio de implementación que no afecte al comportamiento.

También puedes indicar la URL, los autores y la descripción del plugin en la anotación `@Plugin`.
Las dependencias de otros plugins también se especifican allí, pero lo veremos más adelante en la página
[Gestión de dependencias](/es/velocity/dev/dependency-management).

### Una advertencia

:::caution

En Velocity, la carga de plugins se divide en dos fases: construcción e inicialización. El código del
constructor de tu plugin forma parte de la fase de construcción. Hay muy pocas operaciones que puedas realizar de forma segura
durante la construcción, sobre todo porque la API no especifica cuáles lo son. En particular, no puedes registrar un suscriptor de eventos en el constructor: necesitas
que el plugin esté registrado, pero Velocity no puede registrarlo hasta que se haya construido,
lo que crea un problema de «qué fue primero, el huevo o la gallina».

Para romper este círculo, espera siempre a la inicialización, que se indica cuando
Velocity dispara [](jd:velocity:com.velocitypowered.api.event.proxy.ProxyInitializeEvent).
Puedes realizar operaciones durante la inicialización añadiendo un suscriptor para este evento, como se muestra a continuación.
Ten en cuenta que Velocity registra automáticamente la clase principal del plugin como suscriptor.

```java
@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
  // Realiza aquí una operación que requiera acceso a la API de Velocity.
  // Por ejemplo, podrías registrar un evento:
  server.getEventManager().register(this, new PluginListener());
}
```

:::

## Obtener el directorio de tu plugin

Para acceder al directorio de datos del plugin, añade
`@DataDirectory Path dataDirectory` a los parámetros del constructor:

```java
private final Path dataDirectory;

@Inject
public VelocityTest(ProxyServer server, Logger logger, @DataDirectory Path dataDirectory) {
  this.server = server;
  this.logger = logger;
  this.dataDirectory = dataDirectory;
}
```

Esto te proporcionará un [](jd:java:java.nio.file.Path) que representa el directorio del plugin.
Si realmente necesitas un [](jd:java:java.io.File),
puedes usar [](jd:java:java.nio.file.Path#toFile()).
Sin embargo, Velocity suele trabajar con `Path`.
