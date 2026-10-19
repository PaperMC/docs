---
title: Configurar el reenvío de información de jugadores
description: Cómo configurar el reenvío de información en Velocity.
slug: es/velocity/player-information-forwarding
---

Velocity permite reenviar a tus servidores información sobre los jugadores, como direcciones IP,
UUID y skins. Velocity admite tres formatos de reenvío:

- **Reenvío moderno de Velocity** es un formato de reenvío propio (reenvío moderno) que ofrece
  mayor seguridad.
- **Reenvío de BungeeCord** (también conocido como _reenvío heredado_) ofrece mayor compatibilidad, pero
  es menos seguro.
- **BungeeGuard** funciona igual que el reenvío de BungeeCord, pero incluye una clave secreta. Es
  más seguro que usar solo el reenvío de BungeeCord, pero menos recomendable que el reenvío moderno de Velocity.

:::note

Solo puedes elegir uno de estos formatos de reenvío. Actualmente no es posible combinar modos de reenvío
ni usarlos todos a la vez. En general, si solo admites clientes con Minecraft 1.13 o posterior,
usa el reenvío moderno de Velocity; de lo contrario, debes usar el reenvío de BungeeCord.

:::

## Configurar el reenvío moderno

El reenvío `modern` es un formato nativo de Velocity. Reenvía toda la información de los jugadores en un formato
binario eficiente y utiliza un código MAC para dificultar que se engañe al servidor y se suplante a tu proxy Velocity.
Sin embargo, solo está disponible para Minecraft 1.13 o posterior.

:::caution

El reenvío moderno no es compatible con versiones de Minecraft anteriores a la 1.13 ni con el
plugin ProtocolSupport. Si usas alguno de ellos, tendrás que usar el reenvío heredado compatible con BungeeCord.

:::

Para usar el reenvío moderno con cualquier implementación de servidor compatible, establece la opción `player-info-forwarding-mode`
de `velocity.toml` en `modern`. Después, asegúrate de que el servidor esté configurado correctamente
para usar el reenvío de Velocity.

### Configurar el reenvío moderno para Paper

Paper 1.14 y posteriores, así como Paper 1.13.1/1.13.2 compilación 377 y posteriores, admiten de forma nativa el reenvío moderno
de Velocity.

En primer lugar, debes desactivar la opción `online-mode` del archivo [`server.properties`](/es/paper/reference/server-properties#online_mode). Así se evita
que el servidor autentique a los jugadores; esa tarea la realizará el proxy.

También debes desactivar el reenvío de BungeeCord si lo habías habilitado. Asegúrate de que
`settings.bungeecord` esté establecido en `false` en `spigot.yml`.

En `config/paper-global.yml`, establece `proxies.velocity.enabled` en true y
`proxies.velocity.secret` con el mismo secreto que figura en el archivo `forwarding.secret`. También debes establecer
`proxies.velocity.online-mode` para que coincida con la opción `online-mode` de `velocity.toml`. Cuando
termines de editar `paper-global.yml`, reinicia el servidor.

:::note

Si usas Paper 1.18.2 o anterior, encontrarás estas opciones como `settings.velocity-support.enabled`,
`settings.velocity-support.secret` y `settings.velocity-support.online-mode` en el archivo `paper.yml`.

:::

## Configurar el reenvío moderno para Fabric

El mod [FabricProxy-Lite](https://modrinth.com/mod/fabricproxy-lite) permite usar
el reenvío moderno de Velocity con un servidor con mods que use Fabric. Para mayor compatibilidad, puedes usar el mod [CrossStitch](https://modrinth.com/mod/crossstitch).

## Configurar el reenvío moderno para Forge

El mod [ProxyCompatibleForge](https://modrinth.com/mod/proxy-compatible-forge) permite usar
el reenvío moderno de Velocity con un servidor con mods que use Forge 1.14 o posterior.

## Configurar el reenvío heredado compatible con BungeeCord

:::danger

El reenvío heredado es **fundamentalmente inseguro**. Si tienes que usarlo, debes comprender
[cómo proteger correctamente tu servidor](/es/velocity/security). Esa página repasa todas las opciones
disponibles para protegerlo y evitar que se conecte alguien que no sea el proxy.

:::

El reenvío `legacy` es el protocolo de reenvío de información de jugadores que BungeeCord utiliza
cuando se habilita el reenvío de IP. Por eso es ubicuo y la mayoría de las implementaciones de servidor lo admiten
ampliamente. Tiene una compatibilidad excelente (admite versiones tan antiguas como la 1.7.2,
publicada en 2013) y funciona con Forge si también instalas SpongeForge/BungeeForge en tu servidor con mods y
lo configuras correctamente. Sin embargo, no es seguro.

Si debes usar el reenvío compatible con BungeeCord, establece `player-info-forwarding-mode`
en `velocity.toml` como `legacy`. También debes asegurarte de que el servidor pueda aceptar los
datos de jugador reenviados por Velocity.

Para añadir algo de seguridad, especialmente en proxies alojados en servicios de hosting compartido, Velocity admite opcionalmente
el plugin [BungeeGuard](https://www.spigotmc.org/resources/bungeeguard.79601/). Para usarlo,
establece la opción `player-info-forwarding-mode` de `velocity.toml` en `bungeeguard` y añade el valor del
archivo `forwarding.secret` a la sección de tokens de la configuración de BungeeGuard.

### Configurar el reenvío heredado para Spigot / Paper

Para que Spigot o Paper reconozca los datos reenviados desde Velocity, establece `settings.bungeecord` en
`true` en `spigot.yml` y reinicia el servidor.

### Configurar el reenvío heredado para Sponge

Para configurar Sponge para que reconozca los datos reenviados desde Velocity, primero detén el servidor,
establece `modules.bungeecord` en `true` y `bungeecord.ip-forwarding` en `true` en el archivo
`config/sponge/global.conf` y reinicia el servidor Sponge.

### Configurar el reenvío heredado para Forge

Para configurar Forge para que reconozca los datos reenviados desde Velocity, primero detén el servidor,
descarga la versión correcta de [BungeeForge](https://github.com/caunt/BungeeForge/releases), coloca el mod en la carpeta mods y reinicia el servidor Forge.

### Configurar el reenvío heredado para Fabric

:::caution

Ya no hay mods con mantenimiento activo que admitan el reenvío heredado. En su lugar, usa el reenvío
moderno de Velocity.

:::
