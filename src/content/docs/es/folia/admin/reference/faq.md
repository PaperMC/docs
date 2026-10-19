---
title: Preguntas frecuentes
description: Respondemos a las preguntas más frecuentes de nuestra comunidad.
slug: es/folia/faq
---

## ¿Qué tipos de servidores pueden beneficiarse de Folia?
Los tipos de servidores en los que los jugadores suelen repartirse por el mundo,
como skyblock o SMP, son los que más se beneficiarán de Folia. Además, el servidor
debería tener una cantidad considerable de jugadores.

## ¿En qué hardware funciona mejor Folia?
Lo ideal es contar con al menos 16 _núcleos_ (no hilos).

## ¿Cuál es la mejor forma de configurar Folia?
En primer lugar, se recomienda pregenerar el mundo para reducir considerablemente
la cantidad de hilos de trabajo necesarios para el sistema de chunks.

La siguiente es una estimación _muy aproximada_ basada en las pruebas
realizadas antes de publicar Folia en nuestro servidor de pruebas, que
alcanzó un máximo de ~330 jugadores. Por tanto, no es exacta y requerirá ajustes:
úsala solo como punto de partida.

Ten en cuenta la cantidad total de núcleos disponibles en la máquina. Después, asigna hilos para:
- E/S de Netty: ~4 por cada 200-300 jugadores
- Hilos de E/S del sistema de chunks: ~3 por cada 200-300 jugadores
- Hilos de trabajo del sistema de chunks si el mundo está pregenerado: ~2 por cada 200-300 jugadores
- No hay una estimación fiable para los hilos de trabajo del sistema de chunks si el mundo no está pregenerado. En
  nuestro servidor de pruebas asignamos 16 hilos, pero la generación de chunks seguía siendo
  lenta con ~300 jugadores.
- Configuración del GC: ???? La configuración del GC sí asigna hilos simultáneos y debes
  saber exactamente cuántos. Normalmente se hace mediante la opción `-XX:ConcGCThreads=n`. No
  la confundas con `-XX:ParallelGCThreads=n`, ya que los hilos paralelos del GC solo se ejecutan cuando
  la aplicación está pausada por el GC y, por tanto, no deben incluirse en el cálculo.

Después de esas asignaciones, puedes destinar a los hilos de tick los núcleos restantes hasta
llegar al 80 % de uso (el total de hilos asignados debe ser < 80 % de las CPU disponibles).
Esto se configura en la configuración global, mediante `threaded-regions.threads`.

No deberías asignar más del 80 % de los núcleos porque los plugins e incluso el servidor pueden
utilizar hilos adicionales que no puedes configurar ni prever.

Además, todo lo anterior es una estimación aproximada basada en la cantidad de jugadores.
Es muy probable que la asignación de hilos no sea ideal y tengas que ajustarla según el uso
de los hilos que observes.

## ¿Qué comandos desactiva Folia?
Actualmente, Folia desactiva algunos comandos. Son los siguientes:
- Bossbar commands
- Clone commands
- Data commands
- Datapack
- Debug
- Function
- Item commands
- Loot
- Reload
- Return
- Ride
- Rotate
- Schedule
- Scoreboard
- Spectate
- SpreadPlayers
- Tag
- Team
- TeamMsg
- Tick
- Trigger
- Perf
- SaveAll
- Restart
