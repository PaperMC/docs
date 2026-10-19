---
title: Depuración de tu plugin
description: La depuración es una práctica habitual al escribir código. Esta guía presenta las formas más comunes de depurar tu plugin.
slug: es/paper/dev/debugging
---

Depurar tu plugin es fundamental para poder corregir errores y problemas. En esta página se explican algunas de las técnicas de depuración más comunes.

## Imprimir en la consola

Una de las técnicas de depuración más habituales es imprimir mensajes en la consola. Probablemente ya lo hayas hecho, ya que es muy sencillo.
Sin embargo, tiene algunos inconvenientes: puede ser difícil encontrar los mensajes en la consola y eliminarlos todos al terminar la depuración.
En particular, para añadir o quitar mensajes de depuración hay que volver a compilar el plugin y reiniciar el servidor.

Durante la depuración, puedes usar `System.out.println("");` para imprimir en la consola. Sin embargo, se recomienda usar el logger de tu plugin,
ya que así será más fácil saber de qué plugin procede el mensaje. Puedes hacerlo así:

```java
plugin.getSLF4JLogger().debug("SuperDuperBad Thing has happened");
```

:::note[Niveles del logger]

En algunas consolas, los niveles `warn` o `error` imprimen el mensaje con colores diferentes.
Esto puede facilitar la búsqueda de tus mensajes en la consola.

:::

## Usar un depurador remoto

Un depurador es una herramienta que permite pausar el código en un punto determinado e inspeccionar los valores de las variables.
Puede ser muy útil para averiguar por qué el código no funciona como se espera y dónde se produce el problema.

### Configurar el depurador

Para usar un depurador, debes configurarlo en tu IDE. El proceso varía según el IDE; para esta guía usaremos IntelliJ IDEA.

Para configurar un depurador en IntelliJ, crea una nueva configuración de ejecución.
Haz clic en el menú desplegable junto al botón de ejecución y selecciona `Edit Configurations...`:

![](/paper/dev/misc/assets/config_dropdown.png)

Después, haz clic en el botón `+` de la esquina superior izquierda y selecciona `Remote JVM Debug`. Puedes asignarle el nombre que quieras y hacer clic en `Apply`:

![](/paper/dev/misc/assets/config_add.png)

Por último, copia los argumentos de la línea de comandos de la ventana y pégalos en el script de inicio del servidor.
Van después del comando `java` y antes de `-jar`. Cuando termines, haz clic en `OK`. Por ejemplo:

```shell replace
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar paper-\{LATEST_PAPER_RELEASE}.jar --nogui
```

Cuando el servidor esté en ejecución, puedes usar el icono del insecto de la esquina superior derecha para conectar el depurador al servidor:

![](/paper/dev/misc/assets/debugger_connect.png)

#### Usar el depurador

Supongamos que tenemos este código:

```java
@EventHandler
public void onPlayerMove(PlayerMoveEvent event) {
    Player player = event.getPlayer();
    Location location = player.getLocation();

    if (location.getWorld() == null)
        return;

    if (location.getWorld().getEnvironment() == World.Environment.NETHER) {
        player.sendPlainMessage("You are in the nether!");
    }
}
```

Puedes añadir un punto de interrupción haciendo clic en el número de línea:

![](/paper/dev/misc/assets/add_breakpoints.png)

El código se pausará al llegar a esa línea. Entonces puedes usar el depurador para inspeccionar los valores de las variables:

![](/paper/dev/misc/assets/debugger_use.png)

Puedes inspeccionar los valores de cada variable del ámbito actual.
También puedes usar los botones de la parte superior para avanzar de un punto de interrupción al siguiente.
Si lo necesitas, también puedes usar el cuadro de texto de la parte superior para evaluar expresiones con fines de depuración.

### Depuración directa

La depuración directa permite ejecutar el servidor desde el IDE y usar puntos de interrupción para avanzar por el código.
Podemos hacerlo con el [plugin de Gradle de JPenilla](https://github.com/jpenilla/run-task), que permite ejecutar el servidor directamente desde el IDE.
Consulta [aquí](https://github.com/jpenilla/run-task#basic-usage) las instrucciones para configurar el plugin.

### Evitar tiempos de espera mientras el servidor está pausado

Mientras el servidor está pausado en un punto de interrupción, no procesa ticks. Si permanece pausado durante un tiempo, dos tiempos de espera pueden interrumpir la sesión de depuración.

#### El watchdog

El watchdog no puede distinguir un servidor pausado de uno bloqueado. Con la configuración predeterminada, empieza a imprimir volcados de hilos
tras 10 segundos sin procesar un tick y detiene el servidor después de 60 segundos.

Para evitarlo, inicia el servidor con la propiedad del sistema [`disable.watchdog`](/es/paper/reference/system-properties#disablewatchdog):

```shell replace
java -Ddisable.watchdog=true -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar paper-\{LATEST_PAPER_RELEASE}.jar --nogui
```

Si ejecutas el servidor con el plugin de Gradle, añade la opción a la tarea `runServer`:

```kotlin title="build.gradle.kts"
tasks {
    runServer {
        jvmArgs("-Ddisable.watchdog=true")
    }
}
```

:::caution

Desactiva el watchdog únicamente en un servidor de desarrollo. En un servidor de producción, es lo que detecta y notifica un bloqueo real.

:::

#### Tiempos de espera del cliente

El cliente Vanilla se desconecta tras 30 segundos sin recibir nada del servidor, por lo que te expulsará mientras el servidor está pausado.
Este tiempo de espera forma parte del cliente y no se puede cambiar desde el servidor. Si necesitas mantener la conexión,
instala un mod de cliente que lo amplíe, como [untimeout](https://modrinth.com/mod/untimeout).
