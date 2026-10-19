---
title: Hoja de ruta
description: Describe las intenciones y planes futuros del proyecto Paper.
slug: es/paper/dev/roadmap
---
Paper ofrece una API rica con una amplia gama de características que pueden ayudarlo a desbloquear todo el potencial de su servidor. Sin embargo, para dejar espacio para nuevas funciones y mejoras, algunas de las API más antiguas se eliminarán gradualmente. Esta página tiene como objetivo documentar cualquier cambio futuro de API que esté planificado o posibles desaprobaciones que puedan surgir.

## Planes futuros

### Interfaz `ItemStack`s

Cuando crea `ItemStack` usando el constructor, crea una representación API de un [](jd:paper:org.bukkit.inventory.ItemStack). Este es un objeto que delega a un objeto respaldado por NMS; en su lugar, debe usar [`ItemStack#of`](jd:paper:org.bukkit.inventory.ItemStack#of(org.bukkit.Material)) para obtener el objeto respaldado por NMS directamente.

En el futuro, `ItemStack` se convertirá en una interfaz y se eliminará el constructor.

#### Precauciones

- Evite ampliar directamente la clase `ItemStack`.
  - Las implementaciones personalizadas de esta clase no son compatibles y **se** romperán.

### Reutilización de `ServerPlayer`
*Nota: Solo se aplica al uso de NMS, no se aplicará a API.*

No guardes referencias directas a instancias de `ServerPlayer`. Actualmente, Paper reutiliza la instancia del jugador al cambiar de mundo; esto cambiará en el futuro para ajustarse al comportamiento estándar. Las entidades de la API (wrappers) seguirán funcionando: Paper reemplazará automáticamente la instancia subyacente.

Esto se hace para ayudar a reducir posibles inconsistencias entre el cambio mundial entre Vanilla y Paper.

## Política de obsolescencia
:::caution
Se recomienda encarecidamente que evite el uso de API marcadas como obsoletas.
:::
El uso de API obsoletas puede causar inestabilidad, problemas de rendimiento y otros fallos. Mantén tus plugins al día y evita las API marcadas como obsoletas.

La API marcada con [`@Deprecated`](jd:java:java.lang.Deprecated) no debe usarse en su código base, ya que es posible que se pueda usar una API alternativa en su lugar. Si bien ciertas API pueden continuar funcionando a pesar de estar obsoletas, **no** se puede prometer que esta API no se marcará como obsoleta para su eliminación en el futuro.
```java
@Deprecated
public void exampleMethod(); // Example deprecated method
```
### Obsoleto para su eliminación

Además de estar marcada como `@Deprecated`, la API puede marcarse como `forRemoval` con una versión determinada [`@ApiStatus.ScheduledForRemoval`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/ApiStatus.ScheduledForRemoval.html). La eliminación de la API programada solo debe ocurrir en las versiones principales de Minecraft. Se recomienda encarecidamente migrar desde la API cuya eliminación está programada.

Cabe señalar que a la API cuya eliminación está programada se le dará el tiempo adecuado para permitir que los desarrolladores de complementos migren fuera de dicha API.
```java
@ApiStatus.ScheduledForRemoval(inVersion = "1.20")
@Deprecated(forRemoval = true)
public void exampleMethod(); // Example method marked for removal in 1.20
```
## Razones de desuso

Hay muchas razones posibles por las que una API podría quedar obsoleta. Algunas de las razones comunes por las que una API puede quedar obsoleta son:

### API antigua

A medida que el juego evoluciona, la API puede representar conceptos que ya no existen en el juego principal.

Lo más probable es que la API anterior no funcione y/o se comporte inesperadamente en versiones más nuevas del juego, por lo que es posible que se programe su eliminación.

### API duplicada

Dado que Paper solía ser posterior a Spigot, ocasionalmente puede incluir API agregadas por Spigot que chocan con lo que Paper ya tiene. Normalmente, Paper desaprobará la API de Spigot en favor de su propia API.

Sin embargo, en los casos en los que upstream ofrece una API más potente, la de Paper puede quedar obsoleta.

### API obsoleta
Paper se esfuerza por mejorar las API que quizás ya estén incluidas. Puede haber algunos casos en los que hayamos creado nuevas API para ofrecerlas como reemplazo de otras.

Se espera que la API obsoleta funcione en el futuro lejano y es posible que no se programe su eliminación durante un período de tiempo considerable.
