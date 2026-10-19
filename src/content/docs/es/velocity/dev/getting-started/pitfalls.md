---
title: Errores habituales
description: Cómo evitar errores habituales en Velocity.
slug: es/velocity/dev/pitfalls
---

Aunque intentamos que la API sea fácil de usar, presenta algunas particularidades que debes
conocer.

## Acceder a la API durante la construcción

En Velocity, la carga de plugins se divide en dos fases: construcción e inicialización. El código del
constructor de tu plugin forma parte de la fase de construcción. Hay muy pocas operaciones que puedas realizar de forma segura
durante la construcción, sobre todo porque la API no especifica cuáles lo son. En particular, no puedes registrar un suscriptor de eventos en el constructor, porque necesitas
que el plugin esté registrado, pero Velocity no puede registrarlo hasta que el plugin se haya
construido.

Para romper este ciclo, espera siempre a la inicialización, que se indica cuando Velocity
dispara [](jd:velocity:com.velocitypowered.api.event.proxy.ProxyInitializeEvent).
Puedes realizar operaciones durante la inicialización añadiendo un suscriptor para este evento, como se muestra a continuación.
Ten en cuenta que Velocity registra automáticamente la clase principal del plugin como suscriptor.

```java
@Subscribe
public void onProxyInitialization(ProxyInitializeEvent event) {
  // Realiza aquí una operación que requiera acceso a la API de Velocity.
  // Por ejemplo, podrías registrar un evento:
  server.getEventManager().register(this, new PluginListener());
}
```

## No todas las operaciones de Audience están disponibles

Actualmente, Velocity no admite todas las operaciones de Audience de la API de Adventure, así que estas operaciones deben gestionarse en el backend.
Además, reproducir sonidos se consideraba inviable en versiones anteriores a la 1.19.3; se necesita un registro de ID de sonido codificados.

| Operación                  | Compatible       |
| -------------------------- | -----------------|
| Mensajes del chat          | Sí               |
| Mensajes de barra de acción| Sí               |
| Títulos                    | Sí               |
| Barras de jefe             | Sí               |
| Encabezado y pie de la lista de jugadores | Sí               |
| Paquetes de recursos       | Sí               |
| Sonidos                    | Sí[^sounds-note] |
| Libros                     | No               |
| Diálogos                   | No               |

[^sounds-note]: Los sonidos solo funcionan en 1.19.3 o posterior y requieren un emisor ([](jd:adventure:net.kyori.adventure.sound.Sound$Emitter#self()) u otro jugador del mismo servidor). [](jd:velocity:com.velocitypowered.api.proxy.Player#playSound(net.kyori.adventure.sound.Sound)) no está implementado, ya que el contrato de Adventure requiere reproducir los sonidos en la posición actual del jugador.
