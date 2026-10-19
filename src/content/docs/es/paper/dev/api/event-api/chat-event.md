---
title: Eventos de chat
description: Un resumen sobre AsyncChatEvent y cómo manejarlo.
slug: es/paper/dev/chat-events
---
El evento de chat ha cambiado varias veces. Aquí se explica cómo usar [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) y [](jd:paper:io.papermc.paper.chat.ChatRenderer). `AsyncChatEvent` reemplaza al antiguo [](jd:paper:org.bukkit.event.player.AsyncPlayerChatEvent) y permite renderizar el mensaje de forma distinta para cada jugador.
:::note[`AsyncChatEvent` frente a `ChatEvent`]
La diferencia clave entre [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) y [](jd:paper:io.papermc.paper.event.player.ChatEvent) es que [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) se activa de forma asincrónica.

El evento asíncrono no bloquea el hilo principal; el mensaje se envía cuando termina el listener. No es seguro usar la API de Bukkit desde un contexto asíncrono y hacerlo puede provocar excepciones. Si necesitas usarla, utiliza [](jd:paper:io.papermc.paper.event.player.ChatEvent) o [`BukkitScheduler`](/es/paper/dev/scheduler).
:::
## Entendiendo el renderizador

El renderizador permite que Paper modifique el mensaje antes de enviarlo a cada jugador. Para ello, implementa la interfaz [](jd:paper:io.papermc.paper.chat.ChatRenderer) y su método [](jd:paper:io.papermc.paper.chat.ChatRenderer#render(org.bukkit.entity.Player,net.kyori.adventure.text.Component,net.kyori.adventure.text.Component,net.kyori.adventure.audience.Audience)). Antes, el formato se configuraba mediante [](jd:paper:org.bukkit.event.player.AsyncPlayerChatEvent#setFormat(java.lang.String)).
```java title="ChatRenderer.java"
Component render(Player source, Component sourceDisplayName, Component message, Audience viewer);
```
- El método [`render`](jd:paper:io.papermc.paper.chat.ChatRenderer#render(org.bukkit.entity.Player,net.kyori.adventure.text.Component,net.kyori.adventure.text.Component,net.kyori.adventure.audience.Audience)) se llama cuando se envía un mensaje de chat al jugador.
- El parámetro `source` es el jugador que envió el mensaje.
- El parámetro `sourceDisplayName` es el nombre para mostrar del jugador que envió el mensaje.
- El parámetro `message` es el mensaje que se envió.
- El parámetro `viewer` es el jugador que está recibiendo el mensaje.
:::tip[`ChatRenderer.ViewerUnaware`]
Si su renderizador no necesita saber acerca del visor, puede usar la interfaz [](jd:paper:io.papermc.paper.chat.ChatRenderer$ViewerUnaware) en lugar de la interfaz [](jd:paper:io.papermc.paper.chat.ChatRenderer). Esto beneficiará el rendimiento ya que el mensaje solo se mostrará una vez en lugar de cada jugador individualmente.
:::
## Usando el renderizador

Hay dos formas de utilizar el renderizador.
1. Implementar la interfaz [](jd:paper:io.papermc.paper.chat.ChatRenderer) en una clase.
2. Usando una expresión lambda.

Dependiendo de la complejidad de su renderizador, es posible que desee utilizar uno u otro.

### Implementación de la interfaz `ChatRenderer`

La primera forma de utilizar el renderizador es implementando la interfaz [](jd:paper:io.papermc.paper.chat.ChatRenderer) en una clase. En este ejemplo, usaremos nuestra clase `ChatListener`.

A continuación, debemos indicarle al evento que utilice el renderizador mediante el método [](jd:paper:io.papermc.paper.event.player.AbstractChatEvent#renderer()).
```java title="ChatListener.java"
public class ChatListener implements Listener, ChatRenderer {

    @EventHandler
    public void onChat(AsyncChatEvent event) {
        event.renderer(this); // Indica al evento que use nuestro renderizador
    }

    @Override
    public Component render(Player source, Component sourceDisplayName, Component message, Audience viewer) {
        // ...
    }
}
```

:::note
Si decide crear una clase separada para su renderizador, es importante saber que no necesita crear una instancia de la clase cada vez que se llama al evento. En este caso, puede utilizar [el patrón singleton](https://en.wikipedia.org/wiki/Singleton_pattern) para crear una única instancia de la clase.
:::
### Usando una expresión lambda

Otra forma de utilizar el renderizador es mediante una expresión lambda.
```java title="ChatListener.java"
public class ChatListener implements Listener {

    @EventHandler
    public void onChat(AsyncChatEvent event) {
        event.renderer((source, sourceDisplayName, message, viewer) -> {
            // ...
        });
    }
}
```
## Representar el mensaje

Ahora que tenemos nuestro renderizador, podemos comenzar a renderizar el mensaje.

Digamos que queremos que nuestro chat se vea así:

![](../../../../../paper/dev/api/event-api/assets/plain-message-rendering.png)

Para hacer esto, necesitamos devolver un nuevo [](jd:adventure:net.kyori.adventure.text.Component) que contiene el mensaje que queremos enviar.
```java title="ChatListener.java"
public class ChatListener implements Listener, ChatRenderer {

    // Lógica del evento...

    @Override
    public Component render(Player source, Component sourceDisplayName, Component message, Audience viewer) {
        return sourceDisplayName
                .append(Component.text(": "))
                .append(message);
    }
}
```
Ahora puede ver que el mensaje se muestra como queríamos.

## Conclusión

Eso es todo lo que necesitas saber sobre el nuevo evento de chat y su renderizador. Por supuesto, hay muchas más cosas que puedes hacer con los componentes en general. Si desea obtener más información sobre los componentes, puede leer la [Documentación de componentes](/es/adventure/text).
