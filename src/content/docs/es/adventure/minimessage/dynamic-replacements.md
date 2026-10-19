---
title: Reemplazos dinámicos
slug: es/adventure/minimessage/dynamic-replacements
description: Guía sobre los resolvedores de etiquetas.
---

MiniMessage incluye algunos `TagResolver` que pueden reemplazar etiquetas dinámicamente durante el análisis. Estos resolvedores pueden sustituir una etiqueta por contenido dinámico, como una cadena o un número con formato.

## Marcadores de posición

Los marcadores de posición sustituyen la etiqueta por un texto concreto. Son los reemplazos más básicos:

### Insertar un componente

Puedes insertar directamente un componente para la etiqueta mediante el marcador de posición de componente.

```java
MiniMessage.miniMessage().deserialize("<gray>Hola <name> :)", Placeholder.component("name", Component.text("PRUEBA", NamedTextColor.RED)));
```

Esto insertará el componente de texto rojo «PRUEBA» en la posición de la etiqueta.

### Insertar texto sin analizar

A veces es mejor no analizar texto dinámico, como las entradas de usuario. Para esos casos, MiniMessage proporciona el marcador de posición sin analizar.
Este método permite sanear la entrada del usuario sin tener que escapar directamente las etiquetas.

```java
MiniMessage.miniMessage().deserialize("<gray>Hola <name>", Placeholder.unparsed("name", "<red>PRUEBA :)"));
```

Esto insertará el texto sin analizarlo. El resultado será texto gris con `Hola <red>PRUEBA :)`.

### Insertar y analizar texto

Si quieres insertar texto y permitir que MiniMessage analice las etiquetas, puedes usar el marcador de posición analizado.
Este marcador inserta el reemplazo antes de analizar la cadena. Las etiquetas del marcador pueden afectar al resultado analizado después del marcador.

```java
MiniMessage.miniMessage().deserialize("<gray>Hola <name> :)", Placeholder.parsed("name", "<red>PRUEBA"));
// Devuelve Component.text("Hola ", NamedTextColor.GRAY).append(Component.text("PRUEBA :)", NamedTextColor.RED));
```

Esto insertará y analizará el texto.

### Insertar un estilo

Si quieres crear tu propia etiqueta de estilo, puedes usar el marcador de posición de estilo.

```java
MiniMessage.miniMessage().deserialize("<my_style>Hola :)</my_style> ¿Cómo estás?",
    Placeholder.styling("my_style", ClickEvent.suggestCommand("/say hello"), NamedTextColor.RED, TextDecoration.BOLD));
// Aplicará al texto un evento de clic, el color rojo y la decoración en negrita.
```

Esto insertará el estilo con un evento de clic y texto rojo. Los marcadores de posición de estilo se pueden usar con cualquier estilo, como colores, decoraciones de texto y eventos.

Crear etiquetas de estilo propias:

```java
Placeholder.styling("fancy", TextColor.color(150, 200, 150)); // Cambiará el color del texto entre "<fancy>" y "</fancy>".
Placeholder.styling("my_hover", HoverEvent.showText(Component.text("prueba"))); // Mostrará el texto personalizado al pasar el cursor.
Placeholder.styling("my_cmd", ClickEvent.runCommand("/mycmd es genial")); // Creará un texto en el que se puede hacer clic para ejecutar el comando indicado.
```

:::tip

Los marcadores de posición de estilo se pueden usar para sanear la entrada de los jugadores en eventos de clic. En lugar de usar un marcador analizado, se puede usar la cadena directamente.

:::


## Formateadores

No todo es texto; a veces resulta útil mostrar un número o una fecha.
Para ello, puedes usar los formateadores que proporciona MiniMessage.

### Insertar un número

Puedes insertar un `Number` usando el formateador numérico de MiniMessage.

Para especificar la configuración regional y el formato del número, el formateador acepta argumentos opcionales de etiqueta.
Puedes especificar la configuración regional y el formato numérico. Es posible pasar ambos como argumentos de la etiqueta, pero debes indicar primero la configuración regional.

```java
MiniMessage.miniMessage().deserialize("<gray>Hola, mi número es <no>.", Formatter.number("no", 250.25));
MiniMessage.miniMessage().deserialize("<gray>Hola, mi número es <no:'#.00'>.", Formatter.number("no", 250.25));
MiniMessage.miniMessage().deserialize("<gray>Hola, mi número es <no:'de-DE':'#.00'>.", Formatter.number("no", 250.25));
MiniMessage.miniMessage().deserialize("<gray>Hola, mi número es <no:'de-DE'>.", Formatter.number("no", 250.25));
```

Todos estos ejemplos son válidos e insertarán el número como etiqueta.

Consulta `Locale` y `DecimalFormat` para ver etiquetas de configuración regional válidas y patrones que se pueden usar.

:::tip

Puedes cambiar el estilo, como el color, mediante un patrón más complejo:

```java
MiniMessage.miniMessage().deserialize("<gray>Tu saldo actual es <no:'en-EN':'<green>#.00;<red>-#.00'>.", Formatter.number("no", 250.25));
```

Esto mostrará el saldo en rojo si es negativo; de lo contrario, el número aparecerá en verde.

:::


### Insertar una fecha

Para insertar una instancia de `TemporalAccessor`, como `LocalDateTime`, puedes usar el formateador de fechas.

El resolvedor de etiquetas requiere un argumento de etiqueta para el formato. Consulta `DateTimeFormatter` para ver patrones válidos.

```java
MiniMessage.miniMessage().deserialize("<gray>La fecha actual es: <date:'yyyy-MM-dd HH:mm:ss'>.", Formatter.date("date", LocalDateTime.now(ZoneId.systemDefault()));
```

Esto mostrará la fecha actual con el formato especificado, por ejemplo, `2022-05-27 11:30:25`.

### Insertar una opción

Para insertar un número y dar formato a un texto según su valor, puedes usar el formateador de opciones.

Este formateador acepta un patrón `ChoiceFormat`.

```java
MiniMessage.miniMessage().deserialize("<gray>Conocí a <choice:'0#ningún desarrollador|1#un desarrollador|1<muchos desarrolladores'>.", Formatter.choice("choice", 5));
```

Esto dará formato a la entrada según el `ChoiceFormat` proporcionado. En este caso, el resultado será `Conocí a muchos desarrolladores.`.


## Marcadores de posición complejos

Puedes crear tus propios marcadores de posición. Consulta las clases [Formatter](https://github.com/PaperMC/adventure/blob/main/5/text-minimessage/src/main/java/net/kyori/adventure/text/minimessage/tag/resolver/Formatter.java) y [Placeholder](https://github.com/PaperMC/adventure/blob/main/5/text-minimessage/src/main/java/net/kyori/adventure/text/minimessage/tag/resolver/Placeholder.java) de MiniMessage para ver ejemplos.

### Ejemplos

Crea una etiqueta personalizada que permita hacer clic en su contenido:

```java replace
TagResolver.resolver("click_by_version", (args, context) -> {
  final String version = args.popOr("se esperaba una versión").value();
  return Tag.styling(ClickEvent.openUrl("https://jd.papermc.io/adventure/" + version + "/"));
});
// Crea una etiqueta para abrir los Javadocs de Adventure de la versión indicada: <click_by_version:'\{LATEST_ADVENTURE_API_RELEASE}'>
```

Puedes crear tus propios marcadores de posición complejos con varios argumentos y lógica propia.
