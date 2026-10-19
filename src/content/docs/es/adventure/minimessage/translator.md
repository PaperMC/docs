---
title: Traductor MiniMessage
slug: es/adventure/minimessage/translator
description: Guía sobre el traductor MiniMessage.
---

:::note

Para obtener más información sobre los sistemas de localización de Minecraft y Adventure, consulta [localización](/es/adventure/localization).

:::

MiniMessage proporciona una implementación de `Translator` que permite usar MiniMessage como cadenas de traducción.
También admite automáticamente marcadores de posición de argumentos, lo que permite usar componentes traducibles sencillos en todo el código.

## Crear un traductor MiniMessage

Para empezar, crea una implementación de `MiniMessageTranslator` y regístrala en `GlobalTranslator`.
Puedes hacerlo mediante `GlobalTranslator.translator().addSource(myMiniMessageTranslator)`.
Consulta el siguiente bloque de código para ver un ejemplo de cómo crear tu propio
`MiniMessageTranslator`.

```java title="MyMiniMessageTranslator.java"
public class MyMiniMessageTranslator extends MiniMessageTranslator {

  public MyMiniMessageTranslator() {
    // De forma predeterminada, se usará la instancia estándar de MiniMessage.
    // Puedes especificar una personalizada en el constructor de la superclase.
    super(MiniMessage.miniMessage());
  }

  @Override
  public Key name() {
    // Cada traductor tiene un nombre que identifica esta instancia concreta.
    return Key.key("mynamespace:mykey");
  }

  @Override
  public @Nullable String getMiniMessageString(final String key, final Locale locale) {
    // Para crear un traductor MiniMessage personalizado, basta con sobrescribir este método.
    // Solo tienes que devolver una cadena MiniMessage para la clave y la configuración regional indicadas.
    // En este ejemplo el valor está escrito directamente en el código, pero podrías obtenerlo de un paquete de recursos, un archivo de propiedades o de configuración, o de otra fuente.
    if (key.equals("mykey") && locale.equals(Locale.forLanguageTag("es"))) {
      return "<red>¡Hola, <name>! Hoy es <day_of_week>.";
    } else {
      // Devolver null hace que se «ignore» esta traducción.
      return null;
    }
  }
}
```

### Almacén de traducciones MiniMessage

Para facilitar la administración de un `MiniMessageTranslator`, también ofrecemos una implementación de `TranslationStore` que usa cadenas MiniMessage.
Consulta `localization` para obtener documentación sobre el uso de almacenes de traducciones.

Ten en cuenta que `MiniMessageTranslationStore` incluye los mismos métodos que el almacén de traducciones con formato de mensajes para rellenar un almacén de traducciones usando paquetes de recursos.

## Usar un traductor MiniMessage

El traductor MiniMessage convierte automáticamente los argumentos de componentes traducibles en etiquetas personalizadas.
La etiqueta será `<arg:index>` o `<argument:index>`, donde `index` es la posición del argumento, empezando por cero.
Por ejemplo, el componente `Component.translatable(key, Component.text("Kezz"))` con la cadena MiniMessage `¡Hola, <arg:0>!` producirá «¡Hola, Kezz!».

También puedes usar la clase `Argument` para crear etiquetas con nombre y facilitar su uso.
Por ejemplo, el componente `Component.translatable(key, Argument.component("name", Component.text("Kezz"))` producirá la cadena «¡Hola, Kezz!»
si se usa con `¡Hola, <arg:0>!` o con `¡Hola, <name>!`.

Por último, puedes añadir etiquetas o resolvedores de etiquetas completamente personalizados durante la deserialización usando los demás métodos de `Argument`.
Consulta los Javadocs de la clase `Argument` para ver la lista completa.
