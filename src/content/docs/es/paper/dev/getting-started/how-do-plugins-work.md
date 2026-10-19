---
title: Cómo funcionan los plugins
description: Cómo funcionan los plugins en Paper.
slug: es/paper/dev/how-do-plugins-work
---

Los plugins permiten ampliar la funcionalidad de un servidor de Minecraft. Se escriben en lenguajes basados en JVM, como
Java, Kotlin, Groovy o Scala. Los plugins se cargan desde la carpeta `plugins` del directorio del servidor. Se cargan
desde un archivo `.jar`. Cada plugin tiene una clase principal especificada en el archivo `plugin.yml` del plugin. Esta
clase debe extender `JavaPlugin`; es el punto de entrada del plugin y donde se definen sus métodos del ciclo de vida.

:::caution

No recomendamos escribir código en el constructor de la clase principal, ya que no hay garantías sobre qué
API está disponible en ese momento. En su lugar, usa el método `onLoad` para inicializar tu plugin. Además,
no llames directamente al constructor de tu plugin, ya que esto causará problemas.

:::

## Ciclo de vida del plugin

Los plugins se cargan y descargan durante la ejecución. Cuando se carga un plugin, se inicializa y se habilita. Cuando
se descarga, se deshabilita y finaliza.

### Inicialización

Cuando se carga un plugin, se inicializa. Esto significa que se carga en la memoria y se llama a su método `onLoad`.
Este método sirve para inicializar el plugin y configurar los recursos que necesita. En este punto, la mayor parte de
la API de Bukkit no está disponible, así que no es seguro interactuar con ella.

### Habilitación

Cuando se habilita un plugin, se llama a su método `onEnable`. Este método sirve para configurar los recursos que el plugin
necesita para ejecutarse. Se llama después de inicializar el plugin, pero antes de que el servidor empiece a procesar ticks;
por tanto, es seguro registrar listeners de eventos y otros recursos necesarios, aunque a menudo no es seguro interactuar
con muchas API.

En este momento también puedes abrir conexiones a bases de datos, iniciar hilos y realizar otras tareas que no son seguras
en el método `onLoad`.

### Deshabilitación

Cuando se deshabilita un plugin, se llama a su método `onDisable`. Este método sirve para limpiar los recursos que haya
asignado el plugin. Se llama antes de que se descarguen todos los plugins y está pensado para realizar cualquier limpieza
necesaria antes de descargar el plugin. Esto puede incluir guardar datos en disco o cerrar conexiones a bases de datos.

## Listeners de eventos

Los eventos permiten que los plugins escuchen lo que ocurre en el servidor y ejecuten código cuando se producen. Por
ejemplo, [](jd:paper:org.bukkit.event.player.PlayerJoinEvent) se produce cuando un jugador
se une al servidor. Esta es una forma más eficiente de ejecutar código cuando ocurre algo que comprobarlo constantemente.
Consulta nuestra [página sobre listeners de eventos](/es/paper/dev/event-listeners) para obtener más información.

Algunos eventos se pueden cancelar. Esto significa que, cuando se produce el evento, se puede cancelar para anular o detener
su efecto. Por ejemplo, [](jd:paper:org.bukkit.event.player.PlayerMoveEvent)
se puede cancelar. Si se cancela, el jugador no se moverá. Esto es útil para casos como los sistemas antitrampas,
en los que se quiere cancelar el evento si el jugador se mueve demasiado rápido.

Al escribir listeners, es importante tener en cuenta la frecuencia con la que se produce un evento. Un evento «frecuente»
se produce muy a menudo. Por ejemplo, `PlayerMoveEvent` se produce cada vez que un jugador se mueve. Esto significa que,
si el listener contiene mucho código costoso, se ejecutará cada vez que se mueva un jugador y puede causar mucho lag.
Es importante que los listeners de eventos sean lo más ligeros posible. Una opción es comprobar rápidamente si hay que
gestionar el evento y, si no, salir. Por ejemplo, si solo quieres gestionar el evento cuando el jugador se mueve de un
bloque a otro, puedes comprobar si su ubicación cambió de bloque. Si no cambió, puedes salir del listener.

## Comandos

Los comandos permiten que los jugadores, la consola, RCON y los bloques de comandos ejecuten código en el servidor.
Los plugins registran comandos que pueden ejecutar los emisores de comandos. Por ejemplo, el comando `/help` lo registra
el servidor y los jugadores pueden ejecutarlo. Los jugadores pueden ejecutar comandos escribiéndolos en el chat o desde
un bloque de comandos.

Los comandos pueden tener argumentos. Por ejemplo, el comando `/give` acepta un argumento para el jugador que recibirá
el objeto y otro para indicar qué objeto dar. Los argumentos se separan con espacios. Por ejemplo, el comando
`/give Notch diamond` le dará un diamante al jugador llamado Notch. En este caso, los argumentos son
`["Notch", "diamond"]`.

### Permisos

Los permisos permiten controlar quién puede ejecutar comandos y quién puede escuchar eventos. Los plugins registran
permisos y otros plugins pueden comprobarlos. Los permisos se pueden conceder a jugadores y grupos.
Los permisos pueden tener una jerarquía si el plugin la define en su `plugin.yml`. Por ejemplo, un
plugin puede definir `example.command.help` como subpermiso de `example.command`. Esto significa que, si un jugador
tiene el permiso `example.command`, también tendrá el permiso `example.command.help`.

:::note

Los plugins de permisos pueden permitir el uso de permisos comodín mediante el carácter `*` para conceder cualquier
permiso o subpermiso disponible. Así se admiten permisos jerárquicos aunque el propio plugin no los haya configurado.
Por ejemplo, conceder `example.command.*` mediante un plugin de permisos que admita comodines dará acceso a todos los
permisos que empiecen por `example.command.`.

**No** se recomienda usar permisos comodín, especialmente `*` (todos los permisos), ya que puede suponer un gran
riesgo de seguridad y provocar efectos secundarios no deseados para un jugador. Úsalos con precaución.

:::

## Configuración

Los plugins pueden tener archivos de configuración. Estos archivos almacenan los datos que el plugin necesita para
ejecutarse. Por ejemplo, un plugin que añade un bloque nuevo al juego podría tener un archivo de configuración que
almacene el ID del bloque. Los archivos de configuración deben guardarse en la carpeta de datos del plugin, dentro de
la carpeta `plugins`. El servidor ofrece una API de configuración YAML para leer y escribir estos archivos. Consulta
[aquí](/es/paper/dev/plugin-configurations) para obtener más información.

## Programación de tareas

Los plugins pueden programar tareas para que se ejecuten más adelante. Esto resulta útil para ejecutar código después
de que haya transcurrido cierto tiempo. Por ejemplo, un plugin podría querer ejecutar código después de 5 segundos.
Para ello, se puede programar una tarea para que se ejecute después de 100 ticks: durante el funcionamiento normal,
un segundo equivale a 20 ticks. Ten en cuenta que las tareas pueden retrasarse si el servidor tiene lag. Por ejemplo,
si el servidor solo procesa 10 ticks por segundo, una tarea programada para ejecutarse después de 100 ticks tardará
10 segundos.

En Java, normalmente podrías usar [`Thread#sleep()`](jd:java:java.lang.Thread#sleep(long)) para retrasar
la ejecución de código. Sin embargo, si el código se ejecuta en el hilo principal, el servidor se pausará durante
ese tiempo. En su lugar, usa la API `Scheduler` para programar tareas que se ejecuten más tarde.
Obtén más información sobre la API `Scheduler` [aquí](/es/paper/dev/scheduler).

## Componentes

Desde Minecraft 1.7 y la introducción de los «componentes», los plugins pueden enviar a los jugadores mensajes con
texto enriquecido. Esto significa que pueden enviar mensajes con elementos como colores, texto en negrita y enlaces
en los que se puede hacer clic. Los colores siempre fueron posibles, pero solo mediante los códigos de color antiguos.

Paper implementa una biblioteca llamada `Adventure` que facilita la creación y el envío de mensajes a los jugadores.
Obtén más información sobre la API `Adventure` [en su documentación](/es/adventure/) o
[en nuestra documentación](/es/paper/dev/component-api/introduction).
