---
title: Primeros pasos
description: Cómo instalar y configurar Velocity de forma básica.
slug: es/velocity/getting-started
---

Esta página explica cómo instalar Velocity y configurar los ajustes mínimos.

## Instalar Java

Velocity está escrito en Java, así que, si aún no lo tienes instalado, tendrás que instalarlo
antes de continuar. Velocity requiere Java 25 como mínimo.
Consulta nuestra [guía de instalación de Java](/es/misc/java-install) para ver instrucciones detalladas.

## Descargar Velocity

Visita la página de [descargas](https://papermc.io/downloads/velocity) para obtener la última versión
de Velocity. Recomendamos descargar la última versión estable. Después de descargar Velocity, mueve el
archivo JAR a una carpeta exclusiva para el proxy o súbelo a tu servidor.

## Iniciar Velocity por primera vez

Una vez descargado Velocity, lo iniciaremos por primera vez para generar el archivo de
configuración `velocity.toml`. Cuando termines de configurarlo, podrás usar el script de inicio creado para ejecutar Velocity.

### Iniciar Velocity en Windows

Crea un archivo `start.bat` con el siguiente contenido en el mismo directorio donde guardarás los
archivos del proxy.

```batch title="start.bat"
@echo off
java -Xms1G -Xmx1G -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15 -jar velocity.jar
pause
```

:::tip

Asegúrate de cambiar `velocity.jar` por el nombre del JAR de Velocity que descargaste, o
cambia el nombre del JAR de Velocity a `velocity.jar`.

:::

Una vez guardado, haz doble clic en el archivo `start.bat`. Si todo funciona, verás una consola
similar a la salida de la siguiente sección.

### Iniciar Velocity en macOS o Linux

Crea un archivo `start.sh` con el siguiente contenido en el mismo directorio donde guardarás los
archivos del proxy. Puedes hacerlo con un cliente de transferencia de archivos o con un editor de texto en el
equipo anfitrión.

```bash title="start.sh"
#!/bin/sh

java -Xms1G -Xmx1G -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15 -jar velocity*.jar
```

Después de guardar los archivos, abre una terminal (o inicia sesión en la máquina, si aún no lo has hecho). Ve al directorio
donde colocaste el archivo JAR de Velocity y el archivo `start.sh`. Después, debes preparar el script `start.sh`
para que se pueda ejecutar y ponerlo en marcha.

1. Ejecuta `chmod u+x start.sh`. Este comando modifica los permisos del archivo y permite que su propietario (tú) pueda
   ejecutar (`x`) el script. Sin este paso, es posible que el sistema no reconozca el script como ejecutable.
1. Ahora que el archivo es ejecutable, ejecuta `./start.sh`.

## Después del inicio

Este es un ejemplo de lo que verás una vez que se inicie el proxy:

```log replace
[05:41:13 INFO]: Booting up Velocity \{LATEST_VELOCITY_RELEASE} (git-74c932e5-b363)...
[05:41:13 INFO]: Loading localizations...
[05:41:13 INFO]: Connections will use epoll channels, libdeflate (Linux aarch64) compression, OpenSSL (Linux aarch64) ciphers
[05:41:13 INFO]: Loading plugins...
[05:41:13 INFO]: Loaded 0 plugins
[05:41:13 INFO]: Listening on /[0:0:0:0:0:0:0:0%0]:25565
[05:41:13 INFO]: Done (0.36s)!
```

Velocity se ha iniciado y ya puedes completar la configuración del proxy. Escribe
`end` en la consola y pulsa Intro para apagarlo:

```log
> end
[05:42:10 INFO]: Shutting down the proxy...
[05:42:10 INFO]: Closing endpoint /0.0.0.0:25565
```

Si usaste el script por lotes de Windows anterior, la ventana te pedirá que pulses una tecla. Puedes
pulsar una tecla o cerrar la ventana de comandos.

### Configurar tus servidores

Ahora debemos configurar cada servidor para que acepte conexiones del proxy.

Velocity es un proxy muy configurable. Aunque la mayoría de los usuarios no necesitará cambiar todos los
ajustes, hay muchas opciones documentadas
[en la página de referencia de configuración](/es/velocity/configuration), junto con una explicación de
su funcionamiento. Sin embargo, en esta sección solo haremos los cambios mínimos para iniciar el proxy.

Abre el archivo `velocity.toml` en un editor de texto y busca la sección `[servers]`. Esta sección
especifica los servidores a los que Velocity puede conectarse. Inicialmente, la sección `[servers]` tendrá
un aspecto similar a este:

```toml title="velocity.toml"
[servers]
# Configura aquí tus servidores. Cada clave representa el nombre de un servidor y su valor,
# la dirección IP del servidor al que se conectará Velocity.
lobby = "127.0.0.1:30066"
factions = "127.0.0.1:30067"
minigames = "127.0.0.1:30068"

# Orden en que se intentará conectar con los servidores cuando alguien inicie sesión
# o sea expulsado de un servidor.
try = [
  "lobby",
  "factions"
]
```

A la izquierda, especifica el nombre del servidor (por ejemplo, `lobby`); a la derecha, una
cadena con la dirección IP y el puerto del servidor. Ahora debes añadir tus servidores a
la lista. Puedes modificarla según sea necesario.

La opción `try` es especial. Es una lista de servidores a los que Velocity intentará conectar al jugador
cuando inicie sesión en el proxy por primera vez o lo expulsen de un servidor. Si cambiaste el
nombre del servidor `lobby`, reemplaza `lobby` en esta lista por el nombre que elegiste para
el primer servidor al que debería conectarse el jugador.

:::caution

La siguiente configuración es genérica y pretende servir para cualquier servidor de Minecraft. No solo
es poco práctica (los jugadores no tendrán skins ni UUID adecuados, y todas las conexiones parecerán
proceder del proxy), sino que también es **peligrosamente insegura**. Después de poner los servidores en modo offline,
**debes** seguir las secciones «Reenvío de información de jugadores» y «Proteger tus servidores» para completar
la configuración.

:::

Abre el archivo `server.properties` de cada servidor y establece la opción `online-mode` en
`false`. Esto permite que Velocity se conecte al servidor. Cuando termines, reinícialo.
Velocity ya está listo para usarse, pero casi con total seguridad querrás
[proteger tus servidores](/es/velocity/security) y
[configurar el reenvío de información de jugadores](/es/velocity/player-information-forwarding).
