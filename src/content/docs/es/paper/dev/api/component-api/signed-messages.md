---
title: Mensajes firmados
description: Una guía para trabajar con objetos SignedMessage.
slug: es/paper/dev/component-api/signed-messages
version: 1.19.4+
---
Desde [Minecraft versión 1.19](https://minecraft.wiki/w/Java_Edition_1.19), el cliente ahora firma todos los mensajes que envía para que sean identificables de forma única y verificables para ser enviados por un jugador específico. Con esta actualización, también introdujeron la capacidad de **eliminar mensajes específicos** enviados previamente por un jugador.
:::tip[Nota]
Esta guía no profundiza en los detalles de la firma de chat y su implementación en el cliente o en el servidor. Para obtener una descripción general completa, puedes consultar [este gist](https://gist.github.com/kennytv/ed783dd244ca0321bbd882c347892874).
:::
## ¿Cómo se representan los mensajes firmados en el código?
Paper utiliza el objeto [](jd:adventure:net.kyori.adventure.chat.SignedMessage) de Adventure para representar un mensaje firmado. Diferenciamos dos tipos de mensajes firmados: mensajes del sistema y mensajes que no son del sistema. Los mensajes del sistema (marcados con [](jd:adventure:net.kyori.adventure.chat.SignedMessage#isSystem())) son mensajes enviados por el servidor, mientras que los mensajes que no son del sistema no lo son.

También puedes distinguir el contenido de **texto plano firmado** `String` del mensaje ([](jd:adventure:net.kyori.adventure.chat.SignedMessage#message())) del contenido sin firmar y anulable [](jd:adventure:net.kyori.adventure.text.Component) ([](jd:adventure:net.kyori.adventure.chat.SignedMessage#unsignedContent())).

## Obteniendo un mensaje firmado
Los mensajes firmados se pueden obtener de dos formas.

1. Desde un [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) usando
   [](jd:paper:io.papermc.paper.event.player.AbstractChatEvent#signedMessage()).

2. De un [](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#signedMessage())
   Tipo de argumento de brigadier.

## Usando mensajes firmados
Puede enviar objetos de mensaje firmados a un [](jd:adventure:net.kyori.adventure.audience.Audience) utilizando el método [](jd:adventure:net.kyori.adventure.audience.Audience#sendMessage(net.kyori.adventure.chat.SignedMessage,net.kyori.adventure.chat.ChatType$Bound)). Puede obtener un objeto [](jd:adventure:net.kyori.adventure.chat.ChatType$Bound) desde la interfaz [](jd:adventure:net.kyori.adventure.chat.ChatType).

Eliminar mensajes es mucho más sencillo. Adventure proporciona los métodos [](jd:adventure:net.kyori.adventure.audience.Audience#deleteMessage(net.kyori.adventure.chat.SignedMessage)) o [](jd:adventure:net.kyori.adventure.audience.Audience#deleteMessage(net.kyori.adventure.chat.SignedMessage$Signature)) para eso.

## Ejemplo: hacer que los mensajes enviados por el usuario sean eliminables
Para este ejemplo, crearemos un plugin de formato de chat que permite a los usuarios eliminar sus propios mensajes si cometen un error. Para ello, usaremos [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent).
:::tip[Evento de chat asíncrono]
El [](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) se trata en la página de documentación sobre [eventos de chat](/es/paper/dev/chat-events). Si quieres más información sobre el renderizador de chat, puedes consultarla allí.
:::
### Vista previa del juego
![](../../../../../paper/dev/api/component-api/assets/signed-messages-deletion.gif)

### Código
```java title="SignedChatListener.java" showLineNumbers
public class SignedChatListener implements Listener {

    @EventHandler
    void onPlayerChat(AsyncChatEvent event) {
        // Modificamos el formato del chat, así que usamos un renderizador de chat.
        event.renderer((player, playerName, message, viewer) -> {
            // Este es el formato base del mensaje. Da al chat el formato "<player_name> » <message>".
            final Component base = Component.textOfChildren(
                playerName.colorIfAbsent(NamedTextColor.GOLD),
                Component.text(" » ", NamedTextColor.DARK_GRAY),
                message
            );

            // Envía el formato base a todos los jugadores excepto al emisor.
            if (viewer != player) {
                return base;
            }

            // Crea el sufijo de eliminación. Se divide en dos partes únicamente para facilitar la lectura.
            final Component deleteCrossIcon = Component.textOfChildren(
                Component.text("[", NamedTextColor.DARK_GRAY),
                Component.text("X", NamedTextColor.DARK_RED, TextDecoration.BOLD),
                Component.text("]", NamedTextColor.DARK_GRAY)
            );

            // Añade eventos de desplazamiento y clic al sufijo de eliminación.
            final Component deleteCross = deleteCrossIcon
                .hoverEvent(Component.text("¡Haz clic para eliminar tu mensaje!", NamedTextColor.RED))
                // Obtén el mensaje firmado con event.signedMessage() y solicita eliminarlo en todo el servidor si
                // alguien hace clic en la cruz de eliminación.
                .clickEvent(ClickEvent.callback(_ -> Bukkit.getServer().deleteMessage(event.signedMessage())));

            // Envía el formato base con el sufijo de eliminación.
            return base.appendSpace().append(deleteCross);
        });
    }
}
```
