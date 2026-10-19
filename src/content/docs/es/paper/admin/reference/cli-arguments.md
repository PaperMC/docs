---
title: Argumentos de CLI
slug: es/paper/reference/cli-arguments
description: Referencia de todos los argumentos de CLI que reconoce Paper.
version: 1.21.11
tableOfContents: false
---

Paper ofrece argumentos de CLI que puedes configurar para controlar ciertos comportamientos. Al iniciar el servidor, los argumentos de CLI siempre se añaden directamente
**después** del nombre del archivo del servidor. Por ejemplo:
```bash
java -jar server.jar --nogui
```

`--nogui` es un argumento de CLI (más específicamente, como no tiene un valor, es un **indicador**).
Esta página sirve como referencia de todos los argumentos que ofrece Paper.

Algunas de estas opciones corresponden directamente a ajustes que puedes modificar en el archivo `server.properties`.
Los argumentos de CLI siempre **anulan** los valores definidos en `server.properties`.

##### `-?, --help`
Imprime un mensaje de ayuda con todos los argumentos de CLI que puedes proporcionar. El servidor no se iniciará si usas este indicador.

##### `-C, --commands-settings <commands yml file>`
Ruta al archivo de ajustes de comandos. El valor predeterminado es `commands.yml`.

##### `-P, --plugins <plugin directory>`
Directorio en el que se buscan los JAR de plugins. El valor predeterminado es `plugins`.

##### `-S, --spigot-settings <yml file>`
Ruta al archivo de configuración de Spigot. El valor predeterminado es `spigot.yml`.

##### `-W, --universe, --world-container, --world-dir <world directory>`
Carpeta en la que se colocan las demás carpetas de mundos. El valor predeterminado es `.` (esta carpeta).

##### `--add-extra-plugin-dir, --add-plugin-dir <directory>`
Directorio adicional en el que buscar archivos de plugins. Se puede especificar varias veces para añadir más de un
directorio de plugins.

##### `--add-extra-plugin-jar, --add-plugin <jar file>`
Archivo JAR de plugin adicional que se cargará. Se puede especificar varias veces para cargar varios JAR de plugins.

##### `-b, --bukkit-settings <yml file>`
Ruta al archivo de configuración de Bukkit. El valor predeterminado es `bukkit.yml`.

##### `-c, --config <properties file>`
Ruta al archivo de propiedades del servidor Minecraft. El valor predeterminado es `server.properties`.

##### `--demo`
Indica si se debe cargar el servidor en modo de demostración. En este modo siempre se genera el mismo mundo y se muestran recordatorios y mensajes de ayuda adicionales.

##### `--bonusChest`
Indica si se debe crear un cofre de bonificación al crear el mundo por primera vez.

##### `--eraseCache`
Indica si se debe forzar el borrado de la caché durante las actualizaciones del mundo. Esto elimina datos como los mapas de altura y de iluminación,
lo que puede resultar útil si quieres forzar su recálculo.

##### `--forceUpgrade`
Indica si se debe forzar una actualización completa del mundo al iniciar el servidor.

:::danger[Advertencia]

Este ajuste casi nunca debería usarse. El sistema de actualización de Paper es lo bastante rápido como para realizar
las actualizaciones gradualmente mientras juegas.

:::

##### `-h, --host, --server-ip <hostname or ip>`
Host en el que se escuchará.

##### `--initSettings`
Indica si se deben crear únicamente los archivos de configuración y cerrar el servidor antes de crear mundos. Es útil
si primero quieres establecer algunos valores de configuración que podrían influir en la creación del mundo.

##### `--jfrProfile`
Indica si se debe habilitar el perfilado de JFR (Java Flight Recorder).

##### `--noconsole`
Desactiva la consola.

##### `--nogui`
Desactiva la interfaz gráfica.

##### `--nojline`
Desactiva JLine y emula la consola de Vanilla.

##### `-o, --online-mode <true|false>`
Indica si se debe usar la autenticación en línea.

##### `-p, --port, --server-port <port>`
Puerto en el que se escuchará.

##### `--paper, --paper-settings <yml file>`
Ruta al archivo de ajustes heredado de Paper. El valor predeterminado es `paper.yml`.

:::danger[Advertencia]

Esta opción solo se usa para migrar el archivo de configuración heredado al nuevo formato
y no debe usarse en servidores nuevos.

:::

##### `--paper-dir, --paper-settings-directory <config directory>`
Ruta al directorio de ajustes de Paper. El valor predeterminado es `config`.

##### `--pidFile <path>`
Ruta al archivo PID.

##### `--recreateRegionFiles`
Indica si se deben recrear los archivos de región durante las actualizaciones del mundo.

##### `-s, --max-players, --size <value>`
Número máximo de jugadores.

##### `--safeMode`
Carga los mundos únicamente con el paquete de datos de Vanilla habilitado.

##### `--server-name <name>`
Nombre del servidor. El valor predeterminado es `Unknown Server`.

##### `--serverId <id>`
Establece el identificador del servidor, que se usa en los archivos de fallo.

##### `-v, --version`
Imprime la versión de CraftBukkit. Esta opción impide que se inicie el servidor.

##### `-w, --level-name, --world <name>`
Establece el nombre del mundo.
