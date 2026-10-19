---
title: Implementar plataformas
slug: es/adventure/platform/implementing
description: Implementación de Adventure para tu propia plataforma.
---

La mayoría de los usuarios consultará aquí información sobre implementaciones de plataformas existentes, pero esta página también está dirigida a quienes quieran crear sus propias integraciones de plataforma.

Aunque en esencia Adventure «solo» proporciona estructuras de datos y serializadores, la evolución del juego y la incorporación de nuevas funciones requieren más opciones ajustables y puntos de extensión de plataforma
para generar la salida correcta para cada versión del juego. Esto ha llevado a introducir varios servicios que las plataformas pueden implementar mediante el mecanismo
`ServiceLoader` de Java. También se esperan algunos comportamientos por convención. Como no hay muchas plataformas que se integren con Adventure, esta página intenta
cubrir los aspectos comunes. No dudes en hacernos preguntas; podemos completar esta página entre todos.

## Servicios

### Servicios `ComponentSerializer`

La mayoría de los serializadores (Gson, antiguo, etc.) tienen SPI `Provider` que permiten personalizar su comportamiento predeterminado. Son especialmente útiles para Gson y otros serializadores JSON,
cuyas estructuras de datos han cambiado con el tiempo, aunque también puede interesar consultar las opciones del serializador antiguo. Consulta los Javadocs de cada serializador para obtener más información.

En los subtipos de `JSONComponentSerializer`, hemos intentado agrupar las opciones ajustables pertinentes en un único sistema, identificado por la
[data version](https://minecraft.wiki/w/Data_version). Para gestionar eventos de desplazamiento en versiones del juego anteriores a 1.16, existe la interfaz adicional `LegacyHoverEventSerializer`.
Ofrecemos una implementación que usa `adventure-nbt` como submódulo independiente, aunque las plataformas pueden preferir una biblioteca NBT nativa.
Ambas opciones deben configurarse en los constructores de la implementación `Provider` correspondiente.

### Valores de componentes de datos

Para almacenar datos específicos de la plataforma en eventos de desplazamiento `show_item`, exponemos objetos de datos opacos en la API. Las plataformas deben proporcionar la lógica de conversión entre implementaciones
mediante una implementación de `DataComponentValueConverterRegistry.Provider`. En general, solo hay que convertir entre tipos específicos de la plataforma
y los tipos genéricos `TagSerializable` y `Removed`, pero las plataformas deben incluir conversores a `GsonDataComponentValue` (tanto desde los tipos de la plataforma
*como* desde el tipo genérico `TagSerializable`, que requiere analizar SNBT para realizar la conversión).

### Devoluciones de llamada de clic

Como las devoluciones de llamada son una función muy solicitada, Adventure proporciona un tipo de evento de clic «virtual» para funciones de devolución de llamada. Esta acción no persiste entre ejecuciones y requiere
que las plataformas registren un comando que active la ejecución de las devoluciones de llamada. Esto se implementa mediante el SPI `ClickCallback.Provider`. El comando no debe enviarse como parte del
árbol de comandos que reciben los clientes para evitar saturarlos.

Las plataformas que implementen el proveedor de devoluciones de llamada de clic deben registrar el comando en el momento adecuado y mantener un registro de devoluciones de llamada activas, al que se añada cada una cuando se solicite un
comando de devolución de llamada. La plataforma es responsable de garantizar las condiciones de ejecución e implementar los efectos de cualquier `Option` que se establezca en la devolución de llamada.

### Registro de componentes

`ComponentLogger`, como parte del módulo `adventure-text-logger-slf4j`, proporciona una interfaz de registro que amplía SLF4J y envuelve cualquier registrador SLF4J existente (compatible con
las versiones 1 y 2). Las plataformas deben proporcionar el adaptador que busca el registrador adecuado por nombre y serializa los componentes a texto.

Esto debe incluir las traducciones que sean necesarias. De forma predeterminada, el registrador serializa a texto sin formato, pero las plataformas pueden usar el serializador
[ANSI](/es/adventure/serializer/ansi) para obtener una salida en color.

### Barras de jefe

Las barras de jefe son algo complicadas desde el punto de vista operativo. Como son uno de los pocos elementos de la biblioteca que mantienen un estado mutable, deben volver a sincronizar con sus destinatarios todos los cambios de estado.
Para hacer un seguimiento de los destinatarios y vincularlos con el estado interno, el SPI `BossBarImplementation.Provider` permite que las plataformas proporcionen sus propios puntos de implementación para cada barra.

## Comportamientos convencionales

Además de lo que se exige explícitamente al implementar determinadas interfaces, se espera que las plataformas sigan algunos comportamientos:

* Al implementar `Audience`, las operaciones no admitidas deben fallar silenciosamente.
* Antes de enviar componentes a un jugador, deben pasar por `GlobalTranslator` para realizar las traducciones que correspondan (nota: `GlobalTranslator` solo sirve para
  las traducciones personalizadas; no debe contener las traducciones de paquetes de recursos vanilla, que usan una sintaxis de interpolación distinta a la de `GlobalTranslator`).
* No hay una lista obligatoria de módulos de Adventure que debas distribuir con tu plataforma, pero recomendamos `adventure-api`, `adventure-text-minimessage`,
  `adventure-text-logger-slf4j` y los serializadores que necesite la integración. En concreto, no recomendamos distribuir el módulo
  `adventure-text-serializer-legacy`, salvo que sea necesario para mantener la compatibilidad con versiones anteriores de tu plataforma.
