---
title: Indicadores de Aikar
description: Los indicadores de Aikar son un conjunto de indicadores de JVM diseñados para mejorar el rendimiento de tu servidor Paper.
slug: es/paper/aikars-flags
---

## Indicadores de inicio de JVM recomendados

:::caution[Generador de scripts]

**Esta página solo sirve como explicación.** Si quieres generar un script de inicio, visita
nuestro **[Generador de scripts](/es/misc/tools/start-script-gen)**.

:::

```bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper.jar --nogui
```

:::danger[¡No asignes toda la memoria disponible en un alojamiento compartido!]

Al definir los valores de `Xms` y `Xmx`, si tu proveedor indica que tienes 8 GB de memoria, **¡no uses 8 GB!**

Minecraft (y Java) necesitan memoria adicional además de la indicada por el parámetro `Xmx`. Se recomienda
**reducir `Xmx` y `Xms` en unos 1000-1500 MB** para evitar quedarte sin memoria o que `OOMKiller` cierre
el servidor. Así también dejas memoria disponible para el sistema operativo.

¿Tienes 8 GB de memoria? Por seguridad, usa 6500 MB.
_También puedes preguntar a tu proveedor si cubre esta sobrecarga y
te asigna 9500M. ¡Algunos lo hacen! Solo tienes que preguntar._

:::

## Memoria recomendada

**Recomendamos usar al menos entre 6 y 10 GB**, aunque haya pocos jugadores. Si no puedes permitirte 10 GB de
memoria, asigna tanta como puedas, pero asegúrate de dejar memoria para el sistema operativo. G1GC
funciona mejor con más memoria.

Sin embargo, a partir de cierto punto, más memoria no significa un mejor rendimiento. Llegarás a
un punto de rendimientos decrecientes. Comprar 32 GB de RAM para un servidor solo será un gasto
con beneficios mínimos.

## Registro de GC de Java

¿Tienes problemas con la generación antigua al usar estos indicadores? Añade los siguientes indicadores según tu versión de Java
para habilitar el registro de GC:

**Java 8-10**

```bash
-Xloggc:gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps
-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=1M
```

**Java 11+**

```bash
-Xlog:gc*:logs/gc.log:time,uptime:filecount=5,filesize=1M
```

El registro de GC no afecta al rendimiento y puede permanecer activado en todo momento. Los archivos no ocuparán
mucho espacio (5 MB).

## Explicación técnica de los indicadores

1.  **Por qué hacer coincidir -Xms con -Xmx:** Nunca deberías ejecutar el servidor con una configuración en la que `Xmx` pueda
    agotar toda la memoria del sistema. Debes asumir que el servidor podría usar todo el valor de
    `Xmx`. Asegúrate de que el sistema operativo tenga memoria adicional a la de `Xmx` para procesos ajenos a Minecraft o al propio sistema.
    Por tanto, no ejecutes Minecraft con un valor de `Xmx` que no puedas asumir que Java usará por completo.
    Esto significa que **si `Xms` es menor que `Xmx`, tienes memoria sin usar**. La memoria sin usar
    se desperdicia. G1 funciona mejor cuanta más memoria tiene. G1 elige de forma adaptativa cuánta memoria asignar a cada región
    para optimizar las pausas. Si tiene más memoria de la necesaria para alcanzar un tiempo de pausa óptimo,
    simplemente destinará el exceso a la generación antigua, sin efectos perjudiciales. La idea fundamental para mejorar el comportamiento del GC
    es garantizar que los objetos de corta duración mueran jóvenes y nunca se promuevan. Cuanta más memoria tenga G1,
    más probable será que los objetos no se promuevan prematuramente a la generación antigua. G1 funciona de forma distinta
    a los recolectores anteriores y puede gestionar heaps grandes con mayor eficiencia.

    Si no necesita la memoria asignada, no la utilizará. Todo el motor funciona de otra manera y no sufre por heaps demasiado grandes;
    es una recomendación ampliamente aceptada en el sector que, con G1, se mantengan iguales Xms y Xmx.

2.  **UnlockExperimentalVMOptions:** necesario para algunas de las opciones siguientes.

3.  **G1NewSizePercent:** Estos son algunos de los ajustes más importantes. Ahora puedes especificar porcentajes de
    un intervalo total deseado para la generación nueva. Con estos ajustes, indicamos a G1 que no use el
    5 % predeterminado para la generación nueva, sino el 40 %. **Minecraft tiene una tasa de asignación de memoria extremadamente
    alta**: puede llegar al menos a 800 MB por segundo en un servidor con 30 jugadores. La mayoría corresponde a objetos de corta duración (posiciones de bloques).

    Por eso, Minecraft necesita **realmente** dar más prioridad a la generación nueva para admitir esta tasa
    de asignación. Si la generación nueva es demasiado pequeña, se ejecutarán recolecciones de esa generación una o más veces
    por segundo, lo cual es muy perjudicial. Habrá tantas pausas que los TPS podrían verse afectados
    y el servidor no podrá asumir el costo de las recolecciones de basura. Además, los objetos se promoverán más rápido y la generación antigua crecerá con mayor rapidez. Con más espacio para la generación nueva,
    podemos ampliar los intervalos entre recolecciones de objetos jóvenes, dando más tiempo para que los objetos de corta duración mueran jóvenes y mejorando la eficiencia general del GC.

4.  **G1MixedGCLiveThresholdPercent:** Controla cuándo se incluyen regiones en las recolecciones mixtas de GC durante
    la recolección de la generación joven. Así se mantiene limpia la generación antigua sin ejecutar una recolección normal de esa generación. Si el uso de
    memoria está por debajo de este porcentaje, la generación antigua ni siquiera se incluirá en las recolecciones mixtas. Estas
    son menos costosas que una recolección completa de la generación antigua, así que las limpiezas incrementales pequeñas mantienen
    bajo el uso de memoria.

    El valor predeterminado varía entre 65 y 85 según la versión de Java. Lo establecemos en 90 para recuperar los residuos
    de la generación antigua lo más rápido posible y conservar tantas regiones libres como podamos.

5.  **G1ReservePercent=20:** En las versiones actuales, la tasa de asignación de memoria de Minecraft es extraordinariamente alta. Existe
    el riesgo de sufrir la temida «falta de espacio de destino» por no tener suficiente memoria libre para mover los datos.
    Este ajuste reserva más memoria para esa operación. El valor predeterminado es 10, así que añadimos otros 10 puntos.

6.  **MaxTenuringThreshold=1:** Minecraft tiene una tasa de asignación de memoria muy alta. La mayor parte
    de esa memoria se recupera en la generación eden. Sin embargo, los datos transitorios pasan a la
    generación survivor. Al principio probamos a eliminar por completo survivor y obtuvimos resultados aceptables, pero esto
    hace que los datos transitorios pasen a la generación antigua, lo cual no es conveniente. Max Tenuring 1 garantiza que no
    promovamos datos transitorios a la generación antigua; se supondrá que todo lo que sobreviva a dos ciclos de GC
    tiene una vida útil más larga.

    Esto reduce considerablemente las pausas en las recolecciones jóvenes, ya que copiar los datos de un objeto tenured hasta 15 veces en
    el espacio survivor lleva mucho tiempo cuando se trata de memoria realmente antigua. Lo ideal sería que el motor del GC
    registrara la edad media de los objetos y los promoviera antes, pero no funciona así.

    Como la frecuencia media del GC va de 10 segundos a varios minutos por recolección joven, esto no
    provoca que se promueva «basura»; solo retrasa la recolección de la memoria de mayor duración hasta las recolecciones mixtas.

7.  **SurvivorRatio=32:** Como hemos reducido drásticamente MaxTenuringThreshold, también reduciremos
    considerablemente el uso del espacio survivor. Así liberamos más regiones para que las use eden.

8.  **AlwaysPreTouch:** AlwaysPreTouch prepara y reserva la memoria al iniciar el proceso y garantiza
    que sea contigua, lo que mejora aún más su eficiencia. Esto aumenta la velocidad de acceso a memoria del sistema operativo.
    Es obligatorio usar Transparent Huge Pages.

9.  **+DisableExplicitGC:** Muchos plugins creen saber cómo administrar la memoria e intentan iniciar
    la recolección de basura. Esto provoca una recolección completa y un pico enorme
    de retraso. Este indicador impide que los plugins lo intenten y te protege de ese código
    defectuoso.

10. **MaxGCPauseMillis=200:** Este ajuste controla cuánta memoria se usa dentro de los límites mínimo
    y máximo especificados para la generación nueva. Es un «objetivo» para la duración de las pausas de recolección del servidor.
    Un valor de 200 supone perder como máximo 4 ticks. Esto provocará una breve caída de TPS, pero el servidor podrá recuperarla al instante,
    por lo que no tendrá un efecto significativo en los TPS. Los jugadores no perciben una pausa de 200 ms. En
    las pruebas, limitar este valor aún más impide que G1 recupere memoria lo bastante rápido y podría agotar la generación antigua, lo que desencadenaría una recolección completa.
    Que este valor sea 200 no significa que cada recolección dure 200 ms. Significa que puede tardar hasta
    200 ms si realmente lo necesita, y debemos dejar que haga su trabajo cuando haya memoria que recuperar.

11. **+ParallelRefProcEnabled:** Optimiza el proceso de GC para usar varios hilos al comprobar referencias débiles.
    No se sabe por qué no está habilitado de forma predeterminada...

12. **G1RSetUpdatingPauseTimePercent=5:** El valor predeterminado destina el 10 % del tiempo de pausa a actualizar los RSets;
    lo reducimos al 5 % para que una mayor parte se ejecute de forma concurrente y las pausas sean más cortas.

13. **G1MixedGCCountTarget=4:** El valor predeterminado es 8. Como buscamos hacer recolecciones más pausadas con menos uso de la generación antigua,
    intentamos recuperar su memoria más rápido para evitar agotarla.

14. **G1HeapRegionSize=8M+:** El valor predeterminado se calcula automáticamente. Es muy importante para Minecraft, especialmente
    en la versión 1.15, porque con poca memoria el cálculo predeterminado suele ser demasiado bajo. Cualquier
    asignación de memoria que ocupe la mitad de este tamaño (4 MB) se tratará como «Humongous», pasará directamente a
    la generación antigua y será más difícil de liberar. Si permites que Java use el valor predeterminado, una parte considerable de la memoria se tratará como Humongous.

15. **+PerfDisableSharedMem:** Hace que el GC escriba en el sistema de archivos, lo que puede causar mucha latencia si
    la E/S del disco es alta. Consulta https://www.evanjones.ca/jvm-mmap-pause.html.

### Páginas enormes transparentes

Es una función controvertida, pero puede servir si no puedes configurar HugeTLBFS real en tu alojamiento. Prueba
a añadir `-XX:+UseTransparentHugePages`, pero es imprescindible que también tengas establecido `AlwaysPreTouch`.
De lo contrario, es probable que THP afecte negativamente al rendimiento. No hemos medido cómo funciona THP con Minecraft ni su impacto junto con
`AlwaysPreTouch`, así que esta sección está dirigida a usuarios avanzados que quieran experimentar.
