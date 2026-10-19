---
title: Descripción general
description: Descripción general del funcionamiento de Folia.
slug: es/folia/reference/overview
---

Este documento presenta una descripción abstracta de los cambios realizados por Folia. Folia divide los chunks de todos los mundos cargados
en regiones que funcionan de forma independiente, de modo que estas se ejecutan
independientemente y en paralelo. Primero se describen las operaciones dentro de una región
y después las operaciones entre regiones.

## Reglas para regiones independientes

Para garantizar que las regiones sean independientes, las reglas de mantenimiento deben asegurar que una región que está ejecutando ticks
no tenga regiones vecinas directamente adyacentes que también estén ejecutándolos.
Las siguientes reglas garantizan este invariante:
1. Una región que está ejecutando ticks no puede crecer mientras lo hace.
2. Al inicio, cada región que ejecuta ticks debe poseer un pequeño margen de chunks fuera
   de su perímetro.
3. Las regiones no pueden _empezar_ a ejecutar ticks si tienen una región vecina adyacente.
4. Las regiones adyacentes deben fusionarse finalmente para formar una sola región.

Además, para garantizar que una región no esté compuesta por varias regiones independientes
(lo que limitaría el paralelismo), las regiones que contengan más de
un área independiente deben dividirse finalmente en regiones independientes
cuando sea posible.

Por último, para que las regiones que ejecutan ticks puedan almacenar y mantener datos
sobre la región actual (por ejemplo, el recuento de ticks, las entidades y chunks de la región,
las listas de ticks de bloques y fluidos, entre otros), cada región tiene
su propio objeto de datos. Solo puede accederse a él mientras se ejecutan ticks en la región y
desde el hilo que los ejecuta. También hay callbacks para fusionar
o dividir regiones y actualizar correctamente el objeto de datos.

La implementación de estas reglas se describe en [Lógica de regiones](/es/folia/reference/region-logic).

El resultado de aplicar estas reglas es que una región que ejecuta ticks puede garantizar que
solo el hilo actual tenga acceso de escritura a los datos de la región
y que, en todo momento, la cantidad de regiones independientes se acerque al máximo posible.

## Operaciones dentro de una región

Las operaciones dentro de una región son las que solo usan datos
de una única región desde la propia región, o corresponden a la lógica de fusión y división.

### Ejecución de ticks en regiones independientes

Las regiones independientes ejecutan ticks de forma independiente y en paralelo. Esto significa
que cada región mantiene sus propios plazos para programar el siguiente tick. Por
ejemplo, supongamos que las regiones A y B tienen el inicio del próximo tick programado para t=15ms
y t=0ms, respectivamente. Considera la siguiente secuencia:
1. En t = 0ms, B empieza a ejecutar un tick.
2. En t = 15ms, A empieza a ejecutar un tick.
3. En t = 20ms, B termina su tick y se programa el siguiente para t = 50ms.
4. En t = 50ms, B empieza su segundo tick.
5. En t = 70ms, B termina su segundo tick y se programa el siguiente para t = 100ms.
6. En t = 95ms, A termina su _primer_ tick. Se programa el siguiente para t = 95ms.

Es importante observar que el retraso de A respecto al objetivo de 20 TPS nunca afectó al programa de B.

Para implementar este comportamiento, cada región mantiene una tarea repetitiva en un ejecutor programado (consulta `SchedulerThreadPool`) que programa
tareas mediante un algoritmo de planificación que prioriza el inicio más temprano. El
algoritmo es similar a EDF, pero programa según la hora de inicio. Sin embargo,
como el plazo de cada tick es 50ms + la hora de inicio, se comporta
igual que el algoritmo EDF.

Se elige este algoritmo similar a EDF para que, mientras el grupo de hilos no esté
completamente ocupado, todas las regiones cuyos ticks duren <= 50ms
mantengan 20 TPS. Sin embargo, el algoritmo de planificación no tiene en cuenta NUMA
ni los núcleos de la CPU: no intenta (cuando hay n regiones > m hilos)
asignar regiones a núcleos específicos.

Como las regiones ejecutan ticks de forma independiente, cada una mantiene sus propios contadores. Las
implicaciones se describen en la siguiente sección.

### Contadores de ticks

En Vanilla estándar hay varios contadores de ticks importantes: Current Tick,
Game Time Tick y Daylight Time Tick. Current Tick se usa
para determinar cuántos ticks han transcurrido desde que se inició el servidor. Game Time
se mantiene por mundo y se usa para programar ticks de bloques
de redstone, fluidos y otros eventos de física. Daylight Time
simplemente cuenta los ticks transcurridos desde el mediodía y se mantiene por mundo.

En Folia, Current Tick se mantiene por región. Game Time
se divide en dos contadores: Redstone Time y Global Game Time.
Redstone Time se mantiene por región. Global Game Time y
Daylight Time se mantienen en la «región global».

Al inicio de cada tick de región, los contadores globales de Game Time y
Daylight Time se copian desde la región global. Cada vez que la región actual consulta esos valores,
obtendrá la copia recibida al inicio del tick. Así se garantiza que dos llamadas para consultar el número de tick durante el mismo tick
devuelvan el mismo valor.

Se mantiene el tiempo global del juego por un par de motivos:
1. Se necesita un contador que indique cuántos ticks lleva existiendo un mundo,
   ya que el juego registra la cantidad total de días transcurridos.
2. Una parte considerable del código nuevo de IA de entidades usa el tiempo del juego (por
   motivos que desconozco) para guardar plazos absolutos de tareas.
   Es posible escribir código para ajustar los plazos de todas
   estas tareas, pero supondría una cantidad considerable de trabajo.

#### Región global

La región global es una única tarea programada para ejecutarse siempre a 20 TPS, responsable de mantener datos que no
pertenecen a ninguna región específica: reglas del juego, tiempo global, hora del día,
gestión de comandos de consola, borde del mundo, clima y otros. A diferencia de las demás
regiones, no necesita lógica especial para fusionarse o dividirse, ya que nunca se divide ni se fusiona:
en todo momento hay una sola región global. No posee
datos específicos de ninguna región.

#### Fusionar y dividir los tiempos de tick de las regiones

Como los ticks de redstone y los ticks actuales se mantienen por región, se necesita
lógica para ajustar los plazos del planificador de ticks de bloques y fluidos
y de cualquier otro componente que programe usando el tiempo absoluto de redstone o el tick actual,
de modo que el plazo relativo no se vea afectado.

Al fusionar la región x (origen) en la región y (destino),
podemos ajustar los plazos de ambas regiones o solo los de una.
Es más sencillo ajustar una sola, así que elegimos arbitrariamente la región x.
Después, ajustamos sus plazos para que, teniendo en cuenta los ticks actuales
de y, los plazos relativos se mantengan sin cambios.

Considera el plazo d1 = tick de origen + plazo relativo en la región x.
Queremos que el plazo ajustado d2 sea d2 = tick de destino + plazo relativo
en la región y, de modo que se mantenga el plazo relativo del tick. Podemos
lograrlo aplicando a d1 un desplazamiento o, de modo que d1 + o = d2, donde
o = tick de destino - tick de origen. Este desplazamiento debe calcularse
por separado para los ticks de redstone y los actuales, ya que el campo `Level#tickTime`
puede desactivar el incremento de los ticks de redstone.

Por último, el caso de división es sencillo: cuando se produce, las regiones independientes resultantes
heredan de la región principal los ticks de redstone y los actuales. Por tanto, se mantienen los plazos relativos, ya que
el número de ticks no cambia.

En todos los casos, los eventos de redstone y cualquier otro evento programado según el tick actual
no se ven afectados por la división o fusión de regiones, ya que el plazo relativo
se mantiene aplicando un desplazamiento al fusionar y copiando
el número de ticks al dividir.

## Operaciones entre regiones

Las operaciones entre regiones son las que interactúan con regiones distintas de la región actual que ejecuta ticks,
cuyo estado es completamente desconocido. Estas regiones
pueden ser transitorias, estar ejecutando ticks o ni siquiera existir.

### Utilidades para facilitar las operaciones

Para facilitar las operaciones entre regiones, se proporcionan varias utilidades.
En NMS, estas utilidades son `EntityScheduler`, `RegionizedTaskQueue`,
la cola de tareas de la región global y el proveedor de datos local a la región
`RegionizedData`. La API de Folia ofrece equivalentes similares, pero no dispone
de un proveedor de datos local a la región, ya que el proveedor de NMS mantiene
bloqueos críticos y se invoca en secciones críticas del código al ejecutar
callbacks. Por ello, es muy vulnerable a errores graves de plugins
que impliquen operaciones de E/S prolongadas o modificaciones del estado del mundo.

#### `EntityScheduler`

`EntityScheduler` permite programar tareas para que se ejecuten en la
región propietaria de la entidad. Esto resulta especialmente útil al teletransportar
entidades, porque, una vez que una entidad inicia un teletransporte asíncrono,
no puede ejecutar ticks hasta que termine, y el momento en que esto ocurra no está definido.

#### `RegionizedTaskQueue`

`RegionizedTaskQueue` permite programar tareas para que se ejecuten en
el siguiente tick de la región propietaria de una ubicación específica, o crear
dicha región si aún no existe. Resulta útil para tareas que necesiten
modificar o consultar datos del mundo, bloques o chunks fuera de la región actual.

#### Cola de tareas de la región global

La cola de tareas de la región global se usa para modificar datos
propiedad de la región global, como las reglas del juego, la hora del día o el clima,
o para ejecutar comandos mediante el emisor de comandos de la consola.

#### `RegionizedData`

La clase `RegionizedData` permite que las regiones definan datos locales,
para almacenarlos sin tener que considerar el acceso concurrente
desde otras regiones. Por ejemplo, las listas actuales de ticks de entidades,
chunks, bloques y fluidos se mantienen por región, de modo que las regiones no
tienen que preocuparse por el acceso concurrente a esos conjuntos de datos.

Estas utilidades permiten resolver fácilmente distintos problemas entre regiones,
por ejemplo, modificar el estado de bloques, entidades o del mundo desde cualquier región
mediante colas de tareas, o evitar problemas de concurrencia usando
`RegionizedData`. Operaciones más avanzadas, como el teletransporte,
la reaparición de jugadores y el uso de portales, también recurren a estas utilidades
para garantizar la seguridad entre hilos.

### Teletransportes de entidades entre regiones y dimensiones

Las entidades necesitan una lógica especial para teletransportarse de forma segura entre
regiones o dimensiones. En todos los casos, la llamada para teletransportar o colocar una entidad
debe invocarse en la región propietaria de esta.
`EntityScheduler` permite programar fácilmente código para ejecutarlo en ese contexto.

#### Teletransporte simple

En un teletransporte simple, la entidad ya existe en una ubicación del mundo
y se conocen la ubicación y la dimensión de destino.
La operación se divide en dos partes: transformación y colocación asíncrona.
En este caso, la transformación elimina la entidad del mundo actual y después ajusta su posición.
La colocación asíncrona programa una tarea en la ubicación de destino
mediante `RegionizedTaskQueue` para añadir la entidad a
la dimensión de destino en la posición indicada.

Se omiten varios detalles de implementación, como la copia de entidades que no son jugadores
durante la transformación, ya que no son relevantes para esta descripción general.

El inicio de sesión y la reaparición de jugadores suelen considerarse
teletransportes simples. El inicio de sesión solo se diferencia porque el jugador
no existe en ningún mundo al principio y la transformación asíncrona también
debe encontrar un lugar donde aparezca. La reaparición es similar al inicio
de sesión, pero el jugador ya está en el mundo cuando reaparece.

#### Teletransporte por portal

El teletransporte por portal se diferencia del teletransporte simple porque no
se conoce la ubicación exacta del destino. Por ello, el paso de transformación
no actualiza la posición de la entidad. En su lugar, se intercala una nueva operación
entre la transformación y la colocación asíncrona: una búsqueda o creación asíncrona,
responsable de encontrar o crear el portal de salida.

Además, el código actual de Vanilla puede rechazar un teletransporte si la
entidad no es un jugador y el portal de salida del Nether aún no existe. Sin embargo,
como la ubicación del portal solo se determina durante la colocación asíncrona,
ya es demasiado tarde para cancelar la operación. Por eso se reescribió la lógica
de los portales para que no haya diferencias entre jugadores y entidades. Ahora ambos
crean portales de salida, tanto para el Nether como para el End.

#### Apagado durante un teletransporte

Como el teletransporte se realiza en varios pasos, el proceso de apagado
del servidor debe gestionar manualmente los teletransportes que no se hayan completado.

## Proceso de apagado del servidor

El proceso de apagado crea un hilo independiente,
que ejecuta la lógica de cierre:
1. Detener el planificador de ticks de regiones para impedir más ticks.
2. Detener el procesamiento de métricas.
3. Desactivar los plugins.
4. Dejar de aceptar conexiones nuevas.
5. Enviar paquetes de desconexión a todos los jugadores (sin eliminarlos).
6. Detener los sistemas de chunks de todos los mundos.
7. Ejecutar la lógica de apagado de todos los mundos: completar todos los teletransportes pendientes
   de todas las regiones, guardar todos los chunks del mundo y, por último,
   guardar los datos del nivel (level.dat y otros archivos .dat).
8. Guardar a todos los jugadores.
9. Apagar el gestor de recursos.
10. Liberar el bloqueo del nivel.
11. Detener los ejecutores restantes (el ejecutor Util, los hilos de E/S de regiones, etc.).


La diferencia principal con Vanilla es que la lógica para expulsar a los jugadores y
guardar el mundo se sustituye por los pasos 5-8.

En el paso 5, no se puede expulsar a los jugadores antes de completar los teletransportes,
porque expulsarlos guardaría el archivo de datos del jugador. Por eso, el guardado se traslada a después.

En el paso 6, los sistemas de chunks se detienen antes de guardar para detener
la generación de chunks. Esto reduce la carga del servidor durante el apagado,
lo que puede ser crucial cuando hay poca memoria disponible.

En el paso 7, los teletransportes se completan de forma distinta según su tipo:
simple o por portal.

Los teletransportes simples se completan garantizando que la entidad que se teletransporta
se añada al chunk de destino especificado. Así, la entidad se puede guardar en la posición
de destino, como si el teletransporte se hubiera completado antes del apagado.

Los teletransportes por portal se completan forzando la incorporación
de la entidad al chunk de origen, desde el que debía haberse teletransportado.
Como no se conoce la ubicación de destino, la entidad solo puede volver al origen
(sin teletransportarse). Aunque este comportamiento no es ideal, la lógica de apagado
_debe_ contemplar cualquier estado incoherente del mundo, lo que significa que quizá
no sea posible encontrar o crear el portal de salida de destino.

El teletransporte debe completarse antes de guardar el mundo para que
se guarden las entidades cuyo teletransporte se haya completado.

En el paso 8, los jugadores solo se guardan una vez completados los teletransportes.

Los pasos restantes son los de Vanilla.
