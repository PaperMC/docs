---
title: Ajustar Velocity
description: Cómo ajustar Velocity para mejorar aún más el rendimiento.
slug: es/velocity/tuning
---

Velocity ofrece un buen rendimiento desde el primer momento. Lo optimizamos a fondo: desde decisiones algorítmicas
inteligentes y el uso estratégico de bibliotecas nativas hasta el nivel de la JVM, para que esta tome mejores decisiones al optimizar el código.

## Alojar el proxy en Linux

Velocity incluye bibliotecas nativas de alto rendimiento y especialmente optimizadas para compresión y
cifrado, además de transportes nativos de Netty. Sin embargo, debido a limitaciones de compatibilidad,
solo se ha verificado que los binarios nativos compilados funcionen en Linux x86_64 y aarch64. Aunque Velocity no
necesita estas bibliotecas para funcionar, el rendimiento será menor sin ellas. Por eso recomendamos encarecidamente
ejecutar todas las implementaciones de producción de Velocity en Linux x86_64.

## Asignar los recursos del servidor correctamente

Siempre debes asignar la cantidad adecuada de heap y ancho de banda de red, y elegir una CPU apropiada para la
cantidad de jugadores que quieras tener simultáneamente en el proxy. Por ejemplo, es poco probable que puedas admitir a 1.000 jugadores en una Raspberry Pi Zero, pero tendrás muchas más
posibilidades con una CPU de servidor de gama alta reciente de Intel o AMD.

No existe una recomendación de hardware válida para todos los casos, solo pautas generales sobre la cantidad de
jugadores que puedes esperar:

- Prefiere una CPU con muchos núcleos, aunque su frecuencia sea menor. A diferencia del servidor de Minecraft, Velocity puede
  aprovechar los núcleos adicionales y el rendimiento de un solo hilo no es tan importante.
- Asegúrate de tener memoria suficiente para ejecutar Velocity, incluido el margen para la sobrecarga de la JVM y el
  sistema operativo. Como estimación mínima aproximada, duplica el tamaño del heap del proxy
  y añade 2 GB. Por ejemplo, para un proxy con un heap de 2 GB, procura disponer de al menos 6 GB de
  memoria.
- La velocidad del disco no es importante. Es recomendable tener una unidad de estado sólido, pero no es imprescindible.
  La capacidad del disco tampoco es importante.

### Notas especiales sobre las vulnerabilidades de la ejecución especulativa

Desde 2018, se han descubierto varias vulnerabilidades de seguridad relacionadas con la
[ejecución especulativa](https://en.wikipedia.org/wiki/Speculative_execution) que emplean las CPU modernas.

Las mitigaciones de estas vulnerabilidades pueden afectar considerablemente al rendimiento, sobre todo en
procesadores vulnerables a Meltdown, y el impacto es aún mayor al ejecutarse en una máquina virtual. Velocity,
como aplicación de red, es especialmente sensible a la pérdida de rendimiento que introducen estas mitigaciones.

Para reducir este impacto, recomendamos alojar el proxy en una máquina con una CPU que incluya mitigaciones
contra Spectre y Meltdown. Los procesadores lanzados a partir de 2019 suelen incluir medidas
de protección frente a Spectre y Meltdown.

Si usas una CPU vulnerable a Spectre o Meltdown y estás dispuesto a arriesgar la seguridad a cambio de
rendimiento, también es posible desactivar las mitigaciones de Spectre/Meltdown, según el sistema operativo.
Ten en cuenta que desactivas estas protecciones _bajo tu propia responsabilidad_. El
proyecto Velocity no recomienda desactivarlas.

## Asignar suficiente heap

Además de contar con suficiente CPU, memoria y ancho de banda, también debes asignar suficiente heap de Java
al proxy. Si no lo haces, puede producirse lag y, en casos graves, la máquina virtual de Java podría terminar el proxy
por falta de memoria.

Como regla general, asigna 512 MB por cada 500 jugadores, más una cantidad adicional para
tener cierto margen de error (normalmente 1 GB extra). Por ejemplo, si quieres admitir a 1.000 jugadores en un único
proxy, prevé asignar 2 GB de heap.

### Notas especiales para contenedores

**Si ejecutas Velocity en un contenedor (por ejemplo, con Kubernetes, Pterodactyl o Docker), no
asignes toda la memoria disponible al heap.** Si lo haces, es probable que el mecanismo del kernel que termina procesos
por falta de memoria (OOM Killer) detenga el proxy, quizá en el peor momento.

Una asignación segura (aunque conservadora) consiste en destinar al heap la mitad de la memoria
total que asignes al contenedor del proxy. Por ejemplo, si el proxy debe admitir a
1.000 jugadores, asigna 4 GB al contenedor y 2 GB de heap al proxy.

## Ajustar las opciones de inicio

También recomendamos ajustar las opciones de inicio. Actualmente recomendamos:

```
-XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15
```

Añade estas opciones después del comando `java` y antes del parámetro `-jar`.

### Explicación de las opciones

La mayoría de estas opciones ajustan el recolector de basura G1 para adaptarlo mejor a la carga de trabajo de Velocity.
Una de ellas (`-XX:MaxInlineLevel=15`) suele mejorar el rendimiento general.

Antes del lanzamiento de Java 9, el recolector de basura predeterminado era Parallel GC. Es un
recolector que detiene el mundo (stop-the-world) y realiza su trabajo en paralelo. El problema es que sus pausas suelen ser largas
y no son adecuadas para Minecraft (a menudo se manifiestan como picos de lag aparentemente inexplicables).

El recolector de basura que recomendamos para Velocity es G1, basado en regiones. Hay varios
motivos para recomendarlo:

- Ofrece un buen equilibrio entre rendimiento y duración de las pausas. El rendimiento indica aproximadamente cuánto
  trabajo puede realizar el proxy.
- Es compatible con la mayoría de las configuraciones (está disponible en Java 8, la versión más antigua que
  admitimos).

Las configuraciones que usan estas opciones suelen tener pausas del GC muy breves (menos de 10 milisegundos) cada pocos minutos,
lo que resulta muy conveniente para Minecraft.

### Otras configuraciones

:::caution

Si te apartas de la configuración que recomendamos, lo haces bajo tu propia responsabilidad.

:::

Velocity es una aplicación que suele ajustarse bastante a la hipótesis generacional. Además,
se ha optimizado para reducir al máximo la carga del recolector de basura.

#### ZGC

ZGC (el recolector de basura Z), introducido en Java 11 y estabilizado en Java 15, ha demostrado ser
eficaz en una implementación de Velocity a gran escala.

En esencia, ZGC es un recolector de basura concurrente y sin generaciones que prioriza la baja latencia
a costa del rendimiento. Dada la naturaleza de Velocity como proxy de red, donde el rendimiento también es importante,
recomendamos usar ZGC con cautela y solo con Java 15 o posterior.

El principal ajuste de ZGC es el tamaño del heap: si ZGC no puede recoger basura tan rápido como el proxy
la genera, los hilos que la producen se pausarán temporalmente y el proxy parecerá tener lag. Nuestras recomendaciones de tamaño del heap siguen siendo válidas, pero prepárate para asignar más
memoria al proxy si fuera necesario.

#### Shenandoah

Introducido en Java 11 y declarado estable en Java 15, Shenandoah es similar a G1 porque es un
recolector de basura concurrente y generacional, pero realiza más trabajo en paralelo.

El equipo de Velocity no conoce implementaciones exitosas de Shenandoah con Velocity en entornos reales.

#### OpenJ9

OpenJ9 es una alternativa a la JVM HotSpot, derivada de la JVM J9 de IBM y centrada principalmente en cargas de trabajo
en la nube. Por ello, se comporta de forma muy distinta a HotSpot y cuenta con un
conjunto de recolectores de basura completamente diferente.

El recolector de basura predeterminado `gencon` debería funcionar bien con Velocity.
