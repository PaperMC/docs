---
title: Programación de tareas
description: Guía para usar BukkitScheduler y ejecutar código en momentos específicos.
slug: es/paper/dev/scheduler
---

El [](jd:paper:org.bukkit.scheduler.BukkitScheduler) se puede utilizar para programar su código para que se ejecute más tarde o repetidamente.
:::note[Folia]
Esta guía está pensada para servidores Bukkit que no ejecutan Folia. Si usa Folia, debe utilizar sus planificadores correspondientes.
:::
## ¿Qué es un tick?

Cada juego ejecuta algo llamado bucle de juego, que esencialmente ejecuta toda la lógica del juego una y otra vez. Una única ejecución de ese bucle en Minecraft se llama "tick".

En Minecraft, hay 20 ticks por segundo o, en otras palabras, un tick cada 50 milisegundos. Esto significa que el bucle del juego se ejecuta 20 veces por segundo. Si un tick tarda más de 50 ms en ejecutarse, el servidor empieza a quedarse atrás.

Una tarea que debería ejecutarse después de 100 ticks se ejecutará después de 5 segundos (100 ticks/20 ticks por segundo = 5 segundos). Sin embargo, si el servidor solo se ejecuta a 10 ticks por segundo, una tarea programada para ejecutarse después de 100 ticks tardará 10 segundos.

### Conversión entre unidades humanas y ticks de Minecraft

Cada método del planificador que recibe un retraso o un período utiliza ticks como unidad de tiempo.

La conversión de unidades humanas a ticks y viceversa es tan simple como:
- `ticks = seconds * 20`
- `seconds = ticks / 20`

Puede hacer que su código sea más legible utilizando la enumeración [](jd:java:java.util.concurrent.TimeUnit), por ejemplo, para convertir 5 minutos a ticks y viceversa:
- `TimeUnit.MINUTES.toSeconds(5) * 20`
- `TimeUnit.SECONDS.toMinutes(ticks / 20)`

También puede utilizar la clase `Tick` de Paper para convertir entre unidades humanas y ticks. Por ejemplo, para convertir 5 minutos a ticks, `Tick.tick().fromDuration(Duration.ofMinutes(5))` producirá `6000` ticks.

## Obteniendo el planificador

Para obtener un planificador, puede utilizar el método [`getScheduler`](jd:paper:org.bukkit.Server#getScheduler()) de la clase [](jd:paper:org.bukkit.Server), por ejemplo, en su método `onEnable`:
```java
@Override
public void onEnable() {
    BukkitScheduler scheduler = this.getServer().getScheduler();
}
```
## Programación de tareas

Para programar una tarea es necesario aprobar:

- La instancia de tu complemento.
- El código a ejecutar, ya sea con un [](jd:java:java.lang.Runnable)
o <code>[Consumer](jd:java:java.util.function.Consumer)<[BukkitTask](jd:paper:org.bukkit.scheduler.BukkitTask)></code>
- El retraso en los ticks antes de que la tarea se ejecute por primera vez.
- El período en ticks entre cada ejecución de la tarea, si estás programando una tarea repetitiva

### Diferencia entre tareas sincrónicas y asincrónicas

#### Tareas sincrónicas (en el hilo principal)

Las tareas sincrónicas son tareas que se ejecutan en el hilo del servidor principal. Este es el mismo hilo que maneja toda la lógica del juego.

Todas las tareas programadas en el hilo principal afectarán el rendimiento del servidor. Si su tarea consiste en realizar solicitudes web, acceder a archivos, bases de datos u otras operaciones que requieren mucho tiempo, debería considerar el uso de una tarea asincrónica.

#### Tareas asincrónicas (fuera del hilo principal)

Las tareas asincrónicas son tareas que se ejecutan en subprocesos separados, por lo tanto, no afectarán directamente el rendimiento de su servidor.
:::caution
**Grandes partes de la API de Bukkit no son seguras de usar dentro de tareas asincrónicas**. Si un método cambia o accede al estado mundial, no es seguro utilizarlo desde una tarea asincrónica.
:::

:::note
Si bien las tareas se ejecutan en subprocesos separados, aún se inician desde el subproceso principal y se verán afectadas si el servidor está retrasado; un ejemplo sería 20 ticks que no equivalen exactamente a 1 segundo.

Si necesita un planificador que se ejecute independientemente del servidor, considere utilizar su propio [](jd:java:java.util.concurrent.ScheduledExecutorService). Puede seguir [esta guía](https://www.baeldung.com/java-executor-service-tutorial#ScheduledExecutorService) para aprender a utilizarlo.
:::
### Diferentes formas de programar tareas

#### Usando `Runnable`

La interfaz [](jd:java:java.lang.Runnable) se utiliza para las tareas más simples que no requieren una instancia [](jd:paper:org.bukkit.scheduler.BukkitTask).

Puede implementarlo en una clase separada, por ejemplo:
```java title="MyRunnableTask.java"
public class MyRunnableTask implements Runnable {

    private final MyPlugin plugin;

    public MyRunnableTask(MyPlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public void run() {
        this.plugin.getServer().broadcast(Component.text("Hello, World!"));
    }
}
```
```java
scheduler.runTaskLater(plugin, new MyRunnableTask(plugin), 20);
```
O utiliza una expresión lambda, ideal para tareas simples y cortas:
```java
scheduler.runTaskLater(plugin, /* Lambda: */ () -> {
    plugin.getServer().broadcast(Component.text("Hello, World!"));
}, /* End of the lambda */ 20);
```
#### Usando `Consumer<BukkitTask>`

La interfaz [](jd:java:java.util.function.Consumer) se utiliza para tareas que requieren una instancia [](jd:paper:org.bukkit.scheduler.BukkitTask) (normalmente en tareas repetidas), p. cuando quieras cancelar la tarea desde dentro del mismo.

Puede implementarlo en una clase separada de manera similar a `Runnable`, por ejemplo:
```java title="MyConsumerTask.java"
public class MyConsumerTask implements Consumer<BukkitTask> {

    private final UUID entityId;

    public MyConsumerTask(UUID entityId) {
        this.entityId = entityId;
    }

    @Override
    public void accept(BukkitTask task) {
        Entity entity = Bukkit.getServer().getEntity(this.entityId);

        if (entity instanceof LivingEntity livingEntity) {
            livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
            return;
        }

        task.cancel(); // La entidad ya no es válida; no tiene sentido seguir ejecutando esta tarea
    }
}
```
```java
scheduler.runTaskTimer(plugin, new MyConsumerTask(someEntityId), 0, 20);
```
O utilice una expresión lambda, que nuevamente es mucho más clara para tareas breves y simples:
```java
scheduler.runTaskTimer(plugin, /* Lambda: */ task -> {
    Entity entity = Bukkit.getServer().getEntity(entityId);

    if (entity instanceof LivingEntity livingEntity) {
        livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
        return;
    }

    task.cancel(); // La entidad ya no es válida; no tiene sentido seguir ejecutando esta tarea
} /* End of the lambda */, 0, 20);
```
##### Usando `BukkitRunnable`

[](jd:paper:org.bukkit.scheduler.BukkitRunnable) es una clase que implementa `Runnable` y contiene una instancia `BukkitTask`. Esto significa que no necesita acceder a la tarea desde el método `run()`, simplemente puede usar el método [`this.cancel()`](jd:paper:org.bukkit.scheduler.BukkitRunnable#cancel()):
```java title="CustomRunnable.java"
public class CustomRunnable extends BukkitRunnable {

    private final UUID entityId;

    public CustomRunnable(UUID entityId) {
        this.entityId = entityId;
    }

    @Override
    public void run() {
        Entity entity = Bukkit.getServer().getEntity(this.entityId);

        if (entity instanceof LivingEntity livingEntity) {
            livingEntity.addPotionEffect(new PotionEffect(PotionEffectType.SPEED, 20, 1));
            return;
        }

        this.cancel(); // La entidad ya no es válida; no tiene sentido seguir ejecutando esta tarea
    }
}
```
Esto simplemente agrega un efecto de poción hasta que la entidad muere.

#### Usando un retraso de 0 ticks

Un retraso de 0 ticks se considera como si desea ejecutar la tarea en el siguiente tick. Si programa una tarea con un retraso de 0 ticks mientras el servidor se está iniciando, o antes de que esté habilitado, se ejecutará antes de que se habilite el servidor.
