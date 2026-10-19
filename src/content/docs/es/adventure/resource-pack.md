---
title: Paquetes de recursos
slug: es/adventure/resource-pack
description: Guía para usar paquetes de recursos con Adventure.
---

Además de los paquetes de recursos que cada jugador controla en su cliente, el juego permite que los servidores envíen a los clientes URL de paquetes de recursos que los jugadores pueden aceptar. Esto permite a los servidores ofrecer estilos personalizados.

Al principio solo se podía enviar un paquete de recursos, pero desde *Minecraft 1.20.3* el servidor puede enviar varios paquetes para apilarlos y, si hace falta, quitarlos individualmente.

## Enviar paquetes de recursos

Un paquete de recursos se identifica mediante:
  * su UUID
  * un URI al archivo ZIP del paquete de recursos
  * el hash SHA-1 del archivo ZIP del paquete de recursos, como cadena hexadecimal

Esto se conoce como `ResourcePackInfo`.

Cada lote de paquetes de recursos que se envía mediante un `ResourcePackRequest` incluye:
  * uno o más paquetes de recursos
  * una devolución de llamada para realizar acciones según las respuestas del cliente
  * una opción para reemplazar los paquetes existentes proporcionados por el servidor o apilar encima los más recientes
  * si estos paquetes de recursos son obligatorios
  * un mensaje para mostrar al usuario si aún no ha decidido si permite los paquetes de recursos del servidor

## Ejemplos

Envía a un cliente un único paquete de recursos obligatorio, con un UUID calculado a partir de su nombre.

```java
private static final ResourcePackInfo PACK_INFO = ResourcePackInfo.resourcePackInfo()
  .uri(URI.create("https://example.com/resourcepack.zip"))
  .hash("2849ace6aa689a8c610907a41c03537310949294")
  .build();

public void sendResourcePack(final Audience target) {
  final ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
    .packs(PACK_INFO)
    .prompt(Component.text("¡Descarga el paquete de recursos!"))
    .required(true)
    .build();

  // Enviar la solicitud del paquete de recursos a la audiencia destinataria
  target.sendResourcePacks(request);
}

public void sendOptionalResourcePack(final Audience target) {
  final ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
    .packs(PACK_INFO)
    .prompt(Component.text("¡Descarga el paquete de recursos!"))
    .required(false)
    .build();

  // Enviar la solicitud del paquete de recursos a la audiencia destinataria
  target.sendResourcePacks(request);
}
```

## Devoluciones de llamada

La función de devolución de llamada permite que los servidores respondan a la información sobre la descarga del paquete que envía el cliente. Las versiones más recientes del juego proporcionan más información sobre las distintas fases, pero todas ofrecen información básica sobre el estado de la descarga y la aplicación. Ten en cuenta que las respuestas dependen por completo del cliente, así que los clientes modificados pueden enviar información incorrecta (por ejemplo, indicar que se aplicó un paquete obligatorio cuando no es así), no enviar nada o enviar información incoherente (actualizaciones de estado después de recibir una actualización final). Por tanto, cualquier acción basada en una devolución de llamada debe diseñarse de forma defensiva para tolerar cualquier comportamiento del cliente.

En el caso de audiencias envolventes, la audiencia proporcionada en la devolución de llamada pretende ser exactamente la misma a la que se envió el paquete de recursos; cuando sea necesario, volverá a envolver cualquier valor subyacente devuelto.

## Quitar paquetes de recursos

Los paquetes de recursos se pueden quitar en cantidades determinadas mediante `Audience.removeResourcePacks()` o todos a la vez mediante `Audience.clearResourcePacks()`.

Los métodos para quitar paquetes tienen varias sobrecargas: permiten quitarlos usando únicamente un UUID o reutilizando las estructuras de datos usadas para aplicarlos.
