---
title: ¿Qué puede hacer Velocity por mí?
description: Explicación de por qué deberías usar Velocity.
slug: es/velocity/why-velocity
---

Creemos que Velocity es uno de los mejores proxies para _Minecraft_ y que pocos pueden superarlo. Sin embargo, nos diferenciamos de algunas
soluciones más establecidas y populares en aspectos importantes. Esto puede hacer que sea un poco más difícil recomendar Velocity. A menudo nos preguntan «¿por qué?».
Esta página responde a esa pregunta.

## Amplia experiencia

El fundador y desarrollador principal de Velocity (Tux) lleva desarrollando software de proxy para
_Minecraft: Java Edition_ desde 2013. Creó el plugin RedisBungee, contribuyó a BungeeCord
de 2014 a 2017 y también fundó el proyecto Waterfall, que dirigió de 2016 a 2017. De hecho, el
mantenedor actual de Waterfall le animó a crear un proxy completamente nuevo desde cero.

## Rendimiento líder

Velocity impulsa varias redes de Minecraft con muchos jugadores y consume menos recursos que la
competencia. La receta es sencilla.

### Sin reescritura de ID de entidades

Cuando un cliente de Minecraft se conecta a otro servidor de Minecraft, este le envía un ID que
identifica de forma única una conexión de jugador. Este ID se usa en los paquetes que envía el servidor para dirigirse al jugador.
Pero ¿qué ocurre cuando el jugador se conecta a un proxy que puede cambiar el servidor al que está conectado?

Otros proxies intentan resolver este problema reescribiendo los ID de entidad que hacen referencia al jugador actual,
cambiándolos del ID asignado por el servidor al que está conectado actualmente por el ID que recibió al conectarse al primer servidor
a través del proxy. Este enfoque suele ser complicado, provoca errores, reduce el rendimiento, rompe
mods y, en última instancia, no puede ofrecer una solución completa.

Sin embargo, el cliente de Minecraft permite cambiar su ID de entidad mediante una secuencia especial de paquetes.
Velocity aprovecha esta función y fuerza al cliente a cambiar su ID de entidad. Este
enfoque mejora el rendimiento y la compatibilidad con mods, y reduce los problemas causados por una reescritura incompleta
de los ID de entidades.

### Ir más allá

Velocity va más allá de optimizar la gestión del protocolo de Minecraft. Una gestión inteligente del
protocolo ofrece mejoras de rendimiento notables, pero para ir aún más lejos hay que profundizar.

Una forma de mejorar considerablemente el rendimiento y la capacidad de procesamiento es aumentar la velocidad de
compresión de los paquetes enviados al cliente. En las plataformas compatibles (Linux x86_64 y aarch64),
Velocity puede sustituir la biblioteca zlib (que implementa el algoritmo de compresión usado por
el protocolo de Minecraft) por [libdeflate](https://github.com/ebiggers/libdeflate), que es el doble de
rápida que zlib con una proporción de compresión similar.

Velocity también emplea varios trucos para sacar partido al compilador JIT (just-in-time). Estos
trucos requieren un conocimiento profundo del funcionamiento de Java, pero hemos aplicado ese esfuerzo
para obtener un mayor rendimiento.

### Políticas de estabilidad interna

Por último, Velocity no intenta mantener una API interna estable entre versiones menores y mayores.
Esto le permite ser más flexible y ofrecer mejoras de rendimiento y nuevas funciones en cada versión. Por ejemplo, Velocity 1.1.0 aportó mejoras de rendimiento enormes
y añadió muchas funciones importantes al romper partes de la API interna, sin dejar de mantener la compatibilidad con los plugins anteriores. En cambio, BungeeCord suele ser
muy conservador con los cambios incompatibles de la API; cuando los realiza, avisa con poca antelación y ni siquiera
aprovecha para mejorar a fondo la API modificada (por ejemplo, añadiendo compatibilidad con RGB a `ChatColor`).

### Tú tienes el control

Nos enorgullece haber optimizado Velocity para que sea el proxy con mejor rendimiento, pero si la velocidad
predeterminada no te basta, puedes ajustar fácilmente varias opciones de rendimiento en
`velocity.toml`.

## Seguridad mejorada

Velocity también ofrece más funciones de seguridad, algunas exclusivas. Bloqueamos de forma proactiva
tantos ataques de denegación de servicio como sea posible y contamos con un sistema exclusivo de reenvío de información de jugadores para Minecraft 1.13 o posterior, que requiere que el servidor y el proxy conozcan una clave acordada previamente.

## Estándares y compatibilidad con mods

A diferencia de algunas plataformas que solo aparentan apoyar a la comunidad de mods (y que a veces incluso se muestran
hostiles), Velocity aprovecha toda la riqueza que ofrece Minecraft. Por ejemplo, contamos con un mod de Fabric que
[ayuda a conectar Velocity con los mods que amplían el protocolo de Minecraft](https://www.curseforge.com/minecraft/mc-mods/crossstitch)
y ofrecemos compatibilidad completa con Forge de la versión 1.7 a la 1.12.2 y la 1.20.2 o posterior. Velocity también admite
bibliotecas estándar emergentes de la comunidad, como [Adventure](https://github.com/PaperMC/adventure).
Colaboramos con la comunidad de modding de Minecraft.
