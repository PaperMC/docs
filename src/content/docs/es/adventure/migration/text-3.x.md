---
title: Migrar desde text 3.x
slug: es/adventure/migration/text-3.x
description: Migración de text 3.x a Adventure.
---

Adventure es una evolución de la API text 3.x. Si ya has trabajado con
la API text, el cambio a Adventure debería ser relativamente rápido.
En general, solo tendrás que añadir como dependencia la API de Adventure
y la [plataforma](/es/adventure/platform) correspondiente, y reemplazar las referencias
a las clases de `net.kyori.text` por `net.kyori.adventure.text`. No obstante, consulta
a continuación los principales cambios incompatibles.

## Una advertencia

Antes de continuar, te recomendamos encarecidamente leer sobre las
[audiencias](/es/adventure/audiences). A diferencia de text, Adventure define una interfaz estándar para
enviar contenido (incluidos mensajes de chat) a los destinatarios. Además, Adventure
define interfaces para otras mecánicas de juego que se pueden enviar a los jugadores de forma arbitraria.

## Cambios incompatibles de text 3.x

### Cambio de nombre de los métodos de fábrica
En text 3.x, los componentes se podían crear con métodos `<type>Component.of()`.
En Adventure, usamos métodos del tipo `Component.<type>(/*...*/)` para facilitar
las importaciones estáticas.

Del mismo modo, `Style.of(/*...*/)` cambia a `Style.style(/*...*/)` .

### `.builder()`
Los constructores ahora se crean llamando sin parámetros a los métodos de fábrica mencionados.
Por ejemplo, `TextComponent.builder()` pasa a ser `Component.text()`.

Ten en cuenta que el equivalente de `TextComponent.builder("hello")` es `Component.text().content("hello")`.

### `.append()` con un argumento String
Los constructores de componentes de 3.x ofrecían una forma abreviada de añadir un componente de texto: `builder.append("wow")`.
En Adventure debes escribirlo completo: en este caso, `builder.append(Component.text("wow"))`.

### `LegacyComponentSerializer`

En text 3.x, para deserializar un componente que usara un prefijo de código de color distinto del símbolo de sección habitual, se usaba `LegacyComponentSerializer.legacy().deserialize(string, altChar)`.
En Adventure, debes usar `LegacyComponentSerializer.legacy(altChar).deserialize(string)`.

Para crear un serializador que convierta los enlaces, debes usar el constructor.
Cambia `LegacyComponentSerializer.legacyLinking(style)`
por `LegacyComponentSerializer.builder().extractUrl(style).build()`.

### Cambio de nombre de `TextColor` a `NamedTextColor`

Para admitir los nuevos colores RGB introducidos en 1.16, todos los colores de texto con nombre
se trasladaron a la clase `NamedTextColor`. Actualiza las referencias a la antigua clase `TextColor`
para que apunten a `NamedTextColor`.

## Serializador

Si necesitas interoperar con clientes que usan la antigua API text 3.x, puedes
usar el artefacto `adventure-text-serializer-legacy-text3`, que incluye
`LegacyText3ComponentSerializer` para convertir componentes de Adventure a text 3.x
y viceversa. Ten en cuenta que los colores RGB se reducirán a una paleta compatible.
