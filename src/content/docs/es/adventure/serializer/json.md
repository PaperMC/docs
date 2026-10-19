---
title: JSON
slug: es/adventure/serializer/json
description: Serialización de componentes a su representación JSON.
---

El serializador JSON ofrece una interfaz común para las implementaciones de serializadores que convierten entre un componente y cadenas JSON. Así, una biblioteca puede admitir cualquier biblioteca JSON subyacente que una aplicación quiera usar.

## Uso

El serializador JSON funciona como los demás y ofrece las operaciones básicas de serialización y deserialización:

```java
// Convertir un componente a texto
final String json = JSONComponentSerializer.json().serialize(Component.text("Hola mundo", NamedTextColor.LIGHT_PURPLE));

// Convertir una cadena JSON en un componente
final Component component = JSONComponentSerializer.json().deserialize(json);
```

Además, para usos avanzados que requieran configurar opciones de compatibilidad con formatos antiguos, se puede usar `JSONComponentSerializer.builder()`.

## Implementaciones conocidas

| Nombre                                                       | Descripción                                             |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| [adventure-text-serializer-gson](/es/adventure/serializer/gson) | Un serializador consolidado que usa la biblioteca Gson de Google. |
