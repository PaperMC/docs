---
title: Plataformas
slug: es/adventure/platform
description: Documentación sobre distintas implementaciones de la API de Adventure.
tableOfContents: false
sidebar:
  label: Resumen
---

Adventure se integra con muchas plataformas de Minecraft. Algunas admiten
Adventure de forma nativa, mientras que otras plataformas antiguas tienen sus propios tipos y necesitan un adaptador para gestionar los tipos de Adventure. Para que puedas usar Adventure con estas plataformas, Adventure ofrece varios adaptadores específicos que
permiten obtener instancias `Audience` a partir de tipos de usuario nativos.

:::note[Preguntas frecuentes]

**¿Por qué adventure-platform no envía mensajes o no funciona correctamente?**

Primero, asegúrate de usar la versión estable más reciente. Puedes encontrarla en [Maven Central](https://central.sonatype.com/search?q=g%3Anet.kyori+adventure-platform*).

Después, comprueba que la función que usas esté disponible en la versión del cliente que recibe la acción.
Por ejemplo, los códigos de color hexadecimales no funcionan en clientes anteriores a 1.16, por lo que se convertirán al color compatible más cercano.

Si aún no funciona, puede ser útil habilitar el modo de depuración estableciendo en `true` la propiedad del sistema `net.kyori.adventure.debug` y
consultando la salida. Ahí se mostrarán las facetas seleccionadas, lo que ayudará a identificar el motivo del problema.
Si no consigues resolverlo por tu cuenta, siempre puedes preguntar en el canal
[`#adventure-platform-help`](https://discord.com/channels/289587909051416579/1342379165663363112) del servidor de Discord de PaperMC.

:::

### Contenido:
* [Compatibilidad nativa](/es/adventure/platform/native)
* [Con mods (API compartida de Fabric y NeoForge)](/es/adventure/platform/modded)
  * [Dependencia](/es/adventure/platform/modded#dependencia)
  * [Uso básico](/es/adventure/platform/modded#uso-básico)
  * [Trabajar con tipos nativos](/es/adventure/platform/modded#trabajar-con-tipos-nativos)
* [Fabric](/es/adventure/platform/fabric)
  * [Dependencia](/es/adventure/platform/fabric#dependencia)
  * [Uso básico](/es/adventure/platform/fabric#uso-básico)
  * [Servidor](/es/adventure/platform/fabric#servidor)
  * [Cliente](/es/adventure/platform/fabric#dependencia)
  * [Trabajar con tipos nativos](/es/adventure/platform/fabric#trabajar-con-tipos-nativos)
* [NeoForge](/es/adventure/platform/neoforge)
  * [Dependencia](/es/adventure/platform/neoforge#dependencia)
  * [Uso básico](/es/adventure/platform/neoforge#uso-básico)
  * [Servidor](/es/adventure/platform/neoforge#servidor)
  * [Comandos](/es/adventure/platform/neoforge#comandos)
  * [Cliente](/es/adventure/platform/neoforge#dependencia)
* [Implementar plataformas](/es/adventure/platform/implementing)
  * [Servicios](/es/adventure/platform/implementing#servicios)
  * [Comportamientos convencionales](/es/adventure/platform/implementing#comportamientos-convencionales)

### Plataformas antiguas

:::danger

Las implementaciones de la plataforma Adventure para Bungeecord, Bukkit/Spigot y Sponge API 7, así como sus serializadores asociados, ya no se mantienen.
El equipo de Adventure ya no ofrece asistencia para estas bibliotecas.

Recomendamos que quienes usan estas bibliotecas migren a plataformas modernas con [compatibilidad nativa con Adventure](/es/adventure/platform/native) (por ejemplo, Velocity, Paper y Sponge API 8 o posterior).
Si desarrollas para plataformas con mods, te recomendamos usar [adventure-platform-mod](/es/adventure/platform/modded) para obtener compatibilidad casi nativa con Fabric y NeoForge.

:::

* [Bukkit](/es/adventure/platform/bukkit)
  * [Uso](/es/adventure/platform/bukkit#uso)
  * [Serializadores de componentes](/es/adventure/platform/bukkit#serializadores-de-componentes)
* [BungeeCord](/es/adventure/platform/bungeecord)
  * [Uso](/es/adventure/platform/bungeecord#uso)
  * [Serializadores de componentes](/es/adventure/platform/bungeecord#serializadores-de-componentes)
* [SpongeAPI](/es/adventure/platform/spongeapi)
  * [Uso](/es/adventure/platform/spongeapi#uso)
* [ViaVersion](/es/adventure/platform/viaversion)
