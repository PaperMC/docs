---
title: Introducción
slug: es/paper/dev/component-api/introduction
description: Una introducción a cómo funcionan los componentes.
---

:::note
Esta página de documentación se aplica tanto a los proyectos Paper como a Velocity.
:::
Desde Minecraft 1.7, el juego utiliza componentes para representar el texto que se muestra a los clientes. Los componentes ofrecen varias ventajas frente a las cadenas de texto sin formato, como se explica a continuación. Paper y Velocity implementan de forma nativa la API de Adventure para ofrecer compatibilidad con componentes siempre que sea posible.

## Por qué deberías usar componentes

Anteriormente, el texto era una estructura lineal con las únicas opciones de formato siendo símbolos confusos como `§c` y `§k` para controlar los colores y estilos básicos del texto. Los componentes son una estructura en forma de árbol que hereda el estilo y los colores de sus padres.

Los componentes tienen varios tipos que hacen cosas distintas además de mostrar texto sin formato, como traducir texto al idioma del cliente según una clave o mostrar al jugador una combinación de teclas específica del cliente.

Todos estos tipos de componentes admiten más opciones de estilo, como cualquier color RGB y eventos de interacción (hacer clic y pasar el cursor). Los demás tipos de componentes y estas opciones de estilo tienen una representación deficiente o inexistente en el formato de cadenas heredado.

## Uso

Representar texto mediante componentes es ahora la forma recomendada en Paper y Velocity. Se usan en casi todos los elementos de texto que se muestran a los clientes: nombres de objetos, descripciones, barras de jefe, prefijos y sufijos de equipos, nombres personalizados y mucho más. Las respectivas API admiten componentes en todos estos casos. [Mojang ha indicado](https://mojira.dev/MC-190605#comment-id-606141) que, en el futuro, se eliminará la compatibilidad del cliente con el formato heredado basado en `§`.
:::tip
En la API de Paper, hay muchos métodos y tipos obsoletos que se ocupan de este formato heredado. Esto es para indicar que hay disponible una mejor alternativa en componentes y que se debe migrar en el futuro.
:::
## Crear componentes

Se puede interactuar con los componentes como objetos. Hay diferentes interfaces para cada tipo junto con constructores para todos los tipos. Estos objetos son inmutables, por lo que al construir componentes más complejos, se recomienda utilizar constructores para evitar crear nuevas instancias de componentes con cada cambio.
```java
// Esta es una forma poco óptima de construir el
// componente, ya que cada cambio crea un componente nuevo.
final Component component = Component.text("Hello")
    .color(TextColor.color(0x13f832))
    .append(Component.text(" world!", NamedTextColor.GREEN));

/* Esta es una forma óptima de usar el constructor para crear
   el mismo componente. Ten en cuenta también que los componentes de Adventure
   están diseñados para usarse con importaciones de métodos estáticos
   y así hacer el código menos verboso */
final Component component = text()
    .content("Hola").color(color(0x13f832))
    .append(text(" mundo!", GREEN))
    .build();
```

:::note[Documentación detallada]
Para obtener documentación completa sobre el uso de Velocity y Paper API del componente Adventure, consulte la [documentación de Adventure](/es/adventure).
:::
## Minimensaje

Paper y Velocity incluyen la biblioteca MiniMessage, que es una representación en cadena de componentes. Si prefiere trabajar con cadenas en lugar de objetos, MiniMessage es muy superior al formato de cadena heredado. Puede utilizar la estructura de árbol para la herencia de estilos y puede representar los tipos de componentes más complejos, mientras que el legado no puede.
```java
final Component component = MiniMessage.miniMessage().deserialize(
    "<#438df2><b>Este es el componente principal; su estilo se " +
    "aplica a todos sus elementos secundarios.\n<u><!b>Este es el primer elemento secundario, " +
    "que se muestra después del principal</!b></u><key:key.inventory></b></#438df2>"
);


// Si la sintaxis anterior te resulta demasiado extensa, crea un método auxiliar.

public final class Components {
    public static Component mm(String miniMessageString) { // mm, short for MiniMessage
        return MiniMessage.miniMessage().deserialize(miniMessageString);
    }
}

// ...

import static com.example.paperplugin.util.Components.mm; // reemplázalo por tu propio paquete

final Component component = mm("<blue>Hola <red>mundo!");
```
Recomendamos utilizar este formato para entradas de cara al usuario, como comandos o valores de configuración.
:::note[Documentación detallada]
MiniMessage forma parte de Adventure. Puedes consultar su documentación en [la documentación de Adventure](/es/adventure/minimessage).
:::

:::tip
MiniMessage tiene un [visor web](https://webui.advntr.dev/), que es útil para construir componentes más complicados y ver los resultados en tiempo real.
:::
## formato JSON

Los componentes se pueden serializar y deserializar desde un formato JSON estándar. Este formato se utiliza en Vanilla en varios comandos que aceptan argumentos de componentes como `/tellraw`. A continuación se muestra un ejemplo sencillo de este formato.
```json
{
  "text": "Este es el componente principal; su estilo se aplica a todos sus elementos secundarios.\n",
  "color": "#438df2",
  "bold": true,
  "extra": [
    {
      "text": "Este es el primer elemento secundario, que se muestra después del principal",
      "underlined": true,
      // Esto sobrescribe el valor "bold" del componente principal solo para este componente.
      "bold": false
    },
    {
      // Este componente de tecla rápida muestra la tecla que el cliente tiene asignada a esa acción.
      "keybind": "key.inventory"
    }
  ]
}
```

:::note[Documentación detallada]
El formato JSON está completamente documentado en [Minecraft Wiki](https://minecraft.wiki/w/Text_component_format).
:::

:::tip
Existen herramientas en línea para facilitar mucho la generación de este formato, como [JSON Text Generator](https://minecraft.tools/en/json_text.php).
:::
## Serializadores

Paper y Velocity vienen con diferentes serializadores para convertir entre [](jd:adventure:net.kyori.adventure.text.Component) y otras formas de texto serializado.

### [`GsonComponentSerializer`](jd:adventure:net.kyori.adventure.text.serializer.gson:module-summary)

Convierte entre cadenas con formato `Component` y JSON con métodos convenientes para tratar directamente con [`JsonElement`](https://javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/JsonElement.html) de Gson. Esta conversión no produce pérdidas y es la forma preferida de serialización para componentes que los usuarios no necesitan editar con regularidad.

### [`MiniMessage`](jd:adventure:net.kyori.adventure.text.minimessage:module-summary)

Convierte entre `Component` y una cadena con formato MiniMessage. Esta conversión no produce pérdidas y es la forma preferida de serialización para componentes que los usuarios deben editar. También existe una amplia personalización que puede agregar al serializador, que está [documentada aquí](/es/adventure/minimessage/api#getting-started).

### [`PlainTextComponentSerializer`](jd:adventure:net.kyori.adventure.text.serializer.plain:module-summary)

Serializa un `Component` en una cadena de texto sin formato. Esto genera muchas pérdidas ya que toda la información de estilo, así como la mayoría de los otros tipos de componentes, perderán información. Puede haber un manejo especial para que los [](jd:adventure:net.kyori.adventure.text.TranslatableComponent)s se serialicen en un idioma predeterminado, pero generalmente esto no debe usarse excepto en ciertas circunstancias, como iniciar sesión en un archivo de texto.

### [`LegacyComponentSerializer`](jd:adventure:net.kyori.adventure.text.serializer.legacy:module-summary)
:::caution
No se recomienda su uso ya que el formato heredado puede eliminarse en el futuro.
:::
Convierte entre `Component` y el formato de cadena heredado. Esta conversión genera muchas pérdidas ya que los tipos de componentes y eventos no tienen una representación de cadena heredada.

Un caso de uso más útil es convertir texto heredado al formato MiniMessage en un proceso de migración.
```java
final String legacyString = ChatColor.RED + "Esta es una " + ChatColor.GOLD + "cadena heredada";

// Pasa la cadena heredada por dos serializadores para convertirla de legacy a MiniMessage.
final String miniMessageString = MiniMessage.miniMessage().serialize(
    LegacyComponentSerializer.legacySection().deserialize(legacyString)
);
```

:::note
Hay 2 serializadores heredados integrados, uno que trata con símbolos `§` y el otro con símbolos `&`. Tienen sus propias instancias disponibles a través de [](jd:adventure:net.kyori.adventure.text.serializer.legacy:net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer#legacySection()) y [](jd:adventure:net.kyori.adventure.text.serializer.legacy:net.kyori.adventure.text.serializer.legacy.LegacyComponentSerializer#legacyAmpersand()).
:::
