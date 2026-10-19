---
title: Eventos
description: Guía para añadir eventos nuevos a Paper.
slug: es/paper/contributing/events
---

Los eventos de la API de Paper deben cumplir varios requisitos.

:::note

Ten en cuenta que quizá no todos los eventos existentes sigan estas
pautas, pero todos los eventos nuevos o modificados deben cumplirlas.

:::

Todos los eventos nuevos deben ubicarse en el paquete (o en un subpaquete de) `io.papermc.paper.event`.

### Constructores

Todos los constructores nuevos deben llevar la anotación
[`@ApiStatus.Internal`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/ApiStatus.Internal.html)
para indicar que no se consideran parte de la API y que pueden cambiar en cualquier momento sin previo aviso.

Los constructores que se sustituyan, si no se eliminan, deben marcarse con
[`@Deprecated`](jd:java:java.lang.Deprecated) y [`@DoNotUse`](jd:paper:io.papermc.paper.annotation.DoNotUse).

### Mutabilidad
Algunos tipos de la API son «mutables», lo que puede provocar comportamientos inesperados en los eventos. Por eso, los tipos mutables como
[](jd:paper:org.bukkit.Location) y [](jd:paper:org.bukkit.util.Vector)
deben clonarse al devolverse desde un «getter» de un evento.

### `HandlerList`
Para poder escuchar una clase de evento o cualquiera de sus subclases, debe haber un campo [`HandlerList`](jd:paper:org.bukkit.event.HandlerList)
con una instancia y un método estático para obtenerlo.
Consulta la documentación de [](jd:paper:org.bukkit.event.Event) para obtener más detalles.
Este campo debe ser estático, final y llamarse `HANDLER_LIST`.

También puedes evitar añadir un `HandlerList` a cada evento y colocarlo solo en un evento «padre común». Así, un plugin podrá escuchar el
evento padre para capturar los eventos secundarios y también escuchar cada evento secundario por separado.

### Varios

* En la mayoría de los casos, los parámetros nuevos o los valores devueltos por métodos de tipo [](jd:paper:org.bukkit.inventory.ItemStack)
no deben llevar [`@Nullable`](https://javadoc.io/doc/org.jspecify/jspecify/latest/org/jspecify/annotations/Nullable.html);
en su lugar, deben aceptar un ItemStack vacío.
