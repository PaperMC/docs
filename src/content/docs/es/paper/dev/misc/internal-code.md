---
title: Componentes internos de Minecraft
description: Breve introducción al uso de componentes internos en tu plugin.
slug: es/paper/dev/internals
---

El código que ejecuta Minecraft no es de código abierto. Bukkit es una API que permite a los plugins interactuar con el servidor.
La implementa CraftBukkit, que interactúa con el código de Minecraft. Al hablar de los componentes internos de Minecraft,
es habitual oír los términos NMS y CraftBukkit.

:::danger[Uso de componentes internos de Minecraft]

No se recomienda usar componentes internos de Minecraft. El código interno no garantiza estabilidad y cambia con frecuencia,
por lo que tu plugin podría dejar de funcionar cuando se publique una nueva versión de Minecraft.
Siempre que sea posible, usa la API en lugar de los componentes internos.

**PaperMC no ofrece asistencia directa para programar contra los componentes internos de Minecraft.**

:::

## ¿Qué es NMS?

NMS significa `net.minecraft.server` y se refiere a un paquete Java que contiene gran parte del código de Mojang. Este código
es propietario y no es de código abierto. No se garantiza que sea estable al invocarlo desde fuera y puede cambiar en cualquier momento.

## Acceder a los componentes internos de Minecraft

Para usar código de Mojang y CraftBukkit, puedes utilizar el plugin de Gradle `paperweight-userdev` o la reflexión.
[`paperweight-userdev`](https://github.com/PaperMC/paperweight-test-plugin) es la forma recomendada de acceder al código interno,
ya que es más fácil trabajar con el código remapeado en el IDE. Encontrarás más información en la sección
[`paperweight-userdev`](/es/paper/dev/userdev).

Sin embargo, si no puedes usar `paperweight-userdev`, puedes usar la reflexión.

### Reflexión

La reflexión permite acceder al código durante la ejecución. Esto permite acceder a código que quizá no esté disponible durante la compilación.
A menudo se usa para acceder al código interno en varias versiones. Sin embargo, si se usa incorrectamente, la reflexión puede afectar
al rendimiento. Por ejemplo, si accedes a un método o campo más de una vez, deberías almacenar en caché el
[](jd:java:java.lang.reflect.Field)/
[](jd:java:java.lang.reflect.Method) para evitar el coste de buscar el campo o método cada vez.

:::caution[1.20.4 y anteriores]

El código interno de CraftBukkit se reubicaba en `org.bukkit.craftbukkit.<version>`, salvo que ejecutaras una versión de Paper mapeada por Mojang.
Hasta la versión 1.20.5, esto era poco frecuente en la mayoría de los entornos de producción. Por tanto, cualquier intento de acceder
por reflexión debía incluir la versión. Por ejemplo, `org.bukkit.craftbukkit.v1_20_R2.CraftServer` era el nombre completo de clase y paquete
de la clase CraftServer en la versión 1.20.2. Se podía acceder fácilmente a estas clases con algunas utilidades de reflexión.

```java
private static final String CRAFTBUKKIT_PACKAGE = Bukkit.getServer().getClass().getPackageName();

public static String cbClass(String className) {
    return CRAFTBUKKIT_PACKAGE + "." + className;
}

// Después puedes usar este método para obtener la clase de CraftBukkit:
Class.forName(cbClass("entity.CraftBee"));
```

:::

El código de Minecraft está ofuscado. Esto significa que se cambian los nombres de las clases y los métodos para dificultar su comprensión.
Paper desofusca estos identificadores durante el desarrollo y, desde la versión 1.20.5, también durante la ejecución.

:::caution[1.20.4 y anteriores]

Antes, para ofrecer compatibilidad con plugins antiguos, Paper se reofuscaba durante la ejecución.
Podías usar una biblioteca como [reflection-remapper](https://github.com/jpenilla/reflection-remapper) para remapear automáticamente las
referencias de reflexión. Esto permitía usar en el código los nombres desofuscados y mapeados por Mojang. Se recomendaba hacerlo porque
facilitaba la comprensión del código.

:::

### Servidores mapeados por Mojang

Ejecutar un servidor mapeado por Mojang (moj-map) es una excelente forma de simplificar los procesos, porque puedes desarrollar usando
los mismos mappings que estarán presentes durante la ejecución. Así se elimina la necesidad de remapear durante la compilación,
lo que simplifica la depuración y permite hacer hotswap de plugins.

Desde la versión 1.20.5, Paper se distribuye de forma predeterminada con un entorno de ejecución mapeado por Mojang, en lugar de reofuscar
el servidor con los mappings de Spigot. Al adoptar los mappings de Mojang, te aseguras de que tu plugin no necesite remapeo interno durante la ejecución.
Para obtener más información, consulta la sección [configuración del proyecto](/es/paper/dev/project-setup)
y la documentación de [userdev](/es/paper/dev/userdev#de-1205-a-12111), donde se explican estos cambios.

### Obtener la versión actual de Minecraft

Puedes obtener la versión actual de Minecraft para usar el código adecuado para una versión específica. Puedes hacerlo
con uno de los siguientes métodos:

```java replace
// Valor de ejemplo: \{LATEST_PAPER_RELEASE}
String minecraftVersion = Bukkit.getServer().getMinecraftVersion();

// Valor de ejemplo: \{LATEST_PAPER_RELEASE}-R0.1-SNAPSHOT
String bukkitVersion = Bukkit.getServer().getBukkitVersion();

// Valor de ejemplo para la versión 1.20.1: 3465
int dataVersion = Bukkit.getUnsafe().getDataVersion();
```

:::danger[Analizar la versión]

Desde la versión 1.20.5 ya no se puede analizar la versión a partir del nombre del paquete de las clases, porque Paper dejó de reubicar
el paquete de CraftBukkit. Consulta la sección [reflexión](#reflexión) para obtener más información.

:::
