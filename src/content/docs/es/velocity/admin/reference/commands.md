---
title: Comandos integrados
description: Lista de comandos integrados y sus explicaciones.
slug: es/velocity/built-in-commands
---

Velocity incluye algunos comandos en el núcleo del proxy de forma predeterminada. Estos comandos se eligieron
por su utilidad general para la mayoría de los usuarios.

Por supuesto, siempre puedes instalar plugins para añadir más comandos.

## `/velocity`

El comando `/velocity` contiene varios subcomandos para administrar el proxy.

### `/velocity plugins`

Si el usuario tiene el permiso `velocity.command.plugins`, puede ver todos los plugins activos
en el proxy mediante `/velocity plugins`, incluidos sus nombres, autores y versiones.

### `/velocity info`

Si el usuario tiene el permiso `velocity.command.info`, puede ver información sobre la instancia de Velocity,
como la versión que se ejecuta en el proxy.

### `/velocity reload`

Si el usuario tiene el permiso `velocity.command.reload`, el proxy volverá a leer y aplicar su configuración
desde el archivo `velocity.toml` del disco. Si hay problemas al analizar el archivo, no se aplicará
ningún cambio.

### `/velocity dump`

Si el usuario tiene el permiso `velocity.command.dump`, puede usar este comando para obtener un
volcado anonimizado de los detalles del proxy. Puede enviarlo al Discord de PaperMC para ayudarnos a prestar
asistencia.

### `/velocity heap`

:::caution

Este comando genera un volcado del heap que contiene información detallada sobre tu instancia de Velocity,
que puede ser muy sensible. Ten mucho cuidado con quién compartes el volcado generado.

:::

Si el usuario tiene el permiso `velocity.command.heap`, podrá generar un volcado del heap
de la instancia de Velocity en ejecución, lo que permitirá analizar detalladamente el consumo de memoria.

El volcado del heap generado se encontrará en la carpeta `dumps`.

## `/server`

Si el usuario tiene el permiso `velocity.command.server` (que se concede a todos de forma predeterminada),
los jugadores pueden usar este comando para ver otros servidores y cambiarse a ellos.

Al ejecutar solo `/server`, el usuario recibirá el nombre del servidor actual, junto con
opciones para cambiar a otros servidores configurados en el proxy.

Si se indica el nombre de un servidor, Velocity intentará conectarse a él.

## `/shutdown`

:::note

Este comando solo se puede ejecutar desde la consola.

:::

Al ejecutarlo, se apagará correctamente el proxy Velocity.
Se desconectará a todos los jugadores y los plugins tendrán la oportunidad de finalizar antes de que se apague el proxy.
Se puede indicar un motivo opcional, en formato JSON o mediante el [formato MiniMessage](/es/adventure/minimessage/format/).

Si el mensaje indicado empieza por `"`, `[` o `{`, se intentará analizar como JSON.
Si falla el análisis o el mensaje empieza por cualquier otro carácter, se analizará como MiniMessage.


## `/glist`

Si el usuario tiene el permiso `velocity.command.glist` (que no se concede a nadie de forma predeterminada),
los jugadores pueden usar este comando para ver cuántos jugadores hay en el proxy y usar
`/glist all` para obtener una lista de jugadores por servidor.

## `/send`

Si el usuario tiene el permiso `velocity.command.send`, puede enviar a otros jugadores (o a todos
los jugadores del proxy) a otro servidor.

## `/velocity:callback`

Velocity usa este comando internamente para que los plugins ejecuten funciones de retorno al hacer clic cuando un usuario selecciona texto.
