---
title: Usar el planificador
description: Guía de la API Scheduler de Velocity para programar tareas.
slug: es/velocity/dev/scheduler-api
---

El planificador de Velocity te permite decidir cuándo y cómo se ejecutan las tareas del plugin, y controlar su ejecución con precisión.
Velocity no tiene un hilo principal, así que todas las tareas que programas con su planificador se
ejecutan de forma asíncrona.

## Ejecutar una tarea con retraso

Para programar una tarea, usa el [`TaskBuilder`](jd:velocity:com.velocitypowered.api.scheduler.Scheduler$TaskBuilder)
que devuelve [](jd:velocity:com.velocitypowered.api.scheduler.Scheduler).
Este constructor fluido permite encadenar métodos para configurar la tarea.

```java
server.getScheduler()
  .buildTask(plugin, () -> {
    // Escribe aquí el código que quieras ejecutar.
  })
  .delay(2L, TimeUnit.SECONDS)
  .schedule();
```

Aquí programamos una tarea para que se ejecute dentro de 2 segundos. Velocity necesita la instancia de tu
plugin, `plugin` en el ejemplo anterior. Si programas la tarea desde la clase principal de tu plugin, basta con usar
`this`.

Los intervalos de tiempo se especifican como un `long` junto con un [](jd:java:java.util.concurrent.TimeUnit).
El uso de unidades de tiempo hace que la programación de tareas con retraso sea más legible y permite mayor precisión.
`2L, TimeUnit.SECONDS` es mucho más fácil de entender que el ambiguo `2000L`.

También puedes usar un [](jd:java:java.time.Duration) para indicar los intervalos,
por ejemplo: `Duration.ofSeconds(5L)`.

## Ejecutar una tarea repetitiva

Crear una tarea repetitiva es parecido a crear una tarea con retraso, pero también debes especificar
[`repeat(long, TimeUnit)`](jd:velocity:com.velocitypowered.api.scheduler.Scheduler$TaskBuilder#repeat(long,java.util.concurrent.TimeUnit)).
Este ejemplo se repetirá cada 5 minutos.

```java
server.getScheduler()
  .buildTask(plugin, () -> {
    // Escribe aquí el código que quieras ejecutar.
  })
  .repeat(5L, TimeUnit.MINUTES)
  .schedule();
```

## Ejecutar una tarea de inmediato

Las tareas usan el grupo de hilos en caché del planificador, que reutiliza los hilos. Para aprovechar
este grupo y ejecutar una tarea asíncrona de inmediato, omite las llamadas a los métodos _delay_
y _repeat_ de `TaskBuilder`.

## Cancelación

El método [`schedule()`](jd:velocity:com.velocitypowered.api.scheduler.Scheduler$TaskBuilder#schedule())
devuelve un [](jd:velocity:com.velocitypowered.api.scheduler.ScheduledTask),
que se puede usar para cancelar la tarea mediante el método
[`cancel()`](jd:velocity:com.velocitypowered.api.scheduler.ScheduledTask#cancel()).
No puedes reactivar una tarea después de cancelarla.

Además, [`task.status()`](jd:velocity:com.velocitypowered.api.scheduler.ScheduledTask#status())
devuelve el estado actual de la tarea.

```java
ScheduledTask task = server.getScheduler()
  .buildTask(plugin, () -> {
    // Escribe aquí el código que quieras ejecutar.
  })
  .repeat(5L, TimeUnit.MINUTES)
  .schedule();
// ...
task.cancel();
// ...
System.out.println(task.status());
```

También puedes programar tareas que se _cancelen automáticamente_ mediante un `Consumer<ScheduledTask>`.

```java
AtomicInteger integer = new AtomicInteger(0);

ScheduledTask task = server.getScheduler()
  .buildTask(plugin, (selfTask) -> {
    // Por ejemplo, escribe aquí el código que quieras ejecutar.
    if (integer.addAndGet(1) > 10) {
      selfTask.cancel();
    }
  })
  .repeat(Duration.ofSeconds(4L))
  .schedule();
```

## Obtener las tareas de un plugin

Puedes obtener todas las tareas programadas por un plugin mediante
[`tasksByPlugin(Object)`](jd:velocity:com.velocitypowered.api.scheduler.Scheduler#tasksByPlugin(java.lang.Object)).

```java
Collection<ScheduledTask> tasks = server.getScheduler().tasksByPlugin(plugin);
// Después puedes controlarlas; por ejemplo, cancelar todas las tareas programadas por un plugin.
for (ScheduledTask task : tasks) {
  task.cancel();
}
```
