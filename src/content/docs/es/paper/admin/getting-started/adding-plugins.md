---
title: Añadir plugins
description: Los plugins son la forma más potente de ampliar las funciones de Paper más allá de los archivos de configuración.
slug: es/paper/adding-plugins
---

Los plugins son la forma más potente de ampliar las funciones de Paper más allá de los archivos de configuración.
Las funciones que añaden pueden ir desde hacer que la leche restaure el hambre o que crezcan los arbustos secos,
hasta incorporar modos de juego o artículos totalmente nuevos y originales.

:::danger[Plugins maliciosos]

Asegúrate de confiar plenamente en el origen de cualquier plugin antes de instalarlo. Los plugins obtienen acceso
**completo y sin restricciones** no solo a tu servidor, sino también a la máquina en la que se ejecuta. Por eso,
es imprescindible instalar plugins únicamente desde fuentes de confianza. ¡Ten cuidado!

:::

## Buscar plugins

Antes de instalar un plugin, tendrás que encontrar el que quieres. El mejor lugar para buscar
plugins es [Hangar](https://hangar.papermc.io), el repositorio de plugins de Paper, aunque también puedes encontrarlos
en [Modrinth](https://modrinth.com/discover/plugins?g=categories:paper) o
[BukkitDev](https://dev.bukkit.org/bukkit-plugins). Muchos plugins también se publican en [GitHub](https://github.com).
En vez de revisar cada sitio por separado, puedes usar un motor de búsqueda. A menudo encontrarás buenos resultados
si buscas la función que necesitas seguida de `Paper plugin`.

## Instalar plugins

1. Cuando encuentres el plugin que quieres instalar, descárgalo. Asegúrate de que el archivo
   descargado termine en `.jar`. Algunos plugins también se distribuyen como archivos `.zip`; en ese caso,
   tendrás que extraer el archivo y localizar el `.jar` correspondiente a tu plataforma, normalmente etiquetado como `bukkit` o
   `paper`.
2. Una vez descargado el plugin en tu equipo, busca la carpeta `plugins` en el directorio raíz
   de tu servidor Paper.
3. Arrastra el archivo del plugin (`.jar`) hasta la carpeta `plugins`. Si usas un servicio de alojamiento compartido,
   puede que tengas que subir el plugin mediante su panel web o SFTP; el procedimiento será el mismo.
4. Reinicia el servidor. El plugin debería cargarse.
5. Comprueba que todo haya funcionado. Cuando termine de cargarse el servidor, ejecuta el comando `/plugins` dentro del juego o escribe
   `plugins` en la consola. El plugin recién instalado debería aparecer en verde. Si no aparece o figura en rojo,
   continúa con la [solución de problemas](#solucion-de-problemas). Un plugin en rojo no está habilitado. Si acabas de instalarlo,
   normalmente significa que no se pudo cargar.

## Solución de problemas

### Revisar los registros

El primer paso para resolver problemas al instalar plugins es revisar el registro del servidor. Los
registros más recientes se guardan en el archivo `logs/latest.log`. Puede que tengas que desplazarte
cerca del principio del archivo para ver cuándo se cargaron los plugins.

#### Dependencias faltantes

Si ves algo parecido a esto:

```log
[00:00:00] [Server thread/WARN] Could not load 'plugins/MyAwesomePlugin-1.0.0.jar' in folder 'plugins'
[00:00:00] [Server thread/WARN] org.bukkit.plugin.UnknownDependencyException: Unknown/missing dependency plugins: [Vault]. Please download and install these plugins to run 'MyAwesomePlugin'.
```

Esto significa que al plugin que intentaste instalar le falta una dependencia. En este caso, una dependencia
es otro plugin que debes instalar para que funcione el primero. Aunque aparezca un error alarmante,
la línea importante es:

```log
[00:00:00] [Server thread/WARN] Unknown/missing dependency plugins: [Vault]. Please download and install these plugins to run 'MyAwesomePlugin'.
```

El mensaje indica que primero debes instalar `Vault` para poder cargar `MyAwesomePlugin`.

#### `plugin.yml` no válido

Si ves algo más parecido a esto:

```log
[00:00:00] [Server thread/WARN] Could not load 'plugins/MyAwesomePlugin-1.0.0.jar' in folder 'plugins'
[00:00:00] [Server thread/WARN] org.bukkit.plugin.InvalidDescriptionException: Invalid plugin.yml
```

Esto significa que lo que descargaste no es un plugin válido de Paper. Suele deberse a una de estas causas:

1. Lo que descargaste no es un plugin, sino un mod para Forge, Fabric o una plataforma similar.
   Estos no se ejecutan en Paper.
2. La descarga del plugin no se completó correctamente. En especial, al usar herramientas como `curl` o `wget`,
   es fácil descargar páginas de error en vez del plugin esperado. También puede deberse a un problema de red.
   Intenta descargar el plugin otra vez. Si usas FTP (no SFTP ni un panel web) para subir el plugin a un servicio de alojamiento compartido,
   asegúrate de que el cliente FTP esté en modo `binary` y no en modo `ASCII`. Consulta la documentación del cliente FTP para obtener más detalles.

#### Nombre de plugin ambiguo

Si ves algo parecido a esto:

```log
[00:00:00] [Server thread/WARN] Ambiguous plugin name `Essentials' for files `plugins/EssentialsX-2.19.4.jar' and `plugins/Essentialsx-2.20.0-dev.jar' in `plugins'
```

Esto significa que tienes dos plugins con el mismo nombre, algo que no se admite. En este caso, hay instaladas dos
versiones de EssentialsX: la versión estable `2.19.4` y una compilación de desarrollo de
`2.20.0`. Asegúrate de tener instalada solo una versión de cada plugin a la vez. Elimina
la versión más antigua del plugin duplicado y reinicia el servidor.

Para evitar instalar accidentalmente dos versiones del mismo plugin durante una actualización, puedes usar
la carpeta `update`, tal como se explica en la [guía de actualización](/es/paper/updating#paso-2-actualizar-plugins).

#### Otro problema

Si ves un error distinto de los anteriores, intenta leerlo. Aunque el mensaje completo pueda ser extenso e intimidante,
probablemente baste con leer las primeras una o dos líneas para entender qué ocurre. Si tienes dudas, no dudes en pedir ayuda
en nuestro [Discord](https://discord.gg/papermc), en el canal `#paper-help`.

### Si no se registra nada

Si no se registra nada, es probable que el servidor ni siquiera esté intentando cargar plugins. Para que el servidor cargue un plugin, deben cumplirse estas condiciones:

1. El archivo está en la raíz de la carpeta `plugins`, relativa al directorio de trabajo. Normalmente es
   la misma carpeta que contiene el archivo JAR del servidor. **No se revisarán las subcarpetas de `plugins`.**
   Todos los plugins deben estar en la carpeta raíz.
2. El archivo termina en `.jar`. Si el archivo del plugin no termina en `.jar`, puede que lo que descargaste
   no sea un plugin. Ten en cuenta que algunos plugins distribuyen varios JAR dentro de archivos `.zip`. En ese
   caso, debes extraerlos antes de instalar el plugin.

Si se cumplen ambas condiciones y aun así no aparece ningún registro, pide ayuda en nuestro servidor de
[Discord](https://discord.gg/papermc), en el canal `#paper-help`. Estaremos encantados de ayudarte.
