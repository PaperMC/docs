---
title: Primeros pasos
description: Cómo empezar a ejecutar Waterfall.
slug: es/waterfall/getting-started
banner:
  destructive: true
  content: Te recomendamos migrar a <a href="https://papermc.io/software/velocity">Velocity</a>. Para más información, consulta el <a href="https://forums.papermc.io/threads/1088/">anuncio</a>.
---

## ¿Qué es Waterfall?

Waterfall es una bifurcación de BungeeCord, un proxy que se usa principalmente para trasladar jugadores entre varios
servidores de Minecraft.

Waterfall se centra en tres áreas principales:

- Estabilidad: Waterfall busca ser estable. Lo lograremos haciendo que el código base se pueda probar
  y desalentando las prácticas que causan retrasos en el proxy.
- Funciones: Waterfall busca incluir más funciones que BungeeCord original.
- Escalabilidad: Waterfall debería poder gestionar muchos jugadores simultáneos si cuenta con una
  CPU razonablemente moderna, memoria suficiente y una buena conexión de red.

## Requisitos

Waterfall requiere **Java 8** o una versión posterior. El equipo de Paper recomienda usar Java 11 o
superior. Por lo general, se recomiendan las versiones LTS de Java, aunque también podrían funcionar versiones más recientes.

## Migrar desde BungeeCord

Waterfall reemplaza directamente a BungeeCord, por lo que no necesitas cambiar la
configuración.

## Obtener un JAR del proxy

Paper ofrece JAR ejecutables del proxy directamente desde nuestra [página de descargas](https://papermc.io/downloads/waterfall).

Haz clic en el número de compilación para descargar un archivo.

## Ejecutar el proxy

Para ejecutar el proxy, simplemente inícialo como cualquier otra aplicación Java.

Abre una terminal, ve a la ubicación donde guardaste el archivo y ejecuta

```bash
java -Xms512M -Xmx512M -jar waterfall-###.jar
```

Las opciones recomendadas por Aikar para Waterfall son las siguientes:

```bash
java -Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar waterfall-###.jar
```

Puedes cambiar la cantidad de memoria modificando los valores de las opciones `-Xms` y `-Xmx`.

Para configurar el proxy, consulta la página de [configuración](/es/waterfall/configuration).

## Actualizar el proxy

Para actualizar el proxy, primero detenlo de forma segura ejecutando el comando `end`. Después, reemplaza el JAR
antiguo del proxy por uno nuevo e inicia el proxy. Eso es todo.
