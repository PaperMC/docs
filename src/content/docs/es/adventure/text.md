---
title: Texto (componentes del chat)
slug: es/adventure/text
description: Todo lo que necesitas saber sobre los componentes.
---

Los componentes representan los componentes del chat de Minecraft.

## Crear componentes

```java
// Crear una línea de texto que diga «¡Eres un conejo! Pulsa <key> para saltar», con colores y estilos.
final TextComponent textComponent = Component.text("¡Eres un ")
  .color(TextColor.color(0x443344))
  .append(Component.text("conejo", NamedTextColor.LIGHT_PURPLE))
  .append(Component.text(". Pulsa "))
  .append(
    Component.keybind("key.jump")
      .color(NamedTextColor.LIGHT_PURPLE)
      .decoration(TextDecoration.BOLD, true)
  )
  .append(Component.text(" para saltar."));
// Ahora puedes enviar `textComponent` a un destinatario, como un cliente.
```

También puedes usar un constructor, que es mutable y crea un único
componente final con los componentes secundarios.

```java
// Crear una línea de texto que diga «¡Eres un conejo! Pulsa <key> para saltar», con colores y estilos.
final TextComponent textComponent2 = Component.text()
  .content("¡Eres un ")
  .color(TextColor.color(0x443344))
  .append(Component.text().content("conejo").color(NamedTextColor.LIGHT_PURPLE))
  .append(Component.text(". Pulsa "))
  .append(
    Component.keybind().keybind("key.jump")
      .color(NamedTextColor.LIGHT_PURPLE)
      .decoration(TextDecoration.BOLD, true)
      .build()
  )
  .append(Component.text(" para saltar."))
  .build();
// Ahora puedes enviar `textComponent2` a un destinatario, como un cliente.
```

## Aplicar estilos a los componentes

Los estilos amplían `TextColor` y `TextDecoration`, y se pueden aplicar a componentes de texto.
`TextColor` representa cualquier color del espectro RGB.
También puedes usar `NamedTextColor` para elegir un color de la paleta predeterminada.
Están disponibles las siguientes decoraciones de texto:

* *Cursiva*
* **Negrita**
* Tachado
* Subrayado
* Ofuscado

## Eventos

Actualmente hay dos tipos de eventos disponibles para los componentes de texto.
Los eventos de desplazamiento permiten mostrar otro componente, objeto o entidad cuando el usuario pasa el cursor sobre el texto.
Al hacer clic en un componente de texto, se activa un evento de clic que puede realizar una de las siguientes acciones:

* Abrir una URL
* Abrir un archivo
* Ejecutar un comando
* Sugerir un comando
* Cambiar la página de un libro
* Copiar una cadena al portapapeles
* Abrir un diálogo
* Enviar una carga personalizada al servidor

## Serializar y deserializar componentes

También se admite la serialización a representaciones JSON, antiguas y de texto sin formato.

Los componentes se pueden serializar con los [serializadores de texto](/es/adventure/serializer).

## Usar componentes en tu aplicación

La forma de usar componentes en tu aplicación dependerá, por supuesto,
de lo que quieras conseguir.

Sin embargo, la tarea más habitual probablemente sea enviar un componente a
algún cliente de Minecraft. El método dependerá de la plataforma donde se ejecute
tu programa, pero probablemente implique serializar el componente al formato JSON de Minecraft y luego enviar
el JSON mediante otro método que proporcione la plataforma.

La biblioteca de texto es independiente de la plataforma y, por tanto, no ofrece
ninguna forma de enviar componentes a los clientes. Algunas plataformas implementan [Adventure de forma nativa](/es/adventure/platform/native), por lo que puedes usar `Components`
directamente con su API. Para otras plataformas (Spigot/Bukkit, BungeeCord y SpongeAPI 7),
ofrecemos puentes de compatibilidad como [Plataformas](/es/adventure/platform), que puedes distribuir con tus propios plugins.
