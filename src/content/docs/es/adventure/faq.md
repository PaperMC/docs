---
title: Preguntas frecuentes
slug: es/adventure/faq
description: Preguntas frecuentes.
---

Hemos observado que hay algunos problemas que se presentan con relativa frecuencia al usar la biblioteca Adventure en ciertos contextos. Puede que no estén directamente relacionados con Adventure, pero publicamos aquí estas respuestas para quienes las necesiten:

## ¿Por qué el texto descriptivo aparece en cursiva?

Los componentes heredan el estilo de su componente padre. Por ejemplo, en el siguiente fragmento de código, cada palabra será roja, aunque el color rojo no se establezca explícitamente en el componente añadido: `text("hi", RED).append(text("also red!"))`.

En Minecraft vanilla, algunos lugares donde se muestran componentes tienen estilos propios. Por ejemplo, el texto descriptivo tiene un estilo padre que pone todo el texto en cursiva. Por tanto, si no quieres que los componentes de la descripción aparezcan en cursiva, debes establecer italic en false. El método `Component.decorationIfAbsent()` permite aplicarlo a componentes existentes sin sobrescribir el formato establecido explícitamente por los usuarios.

## ¿No se envían los mensajes? ¿No funcionan los colores hexadecimales? ¿No aparecen los eventos? ¿Hay problemas con las fuentes?

- Prueba con un cliente vanilla, sin mods ni paquetes de recursos. Los clientes modificados (como Badlion), los mods del cliente e incluso los paquetes de recursos pueden interrumpir muchos elementos del formato JSON moderno del chat y alterar los paquetes de chat entrantes, lo que provoca numerosos problemas.
- Prueba sin otros plugins o mods. Si otro plugin o mod modifica los paquetes salientes o el formato de los mensajes del chat, puede eliminar el formato de los mensajes que envías. Prueba sin otros plugins para comprobar si alguno causa el problema.
- Para los colores RGB, prueba con un cliente de la versión *1.16* o posterior. Mojang añadió compatibilidad con RGB en esa versión. El formato JSON de los mensajes ha evolucionado y ha incorporado muchas funciones desde su introducción hace ya muchos años. Consulta el historial completo de versiones en [Minecraft Wiki](https://minecraft.wiki/w/Text_component_format).

## ¿Cómo puedo admitir tanto MiniMessage como el formato antiguo (códigos §)?

Si tienes texto con formato antiguo en archivos de configuración u otros lugares, te recomendamos migrarlo una sola vez: usa el deserializador antiguo para convertirlo en un componente y luego MiniMessage para serializarlo al formato MiniMessage adecuado.

No existe —ni existirá— una forma funcional, recomendada o compatible de usar MiniMessage y los códigos de color antiguos a la vez. Ni siquiera funcionan las técnicas sencillas de buscar y reemplazar, pues no tienen en cuenta las particularidades del reinicio de estilos en el formato antiguo.

## ¿Cómo puedo usar PlaceholderAPI de Bukkit en mensajes MiniMessage?

MiniMessage no admite los marcadores de posición de PlaceholderAPI. Sin embargo, puedes crear fácilmente un resolvedor de etiquetas personalizado para permitir que se usen esos marcadores en cadenas MiniMessage, como en el siguiente ejemplo:

<details>
  <summary>Ejemplo</summary>
  Método de ejemplo para crear un marcador de posición MiniMessage que analice marcadores de PlaceholderAPI para un jugador.

  La etiqueta añadida tiene el formato `<papi:[papi_placeholder]>`. Por ejemplo, `<papi:luckperms_prefix>`.

  Agradecimientos a `mbaxter`.

  ```java
  /**
  * Crea un resolvedor de etiquetas capaz de resolver etiquetas de PlaceholderAPI para un jugador.
  *
  * @param player el jugador
  * @return el resolvedor de etiquetas
  */
  public TagResolver papiTag(final Player player) {
      return TagResolver.resolver("papi", (argumentQueue, context) -> {
          // Obtener el marcador de posición de texto que se quiere usar.
          final String papiPlaceholder = argumentQueue.popOr("papi tag requires an argument").value();

          // Pedir a PAPI que analice el marcador de posición para el jugador indicado.
          final String parsedPlaceholder = PlaceholderAPI.setPlaceholders(player, '%' + papiPlaceholder + '%');

          // Convertir esta cadena antigua, poco práctica, en un componente.
          final Component componentPlaceholder = LegacyComponentSerializer.legacySection().deserialize(parsedPlaceholder);

          // Por último, devolver la instancia de etiqueta que insertará el marcador.
          return Tag.selfClosingInserting(componentPlaceholder);
      });
  }
  ```
</details>

## ¿Por qué aparece un `NoSuchFieldError`, `NoSuchMethodError`, `ClassNotFoundException` o similar al actualizar o usar `adventure-platform-*`, `adventure-text-minimessage`, `adventure-api` u otras bibliotecas o herramientas relacionadas?

En el caso de `adventure-platform-fabric`, asegúrate de incluir correctamente el mod mediante `include()`. Para las implementaciones de plataformas antiguas, asegúrate de sombrear y reubicar correctamente las dependencias correspondientes. Entre los problemas concretos se incluyen:

- No sombrear la versión correcta de `adventure-api`. Comprueba el árbol de dependencias para averiguar por qué tu herramienta de compilación no incluye la versión correcta de la API, compatible con la versión de plataforma que usas.
- No reubicar las dependencias. Si ejecutas la aplicación en una plataforma que incluye una versión anterior de la API, o si otro mod o plugin tampoco reubica correctamente sus dependencias, acabarás usando su versión desactualizada de la API y se producirán errores.
- Compilar o ejecutar contra una implementación nativa de `adventure-api`. Si la plataforma incluye una versión antigua de la API, la biblioteca podría depender de funciones nuevas que no están disponibles en esa versión; por ello, no encontrará esos métodos y generará errores.
- Reubicar `adventure-api` e intentar usar métodos nativos o de bibliotecas. Si reubicas la API, no podrás usar métodos que dependan de ella en implementaciones nativas o bibliotecas, porque las firmas de los métodos serán distintas. Sombrea y reubica ese software o no uses métodos nativos. También puedes sombrear y reubicar una biblioteca y seguir usando la API, siempre que solo reubiques los paquetes que estás sombreando.

Consulta la documentación de tu herramienta de compilación para obtener más información sobre cómo sombrear, reubicar y administrar dependencias. No ofrecemos asistencia individual para este tipo de problemas: hay demasiadas variables específicas de cada proyecto como para aislarlos con facilidad.
