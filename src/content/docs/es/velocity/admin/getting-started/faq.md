---
title: Preguntas frecuentes
description: Preguntas frecuentes sobre la administración de Velocity.
slug: es/velocity/faq
---

Con los años, los usuarios nos han hecho muchas veces las mismas preguntas. Estas preguntas frecuentes intentan responder
a tantas como sea posible desde la perspectiva del usuario.

## ¿Qué versión de Java requiere Velocity?

Velocity 4.0.x y versiones posteriores requieren al menos Java 25.

## ¿Dónde puedo encontrar plugins de Velocity?

Una buena fuente para encontrar plugins compatibles con Velocity es nuestro repositorio de plugins,
[Hangar](https://hangar.papermc.io/?page=0&platform=VELOCITY).

## ¿Velocity admite plugins desarrollados para BungeeCord o Waterfall?

No. Si decidiéramos admitir plugins de BungeeCord, muchas de las funciones de Velocity no serían posibles.

Sin embargo, algunos plugins pueden tener versiones para Velocity o alternativas disponibles. Además,
los plugins compatibles con BungeeCord que solo requieren instalarse en el servidor
(y no en el proxy) suelen usar el canal de mensajería de plugins de BungeeCord, que las últimas versiones de Velocity admiten
nativamente.

Si no hay una versión para Velocity ni una alternativa, el proyecto de terceros [Snap](https://hangar.papermc.io/Phoenix616/Snap)
ofrece una forma experimental de ejecutar plugins de BungeeCord/Waterfall en Velocity.
Ten en cuenta que algunos plugins podrían no funcionar correctamente, así que siempre debes hacer tus propias pruebas.
El proyecto Velocity no mantiene Snap ni está afiliado a él.

## ¡Ayuda, no puedo conectarme a mi servidor!

Hay varias causas habituales por las que no puedes conectarte al servidor.

### Solución de problemas básica

Como primer paso, comprueba lo siguiente:

- que tus servidores estén iniciados y respondan a los comandos de la consola
- que el proxy esté iniciado
- que el servidor y el proxy estén vinculados al puerto y la IP adecuados

### Errores por reenvío incorrecto de información de jugadores

```
Can't connect to server lobby: If you wish to use IP forwarding, please enable it in your Bungeecord config as well!
```

```
Can't connect to server lobby: Your server did not send a forwarding request to the proxy. Is it set up correctly?
```

Estos errores se deben a una configuración incorrecta. Consulta
[Reenvío de información de jugadores](/es/velocity/player-information-forwarding) para aprender a configurarlo correctamente.

```
Can't connect to server lobby: This server requires you to connect with Velocity.
```

Este error se debe a que se ha habilitado el reenvío moderno de Velocity en el servidor backend, pero no
en Velocity. Para corregirlo, asegúrate de haber configurado el método correcto de reenvío de información
de jugadores en el proxy. Consulta [Reenvío de información de jugadores](/es/velocity/player-information-forwarding) para
obtener más información.

### Carga útil `REGISTER` no válida

```
[server connection] player1 -> hub has connected
[connected player] player1 (/localhost:58943): kicked from server hub: Invalid payload REGISTER!
```

Este error suele aparecer en servidores basados en Spigot cuando alguien se conecta con un cliente con mods. Puedes
corregirlo si usas Paper (o una bifurcación de Paper) 1.12.2 o posterior, añadiendo la opción de inicio
[`-Dpaper.disableChannelLimit=true`](/es/paper/reference/system-properties#paperdisablechannellimit)
a las opciones de inicio del servidor y reiniciándolo.

### Identificador de tipo de argumento desconocido

```
Argument type identifier <namespace>:<name> unknown.
```

Si recibes este mensaje, hay dos posibilidades. Si ejecutas un servidor con mods y usas
Fabric 1.16 o posterior, actualiza al menos a Velocity 1.1.2 e instala
[CrossStitch](https://www.curseforge.com/minecraft/mc-mods/crossstitch). (Si usas cualquier
otro tipo de servidor con mods y consigues que funcione con Velocity, ¡cuéntanoslo!)

Si recibes este mensaje pero ejecutas un servidor Vanilla,
[informa del error en el seguimiento de incidencias de Velocity](https://github.com/PaperMC/Velocity/issues/new).

### Tiempo de espera agotado al cambiar a un servidor Forge

En especial con algunos paquetes de mods muy grandes, existe un mayor riesgo de que se interrumpa la conexión entre el
jugador y el proxy. No podemos hacer mucho para evitarlo desde el proxy. Te sugerimos reducir la cantidad de mods del servidor o aumentar la opción `read-timeout` en
`velocity.toml` y añadir la opción de inicio `-Dfml.readTimeout` al servidor Forge, con
el valor (en segundos) que hayas elegido para el proxy. Por ejemplo, si determinas que el mejor tiempo de espera de lectura es
120 segundos, usa `-Dfml.readTimeout=120` y configura `read-timeout = 120000` en
`velocity.toml`.

### ¡Mis hosts forzados no funcionan!

Si dependes de registros SRV para dirigir al jugador al proxy, recuerda que Velocity compara `forced-hosts` con el **nombre de host que envía el cliente**, que se resuelve antes de la conexión; no necesariamente coincide con la dirección que escribe el jugador.

Para que `forced-hosts` funcione con un proxy en un puerto no predeterminado (por ejemplo, `12345`), usa esta configuración:

Crea los registros DNS:
- **CNAME:** `forced1.example.com → actual.server.address.com`
- **SRV:** `_minecraft._tcp.survival → forced1.example.com` (priority: 0, weight: 0, port: 12345)

En `velocity.toml`:
```toml
[forced-hosts]
"forced1.example.com" = ["survival"] # survival.example.com
```

Aunque el jugador se conecte mediante `survival.example.com`, el registro SRV apunta a `forced1.example.com`, que es lo que el cliente envía a Velocity; así puede coincidir correctamente con `forced-hosts`.

### Los plugins no pueden modificar mensajes ni comandos

```
A plugin tried to cancel a signed chat message. This is no longer possible in 1.19.1 and newer. Disconnecting player <player>
```

A partir de Minecraft 1.19.1, Mojang implementó un nuevo sistema de chat que cifra cada mensaje con
la clave firmada de cada jugador. Velocity aún no admite por completo la cancelación o modificación
de este tipo de mensajes y comandos. Puedes instalar el plugin [SignedVelocity](https://hangar.papermc.io/4drian3d/SignedVelocity),
que permitirá transmitir el mensaje o comando a tu servidor. Cuando lo reciba, el servidor
aplicará el resultado calculado en Velocity.
