---
title: Localización
slug: es/adventure/localization
description: Uso de la localización en Adventure.
---

Adventure permite usar el sistema de localización integrado de Minecraft para las traducciones en el cliente, además de ofrecer un sistema propio para traducir texto.

## Usar la localización de Minecraft

Para enviar a un jugador texto que se traduzca al idioma seleccionado en los ajustes de su cliente, usa un componente traducible.
Por ejemplo, `Component.translatable("block.minecraft.diamond_block")` se mostrará como «Block of Diamond» (o traducido a otro idioma) en el cliente.
Algunas claves de traducción admiten argumentos que se insertan en el contenido traducido.
Por ejemplo, `Component.translatable("block.minecraft.player_head.named", Component.text("Mark"))` se mostrará como «Mark's Head».
Los componentes traducibles pueden tener estilos, eventos de desplazamiento o clic y componentes secundarios, igual que cualquier otro tipo de componente.

### Archivos de idioma de paquetes de recursos

Puedes incluir archivos de traducción en un paquete de recursos para cambiar las traducciones existentes o añadir otras nuevas.
Encontrarás una guía en [Minecraft Wiki](https://minecraft.wiki/w/Resource_pack#Language).

### Usar la localización de Adventure

Adventure también permite gestionar la localización desde la propia biblioteca.
Esto puede resultar útil en entornos donde no tienes acceso a paquetes de recursos o quieres realizar las traducciones por tu cuenta, sin depender del sistema de traducción de Minecraft.

Todo componente que se envía a un cliente pasa por `GlobalTranslator` usando la configuración regional del cliente.
Por tanto, si quieres traducir componentes automáticamente con tus propios datos de traducción, puedes añadir un `Translator` a `GlobalTranslator`.
Puedes proporcionar tu propia implementación de `Translator` o usar una de las que ofrece Adventure.

Cuando tengas una instancia de `Translator`, puedes registrarla en `GlobalTranslator` mediante `GlobalTranslator.translator().addSource(myTranslator)`.
Así estará disponible para la traducción automática en toda la plataforma.

:::caution

Es posible que algunas implementaciones no usen `GlobalTranslator` en todos los contextos, o que no lo usen en absoluto.
Por ejemplo, Paper no lo usa para los objetos, y Minestom no lo usa salvo que se habilite explícitamente.
Consulta la documentación de tu plataforma para conocer sus limitaciones.

:::

## Usar un `Translator` personalizado

`Translator` es una interfaz sencilla que ofrece dos formas de traducir contenido.

El primer método `translate` recibe la clave de traducción y la configuración regional como argumentos, y espera que se devuelva un `MessageFormat` anulable.
Este sistema es comparable al sistema de localización integrado de Minecraft y usa el formato estándar de mensajes de Java
[formato de mensajes](jd:java:java.text.MessageFormat) para los argumentos.

Si el primer método `translate` devuelve `null`, se puede usar el segundo, que recibe el componente traducible y la configuración regional.
Este método permite personalizar mucho más el proceso de traducción, ya que puedes devolver un componente completo.
Por ejemplo, puedes personalizar el color y el estilo del componente traducido en lugar de depender únicamente de cadenas con el formato de mensajes.

:::caution

Si sobrescribes el método `translate` para componentes, ten cuidado de no perder accidentalmente los componentes secundarios del componente traducible.
Consulta los Javadocs del método `translate` para ver un ejemplo de código que evita este error común.

:::

A continuación se muestra un ejemplo de implementación de un `Translator` personalizado.

```java title="MyTranslator.java"
public class MyTranslator implements Translator {

  @Override
  public Key name() {
    // Cada traductor tiene un nombre que identifica esta instancia concreta.
    return Key.key("mynamespace:mykey");
  }

  @Override
  public @Nullable MessageFormat translate(final String key, final Locale locale) {
    // Podrías obtener una cadena de un archivo de propiedades, de configuración o de otro sistema.
    // A modo de ejemplo, aquí comprobaremos una clave concreta directamente en el código.
    if (key.equals("mytranslation.key") && Locale.US.equals(locale)) {
      return new MessageFormat("Hello {0}!", locale);
    } else {
      // Si solo quieres traducir componentes, puedes sobrescribir este método y devolver siempre `null`.
      return null;
    }
  }

  @Override
  public @Nullable Component translate(final TranslatableComponent component, final Locale locale) {
    // Como antes, aquí comprobaremos una clave directamente, pero lo ideal es obtenerla de otra fuente.
    if (component.key().equals("mytranslation.colorful") && Locale.US.equals(locale)) {
      return Component.text("Hello, ", NamedTextColor.GREEN)
        .append(component.arguments().stream().map(it -> it.asComponent().color(NamedTextColor.RED)).toList())
        .append(component.children()) // Asegúrate siempre de copiar también los componentes secundarios.
        .applyFallbackStyle(component.style());
    } else {
      return null;
    }
  }
}
```

### Usar un `TranslationStore`

Un `TranslationStore` es un almacén de traducciones.
Permite crear un `Translator` de forma más sencilla, sin tener que implementar por tu cuenta la lógica para buscar y almacenar traducciones.
Puedes crear un almacén de traducciones y añadir o quitar traducciones cuando quieras, incluso después de registrarlo en el traductor global.

Adventure proporciona dos almacenes de traducciones: uno para traducciones con formato de mensajes y otro para traducciones de componentes.
A continuación se muestra un ejemplo de uso.

```java
// Como antes, todos los traductores necesitan un nombre identificador.
// También puedes usar TranslationStore#component(Key) para trabajar con componentes.
final TranslationStore.StringBased<MessageFormat> myStore = TranslationStore.messageFormat(Key.key("mynamespace:mykey"));

// Puedes añadir traducciones una a una o en bloque. Consulta los Javadocs para ver todos los métodos.
myStore.register("mytranslation.key", Locale.US, new MessageFormat("Hello {0}!", Locale.US));

// Después puedes registrarlo en el traductor global para que las traducciones estén disponibles.
GlobalTranslator.translator().addSource(myStore);
```

El almacén de traducciones con formato de mensajes incluye métodos adicionales para registrar traducciones en bloque desde [paquetes de recursos](jd:java:java.util.ResourceBundle).

### Usar MiniMessage para las traducciones

Adventure también proporciona un traductor que puede usar cadenas MiniMessage y admite automáticamente marcadores de posición y argumentos.
Para obtener más información, consulta [Traductor MiniMessage](/es/adventure/minimessage/translator).
