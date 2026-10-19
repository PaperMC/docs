---
title: Adaptar tu plugin desde Velocity 1.x.x
description: Cómo adaptar tu plugin de Velocity 1.x.x a la API moderna.
slug: es/velocity/dev/porting-plugins-from-velocity-1
---

Velocity 3.0.0 incluye cambios importantes en la API respecto a la serie Velocity 1.x.x. **Lee este
documento con mucha atención**.

## Aumento de la versión mínima de Java admitida

Velocity 4.0.x y posteriores ahora requieren Java 25 o posterior.

## Eliminación de dependencias heredadas

Eliminamos toda la compatibilidad con la antigua biblioteca `text` 3. Para `text` 3.x.x (y todas las API que dependen
de ella), hay equivalentes directos en [Adventure](/es/adventure/), que se
introdujo en Velocity 1.1.0.

`toml4j`, obsoleta en Velocity 1.1.0 porque ya no se mantiene, no se ha eliminado para
dar más tiempo a los plugins para migrar a Configurate. Sin embargo, deberías prepararte para cambiar a
Configurate o incluir `toml4j` directamente en tu plugin.

## Nuevo sistema asíncrono de eventos

Velocity 3.0.0 incluye una adaptación retroactiva del sistema de eventos de Velocity Polymer, que difiere del sistema de eventos de Velocity
1.x.x en varios aspectos. El modelo de eventos de Velocity 1.x.x obligaba a ejecutar todos los eventos
de forma asíncrona en un grupo de hilos de tamaño fijo, un modelo que con el tiempo ha demostrado ser deficiente.

Los manejadores de eventos existentes seguirán funcionando sin cambios en Velocity 3.0.0, ya que se supone que todos son manejadores bloqueantes asíncronos de forma predeterminada. Sin embargo, se han introducido nuevas API
para gestionar continuaciones; consulta la [página de la API de eventos](/es/velocity/dev/event-api) para obtener
más información. Aun así, te recomendamos migrar tus suscriptores de eventos al nuevo modelo de la API.
