---
title: Signed messages
description: A guide to working with SignedMessage objects.
slug: paper/dev/component-api/signed-messages
version: 1.19.4+
---

Since [Minecraft version 1.19](https://minecraft.wiki/w/Java_Edition_1.19), the client now signs any
messages it sends so that they are uniquely identifiable and verifiable to be sent by a specific player.
With this update, they also introduced the ability **delete specific messages** previously sent by a player.

:::tip[Note]

This guide does not go in-depth into the specifics of chat signing and its implementation on either client or server.
For a full overview, you can refer [to this linked gist](https://gist.github.com/kennytv/ed783dd244ca0321bbd882c347892874).

:::

## How are signed messages represented in code?
Paper uses Adventure's [`SignedMessage`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/SignedMessage.html)
object to represent a signed message. We differentiate two kinds of signed messages: system messages and non-system messages.
System messages (checked with [`SignedMessage#isSystem()`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/SignedMessage.html#isSystem()))
are messages send by the server, whilst non-system messages are not.

You can also differentiate the **signed plain text** `String` content of the message
([`SignedMessage#message()`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/SignedMessage.html#message()))
from the unsigned, nullable [`Component`](https://jd.advntr.dev/api/latest/net/kyori/adventure/text/Component.html)
content ([`SignedMessage#unsignedContent()`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/SignedMessage.html#unsignedContent())).

## Obtaining a signed message
Signed messages can be obtained in two ways.

1. From an [`AsyncChatEvent`](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) using
   [`AbstractChatEvent#signedMessage()`](jd:paper:io.papermc.paper.event.player.AbstractChatEvent#signedMessage()).

2. From an [`ArgumentTypes.signedMessage()`](jd:paper:io.papermc.paper.command.brigadier.argument.ArgumentTypes#signedMessage())
   Brigadier argument type.

## Using signed messages
You can send signed message objects to an [`Audience`](https://jd.advntr.dev/api/latest/net/kyori/adventure/audience/Audience.html)
using the [`Audience#sendMessage(SignedMessage, ChatType.Bound)`](https://jd.advntr.dev/api/latest/net/kyori/adventure/audience/Audience.html#sendMessage(net.kyori.adventure.chat.SignedMessage,net.kyori.adventure.chat.ChatType.Bound))
method. You can obtain a [`ChatType.Bound`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/ChatType.Bound.html) object
from the [`ChatType`](https://jd.advntr.dev/api/latest/net/kyori/adventure/chat/ChatType.html) interface.

Deleting messages is much simpler. Adventure provides the [`Audience#deleteMessage(SignedMessage)`](https://jd.advntr.dev/api/latest/net/kyori/adventure/audience/Audience.html#deleteMessage(net.kyori.adventure.chat.SignedMessage))
or [`Audience#deleteMessage(SignedMessage.Signature)`](https://jd.advntr.dev/api/latest/net/kyori/adventure/audience/Audience.html#deleteMessage(net.kyori.adventure.chat.SignedMessage.Signature))
methods for that.

## Example: Making user sent messages deletable
For our example, we will create a chat format plugin which allows a user to delete
their own messages in case they made a mistake. For this we will use the [`AsyncChatEvent`](jd:paper:io.papermc.paper.event.player.AsyncChatEvent).

:::tip[AsyncChatEvent]

The [`AsyncChatEvent`](jd:paper:io.papermc.paper.event.player.AsyncChatEvent) is covered in the [chat events](/paper/dev/chat-events)
documentation page. If you want to read up on more detail on the chat renderer, you can do so there.

:::

### In-game preview
![](./assets/signed-messages-deletion.gif)

### Code
```java title="SignedChatListener.java" collapse={1-10} showLineNumbers
package io.papermc.docs.signedmessages;

import io.papermc.paper.event.player.AsyncChatEvent;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.ClickEvent;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.Bukkit;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public class SignedChatListener implements Listener {

    @EventHandler
    void onPlayerChat(AsyncChatEvent event) {
        // We modify the chat format, so we use a chat renderer.
        event.renderer((player, playerName, message, viewer) -> {
            // This is the base format of our message. It will format chat as "<player> » <message>".
            final Component base = Component.textOfChildren(
                playerName.colorIfAbsent(NamedTextColor.GOLD),
                Component.text(" » ", NamedTextColor.DARK_GRAY),
                message
            );

            // Send the base format to any player who is not the sender.
            if (viewer != player) {
                return base;
            }

            // Create a base delete suffix. The creation is separated into two
            // parts purely for readability reasons.
            final Component deleteCrossBase = Component.textOfChildren(
                Component.text("[", NamedTextColor.DARK_GRAY),
                Component.text("X", NamedTextColor.DARK_RED, TextDecoration.BOLD),
                Component.text("]", NamedTextColor.DARK_GRAY)
            );

            // Add a hover and click event to the delete suffix.
            final Component deleteCross = deleteCrossBase
                .hoverEvent(Component.text("Click to delete your message!", NamedTextColor.RED))
                // We retrieve the signed message with event.signedMessage() and request a server-wide deletion if the
                // deletion cross were to be clicked.
                .clickEvent(ClickEvent.callback(audience -> Bukkit.getServer().deleteMessage(event.signedMessage())));

            // Send the base format but with the delete suffix.
            return base.appendSpace().append(deleteCross);
        });
    }
}
```
