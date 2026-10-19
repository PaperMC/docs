---
title: Migrar de Adventure 4.x a 5.x
slug: es/adventure/migration/adventure-4.x
description: Migración de Adventure 4.x a 5.x.
---

Con el lanzamiento de Adventure 5.0, se han introducido algunos cambios incompatibles con la serie Adventure 4.x.
Esta página documenta los cambios y explica cómo puedes migrar tu código.

## Una base de código moderna

Uno de los principales objetivos de Adventure 5.0 era migrar a una base de código más moderna.
Ahora se requiere como mínimo Java 21 para usar Adventure.

Al actualizar a Java 21, Adventure ha aprovechado las clases y las interfaces selladas.
Casi todas las interfaces y clases anotadas con `@ApiStatus.NonExtendable` ahora son selladas.
Esto significa que ya no puedes extender estas clases, aunque no deberías haberlo hecho de todos modos.
Un uso incorrecto relativamente común era crear implementaciones personalizadas de `Component`.
Ahora ya no es posible; en su lugar, debes usar la API `VirtualComponent`.

Otro efecto de la modernización de la base de código es que se ha eliminado el módulo `adventure-extra-kotlin`.
En el futuro, se volverá a introducir en un repositorio independiente como un nuevo módulo.
Esto permitirá más flexibilidad para adaptarse a las actualizaciones más frecuentes de Kotlin.

También se ha eliminado el módulo `adventure-text-serializer-gson-legacy-impl`.
Se ha reemplazado por el módulo independiente de la implementación `adventure-text-serializer-json-legacy-impl`.

Por último, Adventure ahora incluye archivos `module-info.java` adecuados para quienes usan el sistema de módulos de Java 9 o posterior.

## Dependencias actualizadas

Se han actualizado muchas dependencias sin cambios incompatibles.
A continuación se documentan algunos cambios importantes o incompatibles.

Adventure ha migrado a JSpecify para las anotaciones de nulabilidad.
Se aplican a nivel de paquete o clase, así que, salvo que se indique lo contrario, todo debe considerarse no nulo.

Como la mayor parte de la implementación interna de Adventure ahora usa records, ya no necesitamos la biblioteca Examination para generar `toString`.
Examination se ha eliminado por completo de Adventure y ya no es una dependencia transitiva.

El módulo `adventure-text-logger-slf4j` se ha actualizado para usar SLF4J 2.0.

La biblioteca GSON se ha actualizado a 2.13.2.
Aunque esta versión es posterior a la que se usa en la mayoría de las versiones de Minecraft compatibles con Adventure, no tenemos intención de dejar de admitir esas versiones antiguas.
Procuraremos no usar funciones nuevas de GSON que interrumpan la compatibilidad con las versiones antiguas de GSON usadas en versiones anteriores de Minecraft.

## Cambios incompatibles

### Cambios en los eventos de clic

La clase `ClickEvent` ahora es una interfaz tipada.
El argumento de tipo de este evento de clic es el tipo de carga.
Esto no cambia la forma de construir eventos de clic, pero facilita la serialización y la deserialización.

Este cambio también se aplica a `ClickEvent$Action`, que ya no es un enum, sino una interfaz tipada.

Además, el campo `nbt` de las cargas personalizadas de eventos de clic ahora admite valores nulos.
Esto permite crear eventos de clic personalizados sin NBT y se ajusta mejor al comportamiento de Minecraft vanilla.

### Cambios en el renderizador de componentes

Con la incorporación del nuevo componente de objeto, la interfaz `AbstractComponentRenderer` se ha actualizado para incluir un método que renderiza componentes de objeto.
Este es un cambio incompatible, ya que será necesario implementar el método.
En adelante, añadiremos métodos a esta clase cada vez que Mojang incorpore nuevos tipos de componentes.
Este cambio incompatible se documenta en los Javadocs de `AbstractComponentRenderer`.

### Sellado de la interfaz `TextFormat`

Aunque nunca se recomendó extender `TextFormat`, antes era posible hacerlo.
La API ya no lo permite y la interfaz ahora es sellada.
Si extendías esta interfaz, considera extender `StyleBuilderApplicable`, una alternativa más potente y ampliamente utilizada.

### Cambios en los tipos de chat

Debido a cambios en el sistema de chat, especialmente en la creación de tipos de chat dinámicos, es posible que los tipos de chat no tengan una clave.
Por este cambio interno, `ChatType#key` ahora admite valores nulos.
Además, la clase ya no implementa `Keyed`.

## Eliminación de métodos y clases obsoletos

Se han marcado como obsoletos varios métodos y clases a lo largo de la serie Adventure 4.x.
En esta sección se documentan las eliminaciones realizadas y cómo puedes migrar el código, si corresponde.

* **Se ha eliminado `BuildableComponent`.**\
  Ahora puedes obtener un `ComponentBuilder` directamente de un `Component` mediante `Component#toBuilder`.
  Un efecto incompatible de este cambio es que `NBTComponent` ahora solo acepta un argumento de tipo, en lugar de dos.
* **Se han eliminado los métodos antiguos para firmar o identificar mensajes de chat.**\
  Aunque las versiones antiguas todavía usan estas funciones, su uso no era lo bastante extendido como para justificar que siguieran en Adventure.
  En general, si tienes previsto enviar mensajes identificados o de chat, debes migrar a los mensajes firmados.
  * **Se ha eliminado por completo el enum `MessageType`.**\
    Ahora los mensajes de chat se identifican al enviar un mensaje firmado.
    Todos los demás mensajes son mensajes del sistema.
  * **Se han eliminado todos los métodos `Audience#sendMessage` que aceptan `Identity` o `Identified`.**\
    En su lugar, es preferible enviar mensajes firmados.
* **Se ha eliminado el porcentaje de la barra de jefe.**\
  Esto incluye las constantes de porcentaje máximo y mínimo y los métodos para cambiar u obtener el porcentaje.
  En su lugar, debes usar las constantes y los métodos de progreso.
* **Se han eliminado los métodos estáticos del estilo `of`.**\
  Estos métodos llevaban tiempo marcados como obsoletos y cada uno tiene alternativas con nombre.
* **Se han eliminado los datos de carga personalizados de eventos de clic.**\
  Como las cargas personalizadas de clic contienen NBT, debes usar el método `nbt`.
  Esto incluye los métodos constructores de eventos de clic personalizados que aceptan cadenas en lugar de NBT.
* **Se ha eliminado `ClickEvent#create(Action, String)`.**\
  Como los eventos de clic ahora pueden contener datos distintos de cadenas, se ha eliminado este método.
  Si lo usabas, migra al método `create` que acepta una carga o usa los métodos de construcción directa (por ejemplo, `ClickEvent#openUrl(String)`).
* **Se ha eliminado `ClickEvent#value`.**\
  Como se ha indicado, los eventos de clic ahora pueden contener datos distintos de cadenas.
  Por tanto, este método se ha eliminado en favor del método `payload`.
* **Se ha eliminado `AbstractComponent`.**\
  Como esta clase era principalmente un detalle de implementación, se ha eliminado sin reemplazo.
* **Se ha eliminado la combinación de componentes sin constructor.**\
  Esto incluye la familia de métodos `Component#join` que no acepta un `JoinConfiguration`.
  En su lugar, debes usar `Component#textOfChildren` o los métodos `join` que aceptan un `JoinConfiguration`.
* **Se ha eliminado `Component#detectCycle(Component)`.**\
  Como los componentes son inmutables, este método no es necesario y se ha eliminado sin reemplazo.
* **Se ha eliminado el reemplazo de texto de componentes sin constructor.**\
  Esto incluye la familia de métodos `Component#replace[First]Text` que no acepta un `TextReplacementConfig`.
  En su lugar, debes usar los métodos `replaceText` que aceptan un `TextReplacementConfig`.
* **Se ha eliminado `TranslationRegistry`.**\
  Los registros se han reemplazado por `TranslationStore`, que ofrece más funciones.
  Consulta los métodos estáticos de `TranslationStore` para encontrar una alternativa compatible.
* **Se ha eliminado `JSONComponentConstants`.**\
  Se ha reemplazado por `ComponentTreeConstants`, del módulo `adventure-text-serializer-commons`.
* **Se ha eliminado `PlainComponentSerializer`.**\
  Se ha reemplazado por la clase equivalente `PlainTextComponentSerializer`.
* **Se ha eliminado `ClickEvent$Action#payloadType`.**\
  Como las acciones de eventos de clic ahora están tipadas, este campo ya no es necesario.
* **Se ha eliminado `UTF8ResourceBundleControl`.**\
  Desde Java 9, los paquetes de recursos se cargan con UTF-8 de forma predeterminada.
  Por tanto, esta clase ya no es necesaria.
  En lugar de esta clase, puedes cargar archivos de propiedades sin un control de paquetes de recursos.
* **Se han eliminado métodos de `GSONComponentSerializer`.**\
  Desde que se añadió el sistema de opciones para personalizar los serializadores JSON, se eliminaron las opciones `downsampleColors` y `emitLegacyHoverEvent` de `GSONComponentSerializer`.
  En su lugar, debes usar los campos `EMIT_RGB` y `EMIT_HOVER_EVENT_TYPE` de `JSONOptions`, respectivamente.
  Además, se eliminó `legacyHoverEventSerializer`, que acepta un `LegacyHoverEventSerializer` del módulo GSON, en favor de la alternativa genérica del módulo JSON.
* **Se han corregido errores tipográficos.**\
  Se han eliminado algunos métodos con nombres mal escritos, como `Argument#numeric` y `ComponentSerializer#deseializeOrNull`.
  Estos métodos estaban obsoletos y sus alternativas con la ortografía correcta ya estaban disponibles desde hacía tiempo.
