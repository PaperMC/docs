---
title: Sonido
slug: es/adventure/sound
description: Guía para reproducir sonidos con Adventure.
---

Adventure incluye una API para reproducir cualquier sonido integrado o proporcionado por un paquete de recursos. Ten en cuenta que
no todas las plataformas implementan la reproducción de sonido.

## Crear un sonido

Los sonidos se componen de:
  * Una `Key` (también conocida como `Identifier` o `ResourceLocation`) que determina qué sonido se reproduce. Se pueden usar sonidos personalizados de cualquier paquete de recursos. Si el cliente no reconoce un sonido, lo ignorará (aunque mostrará una advertencia en el registro del cliente).
  * Una fuente de sonido, que indica al cliente qué tipo de sonido escucha. Los ajustes de sonido del cliente también se asocian a una fuente.
  * Un número que determina el radio en el que se puede oír el sonido
  * Un número de 0 a 2 que determina el tono del sonido

**Ejemplos:**

```java
// Crear un sonido integrado con el volumen y el tono estándar
Sound musicDisc = Sound.sound(Key.key("music_disc.13"), Sound.Source.MUSIC, 1F, 1F);

// Crear un sonido del paquete de recursos con un tono más alto
Sound myCustomSound = Sound.sound(Key.key("adventure", "rawr"), Sound.Source.AMBIENT, 1F, 1.1F);
```

## Reproducir un sonido

:::caution

El cliente puede reproducir varios sonidos a la vez, pero desde la versión 1.16 el límite es de 8 sonidos simultáneos.

En las versiones 1.15.2-1.16.5, debido a [`MC-138832`](https://mojira.dev/MC-138832), se ignoran el volumen y el tono de los sonidos reproducidos con un emisor.

Como se documenta en [`MC-146721`](https://mojira.dev/MC-146721), los sonidos estéreo no se reproducen en una posición concreta ni siguen a una entidad; por ello, se ignoran los parámetros de ubicación o emisor.

:::

Una vez creado el sonido, puedes reproducirlo para una audiencia mediante varios métodos:

```java
// Reproducir un sonido en la ubicación de la audiencia
audience.playSound(sound);

// Reproducir un sonido en una ubicación concreta
audience.playSound(sound, 100, 0, 150);

// Reproducir un sonido que siga al miembro de la audiencia
audience.playSound(sound, Sound.Emitter.self());

// Reproducir un sonido que siga a otro emisor (normalmente, una entidad)
audience.playSound(sound, someEntity);
```

## Detener sonidos

La detención de sonidos detiene los sonidos seleccionados, desde todos los que reproduce el cliente hasta sonidos concretos identificados por nombre.

```java
public void stopMySound(final Audience target) {
  // Detener un sonido para el destinatario
  target.stopSound(SoundStop.named(Key.key("music_disc.13")));
  // Detener todos los sonidos del clima para el destinatario
  target.stopSound(SoundStop.source(Sound.Source.WEATHER));
  // Detener todos los sonidos para el destinatario
  target.stopSound(SoundStop.all());
}
```

Los objetos para detener sonidos se pueden crear con los métodos del ejemplo anterior.
También pueden construirse directamente a partir de un sonido.

```java
// Obtener una instrucción para detener un sonido concreto
mySound.asStop();

// También se pueden detener sonidos directamente con el método stopSound
audience.stopSound(mySound);
```

## Crear un sonido personalizado

Usa el archivo `sounds.json` para definir sonidos en un paquete de recursos. Encontrarás más información sobre estos límites en [Minecraft Wiki](https://minecraft.wiki/w/Sounds.json).
