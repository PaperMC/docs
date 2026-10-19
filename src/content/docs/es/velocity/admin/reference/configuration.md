---
title: Configurar Velocity
description: Velocity está diseñado para configurarse fácilmente y esta guía te explica cómo hacerlo.
slug: es/velocity/configuration
---

Velocity está diseñado para que resulte fácil configurarlo y ponerlo en marcha. Toda la configuración de Velocity se guarda en
`velocity.toml`, ubicado en el directorio desde el que iniciaste el proxy. Velocity usa el
formato de archivo [TOML](https://github.com/toml-lang/toml), porque es fácil de entender y evita
los inconvenientes de YAML y otros formatos de configuración habituales en la comunidad.

Puedes encontrar una versión actualizada de la configuración predeterminada en
[GitHub](https://github.com/PaperMC/Velocity/blob/dev/4.0.0/proxy/src/main/resources/default-velocity.toml).

## Tipos de datos

La configuración de Velocity incluye algunos tipos de datos «especiales».

### Chat

Los mensajes de chat se pueden proporcionar en formato [MiniMessage](/es/adventure/minimessage/format/).

La compatibilidad con RGB está disponible en Minecraft 1.16 y versiones posteriores.

### Dirección

Una dirección consiste en una dirección IP o un nombre de host y un puerto, separados por dos puntos (`:`). Por
ejemplo, `127.0.0.1:25577` y `server01.example.com:25565` son direcciones válidas.

## Sección raíz

Estos ajustes abarcan principalmente las opciones básicas y esenciales del proxy.

| Nombre del ajuste                  | Tipo    | Descripción                                                                                                                                                                                                                                                        |
|------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config-version`                   | String  | Versión actual de la configuración que usa Velocity. No debes modificar este ajuste.                                                                                                                                                                               |
| `bind`                             | Address | Indica al proxy que acepte conexiones en una IP específica. De forma predeterminada, Velocity escucha conexiones en todas las direcciones IP del equipo, en el puerto 25565.                                                                                       |
| `motd`                             | Chat    | Permite cambiar el mensaje que se muestra a los jugadores al añadir el servidor a su lista. Puedes usar el [formato MiniMessage](/es/adventure/minimessage/format/).                                                                                                |
| `show-max-players`                 | Integer | Permite personalizar el número «máximo» de jugadores que aparece en la lista de servidores. Ten en cuenta que Velocity no tiene un límite máximo de jugadores admitidos.                                                                                            |
| `online-mode`                      | Boolean | Indica si se debe autenticar a los jugadores con Mojang. Esta opción está habilitada de forma predeterminada.                                                                                                                                                      |
| `force-key-authentication`         | Boolean | Indica si el proxy debe exigir el nuevo estándar de seguridad de clave pública. Esta opción está habilitada de forma predeterminada.                                                                                                                               |
| `player-info-forwarding-mode`      | Enum    | Consulta [Configurar el reenvío de información de jugadores](/es/velocity/player-information-forwarding) para obtener más información.                                                                                                                             |
| `prevent-client-proxy-connections` | Boolean | Si el ISP/AS del cliente difiere del ISP/AS registrado por el servidor de autenticación de Mojang, se expulsa a ese cliente. Esto bloquea algunas conexiones VPN y de proxy, pero ofrece una protección limitada. |
| `forwarding-secret-file`           | String  | Nombre del archivo donde se guarda el secreto de reenvío. Este secreto garantiza que la información de jugadores reenviada por Velocity proceda de tu proxy y no de alguien que lo suplante. Consulta la sección «Reenvío de información de jugadores».              |
| `announce-forge`                   | Boolean | Determina si Velocity debe presentarse como un servidor compatible con Forge/FML. Esta opción está deshabilitada de forma predeterminada.                                                                                                                          |
| `kick-existing-players`            | Boolean | Permite restaurar el comportamiento de Vanilla que expulsa a los usuarios del proxy si intentan reconectarse (por ejemplo, tras perder brevemente la conexión a Internet).                                                                                          |
| `ping-passthrough`                 | String  | Permite elegir qué información reenviar: nada (valor predeterminado), `MODS` (para Forge), `DESCRIPTION` o todo (`ALL`), desde la lista `try` o según el orden de conexión de los hosts forzados. |
| `enable-player-address-logging`    | Boolean | Si se deshabilita (está habilitada de forma predeterminada), las direcciones IP de los jugadores se reemplazan por `<ip address withheld>` en los registros.                                                                                                       |

## Sección `servers`

| Nombre del ajuste | Tipo | Descripción                                                                                                                |
|---------------|---------|----------------------------------------------------------------------------------------------------------------------------|
| Nombre de servidor | Address | Informa al proxy de un servidor al que puede conectarse. |
| `try`             | Array   | Especifica a qué servidores debe intentar conectarse Velocity cuando un jugador inicia sesión o es expulsado de un servidor. |

## Sección `forced-hosts`

| Nombre del ajuste | Tipo | Descripción                                                                                                                                       |
|--------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Nombre de host | Hostname | Configura un host forzado para el nombre indicado. El valor es una lista de servidores que Velocity probará para ese nombre. |

## Sección `advanced`

| Nombre del ajuste                          | Tipo    | Descripción                                                                                                                                                                                             |
|--------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compression-threshold`                    | Integer | Tamaño mínimo (en bytes) que debe tener un paquete para que el proxy lo comprima. Minecraft usa 256 bytes de forma predeterminada.                                                                      |
| `compression-level`                        | Integer | Indica qué nivel de compresión `zlib` debe usar el proxy para comprimir paquetes. El valor predeterminado usa el nivel predeterminado de zlib.                                                          |
| `login-ratelimit`                          | Integer | Tiempo mínimo (en milisegundos) entre conexiones aceptadas desde una misma dirección IP. El valor `0` desactiva el límite. |
| `connection-timeout`                       | Integer | Tiempo que esperará el proxy para conectarse a un servidor antes de agotar el plazo. |
| `read-timeout`                             | Integer | Tiempo que esperará el proxy para recibir datos del servidor antes de agotar el plazo. |
| `haproxy-protocol`                         | Boolean | Indica si Velocity debe recibir mensajes PROXY de HAProxy. Si no usas HAProxy, deja esta opción desactivada. |
| `tcp-fast-open`                            | Boolean | Habilita TCP Fast Open en Velocity. Para que se aplique, el proxy debe ejecutarse en un kernel de Linux >=4.14. |
| `bungee-plugin-message-channel`            | Boolean | Habilita o deshabilita la compatibilidad con el canal de mensajería de plugins de BungeeCord. |
| `show-ping-requests`                       | Boolean | Registra las solicitudes ping que envían los clientes al proxy. |
| `announce-proxy-commands`                  | Boolean | Habilita o deshabilita el envío explícito de comandos del proxy al cliente para el autocompletado en Minecraft 1.13 o posterior. |
| `failover-on-unexpected-server-disconnect` | Boolean | Indica si el proxy debe cambiar a otro servidor o desconectar al usuario cuando se produce una desconexión inesperada. |
| `log-command-executions`                   | Boolean | Indica si el proxy debe registrar todos los comandos que ejecuta el usuario. |
| `log-player-connections`                   | Boolean | Registra las conexiones al proxy, los cambios de servidor y las desconexiones. |
| `accepts-transfers`                        | Boolean | Indica si el proxy acepta transferencias entrantes de otros servidores. Si desactivas esta opción, el proxy desconectará a los clientes transferidos. |
| `enable-reuse-port`                        | Boolean | Habilita la compatibilidad con SO_REUSEPORT. En sistemas multinúcleo con muchas conexiones entrantes, puede mejorar la escalabilidad del proxy y aprovechar mejor la CPU que la estrategia actual, que acepta conexiones con un solo hilo y las distribuye a los hilos de trabajo. Requiere Linux o macOS. |
| `command-rate-limit`                       | Integer | Tiempo (en milisegundos) que deben esperar los clientes para enviar un comando después del anterior. El valor predeterminado es 50 ms (20 comandos por segundo). |
| `forward-commands-if-rate-limited`         | Boolean | Indica si se deben reenviar los comandos al backend al alcanzar el límite. El comando se enviará al servidor en vez de procesarse en el proxy. Como la mayoría de las implementaciones de servidor tienen un límite, esto impedirá que el jugador envíe demasiados comandos al servidor. |
| `kick-after-rate-limited-commands`         | Integer | Cantidad de comandos que se pueden enviar tras alcanzar el límite antes de expulsar al jugador. Si se establece en 0 o menos, se deshabilita esta función. |
| `tab-complete-rate-limit`                  | Integer | Tiempo (en milisegundos) que deben esperar los clientes para solicitar el autocompletado después de la solicitud anterior. |
| `kick-after-rate-limited-tab-completes`    | Integer | Cantidad de solicitudes de autocompletado que se pueden enviar tras alcanzar el límite antes de expulsar al jugador. Si se establece en 0 o menos, se deshabilita esta función. |

## Sección `query`

| Nombre del ajuste | Tipo | Descripción                                                                                                  |
|----------------|---------|--------------------------------------------------------------------------------------------------------------|
| `enabled`      | Boolean | Indica si Velocity debe responder a las solicitudes del protocolo de consulta de Minecraft. Normalmente puedes dejarlo en `false`. |
| `port`         | Number  | Especifica el puerto en el que Velocity escuchará las solicitudes de GameSpy 4 (protocolo de consulta de Minecraft). |
| `map`          | String  | Especifica el nombre del mapa que se mostrará a los clientes. |
| `show-plugins` | Boolean | Indica si las respuestas a consultas incluyen los plugins de Velocity. |
