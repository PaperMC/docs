---
title: API de objetivos de la mafia
slug: es/paper/dev/mob-goals
description: Una guía para la API Mob Goal.
---
La API Mob Goal permite controlar el comportamiento de los mobs en Minecraft. Con él, puedes establecer un objetivo para que lo realice una mafia, como atacar a un jugador o moverse a una ubicación. También le permite crear sus propios objetivos personalizados.

## Agregar un objetivo a una entidad

Para agregar un objetivo a una entidad, necesita obtener una instancia del objetivo y luego agregarla al [](jd:paper:com.destroystokyo.paper.entity.ai.MobGoals) de la entidad:
```java
Cow cow = ...;
Goal<Cow> goal = new ExampleGoal();

// 0 es la prioridad más alta. Cuanto menor sea el número, mayor será la prioridad.
server.getMobGoals().addGoal(cow, 0, goal);
```

:::tip
Puede acceder a los objetivos Vanilla desde la clase [](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal). Pueden ser específicos de un tipo de mafia. Por ejemplo, no puedes usar [`VanillaGoal.BEE_ATTACK`](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal#BEE_ATTACK) en un zombie.
:::
## Creando un objetivo personalizado

Para crear un objetivo personalizado, necesita crear una clase que implemente la interfaz [](jd:paper:com.destroystokyo.paper.entity.ai.Goal). Esta interfaz tiene varios métodos:
- [`void start()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#start()): Llamado cuando se inicia la meta.
- [`void tick()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#tick()): Llama a cada tick mientras el objetivo está en ejecución.
- [`void stop()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#stop()): Llamado cuando la portería está parada.
- [`boolean shouldActivate()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#shouldActivate()): Llamado para determinar si el gol debe comenzar.
- [`boolean shouldStayActive()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#shouldStayActive()): Llamado para determinar si la meta debe continuar corriendo.
- [`GoalKey getKey()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getKey()): Llamado para conseguir la llave de la portería.
- [`EnumSet<GoalType> getTypes()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getTypes()): Llamado para obtener los tipos de gol.
:::note[Tipos]
El método [`getTypes()`](jd:paper:com.destroystokyo.paper.entity.ai.Goal#getTypes()) se utiliza para determinar qué tipo de objetivo es este. Los valores posibles son:
- [`GoalType.MOVE`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#MOVE): El objetivo mueve a la entidad.
- [`GoalType.LOOK`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#LOOK): El objetivo cambia la dirección en la que mira la entidad.
- [`GoalType.JUMP`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#JUMP): El gol hace saltar a la entidad.
- [`GoalType.TARGET`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#TARGET): ​​La meta cambia el objetivo de la entidad.
- [`GoalType.UNKNOWN_BEHAVIOR`](jd:paper:com.destroystokyo.paper.entity.ai.GoalType#UNKNOWN_BEHAVIOR): El objetivo hace otra cosa. Se utiliza para mapear objetivos de Vanilla.
:::
A continuación se muestra un ejemplo de gol que hace que un camello siga a un jugador. Esto es esencialmente lo mismo que el objetivo vainilla [`FOLLOW_MOB`](jd:paper:com.destroystokyo.paper.entity.ai.VanillaGoal#FOLLOW_MOB), pero es un buen ejemplo de cómo crear un objetivo.
```java title="CamelFollowPlayerGoal.java"
public class CamelFollowPlayerGoal implements Goal<Camel> {

    // Esta es la clave del objetivo. Se usa para identificarlo y para determinar si
    // dos objetivos son iguales.
    public static final GoalKey<Camel> KEY = GoalKey.of(
        // La clase de entidad a la que se aplica este objetivo.
        Camel.class,
        // La clave de identificación. Usa el espacio de nombres de tu plugin.
        new NamespacedKey("example_plugin", "camel_follow_player")
    );

    private final Player player; // El jugador al que seguir.
    private final Camel camel; // El camello que sigue.

    public CamelFollowPlayerGoal(Player player, Camel camel) {
        this.player = player;
        this.camel = camel;
    }

    @Override
    public boolean shouldActivate() {
        // Indica si debe comenzar el objetivo. En este caso, queremos que siempre
        // comience, así que devolvemos true. También podrías devolver false si debe cumplirse
        // una condición específica.
        return true;
    }

    @Override
    public void start() {
        // Se llama cuando comienza el objetivo.
        player.sendPlainMessage("I am following you!");
    }

    @Override
    public void tick() {
        // Se llama en cada tick mientras se ejecuta el objetivo. Aquí hacemos que el camello
        // se mueva hacia el jugador mediante la API de Pathfinder.
        // 5.0 es la velocidad del camello.
        camel.getPathfinder().moveTo(player, 5.0);
    }

    @Override
    public void stop() {
        // Se llama cuando termina el objetivo.
        player.sendPlainMessage("I stopped following you!");
    }

    @Override
    public GoalKey<Camel> getKey() {
        return KEY;
    }

    @Override
    public EnumSet<GoalType> getTypes() {
        // Devuelve los tipos de este objetivo. Como cambiaremos la dirección de la mirada
        // del camello y lo moveremos, devolvemos MOVE y LOOK.
        // Puedes devolver tantos tipos como necesites.
        return EnumSet.of(GoalType.MOVE, GoalType.LOOK);
    }
}
```
## Eliminar un objetivo

Para eliminar un objetivo, puede llamar a uno de los métodos [`removeGoal`](jd:paper:com.destroystokyo.paper.entity.ai.MobGoals#removeAllGoals(T)):
```java
Cow cow = ...;

// Esto funciona porque en el ejemplo declaramos esta constante.
server.getMobGoals().removeGoal(cow, CamelFollowPlayerGoal.KEY);

// También puedes eliminar los objetivos de Vanilla.
server.getMobGoals().removeGoal(cow, VanillaGoal.TEMPT);

// Elimina todos los objetivos de tipo MOVE.
server.getMobGoals().removeAllGoals(cow, GoalType.MOVE);

// Elimina todos los objetivos.
server.getMobGoals().removeAllGoals(cow);
```
