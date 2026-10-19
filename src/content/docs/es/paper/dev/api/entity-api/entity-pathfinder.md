---
title: API de búsqueda de rutas de entidades
slug: es/paper/dev/entity-pathfinder
description: Guía de la API para controlar el movimiento de las entidades.
---
La API de búsqueda de rutas permite controlar el movimiento de las entidades en Minecraft. Puedes asignarles una ruta, por ejemplo, para que se desplacen a un punto o sigan a un jugador.

## Obtener el buscador de rutas

Para obtener el buscador de rutas de una criatura, llama a [`getPathfinder()`](jd:paper:org.bukkit.entity.Mob#getPathfinder()) en la criatura. El método devuelve una instancia de [](jd:paper:com.destroystokyo.paper.entity.Pathfinder).
:::note
El buscador de rutas solo está disponible para las entidades que implementan [](jd:paper:org.bukkit.entity.Mob).
:::
Por ejemplo, si tienes una [](jd:paper:org.bukkit.entity.Cow) y quieres llevarla hasta un jugador, obtén el buscador de rutas de la vaca y asígnale la ubicación del jugador como destino:
```java
Cow cow = ...;
Player player = ...;

Pathfinder pathfinder = cow.getPathfinder();
// moveTo devuelve un booleano que indica si se pudo establecer la ruta
boolean success = pathfinder.moveTo(player.getLocation());
```
Para consultar la ruta actual de la vaca, llama a [`getCurrentPath()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#getCurrentPath()) en el buscador de rutas:
```java
PathResult path = pathfinder.getCurrentPath();

// PathResult envuelve una lista de ubicaciones, a la que puedes acceder así:
List<Location> locations = path.getPoints();
// La lista contiene tanto los puntos ya recorridos como los que quedan por recorrer.
// Para obtener el siguiente punto, puedes usar:
Location nextPoint = path.getNextPoint(); // Or locations.get(path.getNextPointIndex())
// Para obtener el destino final, usa:
Location destination = path.getFinalPoint();
```
## Reglas de búsqueda de caminos

La búsqueda de rutas está limitada por la lógica de movimiento de Minecraft. Por ejemplo, un oso polar no puede volar, así que no alcanzará un destino situado en el aire.

Puedes configurar estos atributos del buscador para cambiar su comportamiento:
- [`setCanOpenDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanOpenDoors(boolean)): Si la entidad puede abrir puertas.
  Esto es relevante para los zombis que derriban puertas y los aldeanos que abren puertas.
- [`setCanPassDoors(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanPassDoors(boolean)): Si la entidad puede atravesar puertas abiertas.
- [`setCanFloat(boolean)`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#setCanFloat(boolean)): Si la entidad puede flotar en el agua.

Estos métodos también tienen captadores respectivos.

## Detener la búsqueda de caminos

Llama a [`stopPathfinding()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#stopPathfinding()) para detener la búsqueda de rutas de la entidad y borrar la ruta actual. Puedes comprobar si el buscador tiene una ruta con [`hasPath()`](jd:paper:com.destroystokyo.paper.entity.Pathfinder#hasPath()).
