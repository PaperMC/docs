---
title: Lógica de regiones
description: Descripción general del funcionamiento del regionizador de Folia.
slug: es/folia/reference/region-logic
---

## Lógica fundamental de regionalización

## Región

Una región es simplemente un conjunto de posiciones de chunks propias y un objeto de datos único, definido por la implementación,
asociado a esa región. Es importante
señalar que, para cualquier región x que no esté muerta y cada posición de chunk y
que posea, no existe otra región z no muerta que
posea la posición de chunk y.

## Regionizador

Cada mundo tiene su propio regionizador. El término regionizador
describe la lógica que ejecuta la clase `ThreadedRegionizer`
para crear, mantener y destruir regiones. El mantenimiento de regiones se
realiza fusionando regiones cercanas, marcando cuáles pueden
ejecutar ticks y, finalmente, dividiendo las regiones
en otras independientes más pequeñas. En esencia, esta lógica
garantiza que los grupos de chunks cercanos se consideren
una única región independiente.

## Garantías que ofrece el regionizador

El regionizador proporciona varios invariantes importantes que permiten
que las regiones ejecuten ticks en paralelo sin condiciones de carrera:

### Primer invariante

El primer invariante establece simplemente que cada chunk holder existente
tiene una única región correspondiente.

### Segundo invariante

El segundo invariante establece que para cada chunk holder x _existente_
incluido en una región, todas las posiciones de chunk dentro del
«radio de fusión» de x pertenecen a esa región. En la práctica, este invariante
garantiza que la región no esté cerca de otra, lo que permite
suponer que, mientras ejecuta ticks, puede crear datos para los chunk holders cercanos.

### Tercer invariante

El tercer invariante establece que una región que ejecuta ticks _no puede_ ampliar
las posiciones de chunks que posee mientras ejecuta ticks. Este invariante
es importante porque evita que las regiones que ejecutan ticks «compitan»
por chunks cercanos que no poseen, y garantiza que realmente ejecuten ticks
en paralelo, independientemente de las cargas de chunks que soliciten durante
la ejecución.

Para cumplir el primer invariante, el regionizador crea regiones "transient"
_alrededor_ de las regiones que ejecutan ticks. En este contexto, «alrededor»
significa lo bastante cerca como para requerir una fusión, pero no tanto como
para considerarlas independientes. Las regiones "transient" creadas en estos casos
se fusionan con la región que ejecuta ticks cuando esta termina.

La combinación del segundo y el tercer invariante permite que
el regionizador garantice que una región que ejecuta ticks pueda crear
y después acceder a los chunk holders cercanos (es decir, realizar cargas síncronas)
sin interferir con otra región.

### Cuarto invariante

El cuarto invariante establece que una región solo puede estar en uno de estos cuatro
estados: "transient", "ready", "ticking" o "dead".

El estado "ready" permite pasar al estado "ticking",
mientras que "transient" se usa para las regiones que quizá
no ejecuten ticks. El estado "dead" marca regiones que no deben
utilizarse.

Las transiciones entre estados se explican más adelante, ya que están relacionadas
con la lógica de fusión y división del regionizador.

## Implementación del regionizador

La implementación del regionizador describe cómo la clase
`ThreadedRegionizer` cumple los cuatro invariantes descritos anteriormente.

### División del mundo en secciones

El regionizador no opera con coordenadas de chunks, sino con «coordenadas de sección de región».
Estas coordenadas representan grupos de NxN chunks en una cuadrícula, donde N es una potencia
de dos. El valor concreto no se especifica, ya que las coordenadas de sección de región
son un detalle interno de la agrupación de chunks.
Por ejemplo, con N=16, la sección de región (0,0) abarca todos los
chunks con x entre 0 y 15 y z entre 0 y 15. El concepto es similar al de la
coordenada de chunk (0,0), que abarca todos los bloques con x entre 0 y 15
y z entre 0 y 15. Otro ejemplo: con N=16, el chunk (17, -5) está
contenido en la sección de región (1, -1).

Las coordenadas de sección de región se usan como una optimización de rendimiento
del regionizador: al aproximar las coordenadas de los chunks a sus coordenadas de región,
puede tratar NxN chunks como una sola unidad al regionalizar. Esto significa que las regiones
no poseen posiciones de chunks, sino posiciones de secciones de región. La agrupación de NxN chunks
permite ejecutar la lógica de regionalización solo cuando se crean o destruyen secciones de región.
Por ejemplo, con N=16, esto puede reducir hasta NxN-1=255 operaciones en áreas como
addChunk y el recálculo de regiones, suponiendo que las secciones de región estén siempre completas.

### Variables de implementación

Las variables de implementación controlan la intensidad con la que el
regionizador mantiene las regiones y las fusiona.

#### Cantidad de recálculos

La cantidad de recálculos es el número mínimo de secciones de región que
una región debe poseer para poder recalcularse. La operación de recálculo
simplemente calcula el conjunto de regiones independientes que hay dentro de una región
para comprobar si se puede dividir.
Este parámetro permite desactivar la lógica de división para regiones pequeñas,
ya que es poco probable que estas puedan dividirse.

#### Porcentaje máximo de secciones inactivas

El porcentaje máximo de secciones inactivas es el porcentaje mínimo de secciones inactivas
que debe haber en una región para que esta pueda ejecutar la lógica de recálculo.

#### Radio de creación de secciones vacías

La variable del radio de creación de secciones vacías determina
cuántas secciones de región vacías deben existir alrededor de _cualquier_
sección de región que contenga al menos un chunk.

Internamente, el regionizador hace cumplir el tercer invariante al
impedir que las regiones que ejecutan ticks posean nuevas secciones de región.
La creación de secciones vacías alrededor de cualquier sección no vacía
hace cumplir el segundo invariante.

#### Radio de fusión de secciones de región

La variable del radio de fusión garantiza que, para cualquier sección de región existente x,
cualquier otra sección de región y dentro del radio de fusión pertenezca a la región propietaria de x,
esté pendiente de fusionarse con dicha región, o que la región propietaria de x
esté pendiente de fusionarse con la región propietaria de y.

#### Desplazamiento de chunk de la sección de región

El desplazamiento de chunk de la sección de región es simplemente log2(N), donde N es el tamaño de la cuadrícula. Por tanto,
N = 1 << region section chunk shift. La conversión
de una posición de chunk a una sección de región se define como:
coordenada de región = coordenada de chunk >> desplazamiento de chunk de la sección de región.

### Funcionamiento

El regionizador funciona invocando `ThreadedRegionizer#addChunk(x, z)`
o `ThreadedRegionizer#removeChunk(x, z)` cuando se crea
o destruye un chunk holder.

Además, el código que intenta pasar una región del estado "ready" al estado "ticking"
puede utilizar `ThreadedRegion#tryMarkTicking`. Es importante tener en cuenta que esta función devuelve false si
la región no está en el estado "ready", ya que incluso una región que antes se consideraba
"ready" (es decir, estaba programada para ejecutar ticks) puede marcarse inesperadamente como "transient".
Por tanto, el código que llama a la función debe gestionar estos casos. Quien marque
correctamente una región como activa debe volver a marcarla como inactiva mediante
`ThreadedRegion#markNotTicking`.

La función ThreadedRegion#markNotTicking devuelve true si la región
pasó del estado "ticking" al estado "ready", y false en cualquier
otro caso. En la práctica, indica si la región actual podrá ejecutar ticks de nuevo más adelante.

### Estado de las secciones de región

El estado de una sección de región puede ser "dead" o "alive". Además, se considera
"non-empty" si contiene al menos una posición de chunk, y "empty" en caso contrario.

Una sección de región se considera "dead" si, y solo si, también está "empty"
y no hay otras secciones "empty" dentro del radio de creación de secciones vacías.

La existencia del estado "dead" responde únicamente a motivos de rendimiento, ya que
permite aplazar la lógica de recálculo de una región hasta que contenga suficientes secciones
"dead". Sin embargo, estas secciones siguen considerándose parte de la región que las posee,
igual que las secciones "alive".

### Adición de chunks (`addChunk`)

La adición de chunks al regionizador se reduce a dos casos:

#### La sección de región de destino ya existe y no está vacía

En este caso, simplemente se añade el chunk a la sección y se termina.

#### La sección de región de destino no existe o está vacía

En este caso, se crea la sección de región si aún no existe.
También se crean las secciones de región incluidas en el «radio de creación de secciones vacías».

Después, se recopilan en un conjunto X todas las regiones que estén dentro
del radio de creación de secciones vacías más el radio de fusión. Este conjunto representa
las regiones que habrá que fusionar para cumplir el segundo invariante.

Si el conjunto X está vacío, se crea una región en estado "ready"
para que posea todas las secciones creadas.

Si el conjunto X contiene una sola región, no es necesario fusionar regiones
ni modificar el estado de ninguna región; las secciones se añaden a esa región.

La lógica de fusión se ejecuta cuando el conjunto X contiene más de una región.
Se selecciona del conjunto una región x que no esté ejecutando ticks. Si no hay
ninguna, se crea una región x. Todas las secciones de región creadas se añaden
a x, ya que se sabe que no está ejecutando ticks; así se cumple el tercer invariante.

Cada región y del conjunto X que no sea x se fusiona con x si y no está en estado
"ticking"; de lo contrario, x aplica a y la lógica de fusión diferida.

### Lógica de fusión diferida

Una operación de fusión diferida solo puede realizarse desde
una región x que no esté ejecutando ticks ni esté "dead" hacia una región y que esté ejecutando ticks.
Esta lógica mantiene, para cada región, un conjunto de regiones con las que debe fusionarse más adelante
y otro conjunto de regiones que se espera que se fusionen con ella.
En la práctica, una fusión diferida de x hacia y añade y al conjunto de x
de fusiones pendientes y añade x al conjunto de y de fusiones esperadas.

Cuando la región que ejecuta ticks termina, ejecuta la lógica de fusión
para todas las fusiones esperadas.

### Lógica de fusión

Una operación de fusión solo puede realizarse entre una región x en estado "dead"
y otra región y, que puede estar en estado "transient" o "ready".
En la práctica, x se absorbe en y, ya que sus secciones se trasladan a esta última.

Las fusiones diferidas también se transfieren a la región y,
de modo que esta pase a fusionarse más adelante con las regiones con las que x tenía previsto hacerlo.

Además, si la región x contiene datos específicos de la implementación,
se invoca la función de callback de la región para fusionar esos datos con los de y.

El estado de la región y puede actualizarse al finalizar una fusión.
Por ejemplo, si la región x estaba en estado "transient", la región y también debe
degradarse a "transient". En concreto, y debe marcarse como "transient" si x contenía
destinos de fusión diferida distintos de y. Esta degradación es necesaria
para cumplir el segundo invariante.

### Eliminación de chunks (`removeChunk`)

La eliminación de chunks de las secciones de región simplemente actualiza
el estado de estas secciones a "dead" o "alive", así como el de las secciones
dentro del radio de creación de secciones vacías. No actualiza ningún estado
de región ni elimina secciones de región.

### Inicio del tick de una región (`tryMarkTicking`)

Al comenzar el tick, simplemente se cambia el estado a "ticking" para cumplir
los invariantes #2 y #3.

### Fin del tick de una región (`markNotTicking`)

Al terminar un tick, todavía no se conoce el nuevo estado de la región.

Primero, la región debe procesar las fusiones pendientes.

Después de procesarlas, debe comprobar si ahora está pendiente de fusionarse
con otra región. Si es así, pasa al estado "transient".

De lo contrario, procesa la eliminación de las secciones inactivas e intenta dividirse
en regiones más pequeñas. Si una región puede dividirse, necesariamente debe eliminar
las secciones inactivas; de lo contrario, se contradirían las reglas utilizadas
para construirla.
