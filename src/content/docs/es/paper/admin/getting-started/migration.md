---
title: Migrar a Paper o desde Paper
description: Migrar tu servidor a Paper o desde Paper es sencillo. Esta página te ayudará a empezar.
slug: es/paper/migration
---

Migrar tu servidor a Paper o desde Paper es sencillo. Los pasos siguientes te ayudarán a empezar.

:::caution[¡Haz una copia de seguridad de tus datos antes de empezar!]

Antes de empezar, asegúrate de tener una copia de seguridad completa del servidor.

Consulta nuestra [guía de copias de seguridad](/es/paper/updating#paso-1-crear-una-copia-de-seguridad) para obtener más información.

:::

## Migrar a Paper

### Desde Vanilla

Al migrar de Vanilla a Paper, cambiará automáticamente la forma en que se almacenan los mundos.
Si alguna vez quieres volver a Vanilla, sigue atentamente la [guía de migración a Vanilla](#a-vanilla),
ya que tendrás que realizar algunos cambios manualmente.

1. Si el servidor Vanilla está en ejecución, detenlo y crea una copia de seguridad completa.
2. Descarga Paper desde [nuestra página de descargas](https://papermc.io/downloads) y sustituye el JAR
   del servidor Vanilla por el JAR de Paper que acabas de descargar.
3. Cambia el nombre del archivo descargado para que coincida con el indicado en
   el [comando de inicio](/es/paper/getting-started#ejecutar-el-servidor).
4. Inicia el nuevo servidor Paper.

Ya has migrado a Paper correctamente. Si tienes algún problema, no dudes en pedir ayuda
en [nuestro servidor de Discord](https://discord.gg/papermc), en el canal `#paper-help`.

### Desde Fabric/Forge

Como Fabric y Forge usan la estructura de directorios de mundos de Vanilla, puedes seguir los mismos pasos que en la
[guía de migración desde Vanilla](#desde-vanilla), con una salvedad. Si el servidor Fabric o Forge
usaba mods que añadían bloques, artículos u otros datos al juego, Paper no podrá
cargar esas funciones.

Además, ten en cuenta que Paper no admite mods de Fabric ni de Forge. Tendrás que buscar plugins
que los sustituyan. Las plataformas híbridas que intentan admitir tanto mods como plugins tienen defectos fundamentales y
no se recomienda usarlas.

### Desde Spigot/CraftBukkit

Spigot y CraftBukkit modifican la estructura de directorios de mundos de Vanilla, por lo que, a partir de `26.1`,
la migración directa es fundamentalmente imposible. Si aun así quieres migrar desde Spigot/CraftBukkit,
primero tendrás que **migrar de Spigot/CraftBukkit a Vanilla** y, después, podrás seguir sin problemas
la [guía de migración desde Vanilla](#desde-vanilla). Para obtener instrucciones, consulta la documentación de Spigot.

## Migrar desde Paper

### A Vanilla

Como Paper comparte una estructura de mundos similar a la de Vanilla, solo tendrás que mover algunos archivos.
La siguiente lista indica qué archivos debes mover y a dónde. **Antes de moverlos,
asegúrate de que el servidor esté completamente detenido**.

:::note

Estos pasos presuponen que `level-name` (definido en `server.properties`) tiene el valor `world`. Si no es así,
sustituye `world` por el valor de `level-name` en todos los pasos siguientes.

:::

Los siguientes archivos deben moverse **desde** `world/dimensions/minecraft/overworld/data/minecraft/`
**a** `world/data/minecraft/`:

- `game_rules.dat`
- `scheduled_events.dat`
- `wandering_trader.dat`
- `weather.dat`
- `world_gen_settings.dat`

Cuando hayas movido estos archivos, podrás sustituir el JAR del servidor Paper por un JAR del servidor Vanilla
y poner en marcha el servidor Vanilla.

### A Fabric/Forge

Como Fabric y Forge usan la misma estructura de directorios de almacenamiento de mundos que Vanilla, sigue
la [guía de migración a Vanilla](#a-vanilla). Ten en cuenta que ni Fabric ni Forge admiten plugins de Paper.
Tendrás que buscar mods que los sustituyan.

## Otras migraciones

:::caution

Las guías siguientes contienen información obsoleta que ya no es pertinente para los servidores Paper actuales. Se
conservan por motivos históricos y para quienes aún usan versiones antiguas. Ten en cuenta que
**no recibirás asistencia si usas versiones obsoletas**.

:::

### A Vanilla (anterior a 26.1)

Como Paper almacena los mundos de manera ligeramente distinta a Vanilla, la migración requiere algunos pasos manuales.
Si no los sigues, parecerá que el Nether y el End se han reiniciado. ¡No te preocupes!
Aunque esto ocurra, no habrás perdido datos: el servidor Vanilla simplemente no sabe dónde
encontrarlos.

La tabla siguiente muestra la diferencia entre la forma en que Vanilla y Paper almacenan los mundos.

| Software del servidor | Mundo superior | Nether                | End                   |
|-----------------|-----------|-----------------------|-----------------------|
| Vanilla         | `/world`  | `/world/DIM-1`        | `/world/DIM1`         |
| Paper           | `/world`  | `/world_nether/DIM-1` | `/world_the_end/DIM1` |

Sigue estos pasos para migrar de Paper a Vanilla:

:::note

Estos pasos presuponen que `level-name` (definido en `server.properties`) tiene el valor `world`. Si no es así,
sustituye `world` por el valor de `level-name` en todos los pasos siguientes.

:::

1. Detén el servidor Paper si está en ejecución.
2. Si ya iniciaste el servidor con Vanilla, abre la carpeta `world` y elimina las carpetas `DIM-1` y `DIM1`.
   Este paso solo es necesario si ya iniciaste el servidor con Vanilla.
3. Copia la carpeta `/world_nether/DIM-1` dentro de la carpeta `/world`.
4. Copia la carpeta `/world_the_end/DIM1` dentro de la carpeta `/world`.
5. Elimina las carpetas `/world_nether` y `/world_the_end`.
6. Sustituye el JAR de Paper por un JAR del servidor Vanilla.
7. Inicia el servidor Vanilla.

### A CraftBukkit o Spigot

Paper **no admite** la migración a CraftBukkit ni a Spigot.
Aunque puede que consigas hacerlo, **no** solicites asistencia
si tienes problemas y ten en cuenta que podrías perder datos.
