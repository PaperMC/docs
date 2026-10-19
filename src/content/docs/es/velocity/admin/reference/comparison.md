---
title: Comparación con otros proxies
description: Comparación de Velocity con otros proxies.
slug: es/velocity/comparisons-to-other-proxies
---

Probablemente ya sabes lo que Velocity puede ofrecerte. Pero ¿cómo se compara con
las demás soluciones disponibles? Al fin y al cabo, queremos convencerte de que uses Velocity, así que este documento
quizá esté algo sesgado a nuestro favor.

## Descripción general

:::danger

**El equipo de Paper recomienda encarecidamente usar Velocity en lugar de Waterfall y BungeeCord**. Waterfall ha llegado al final de su vida útil. Todo el desarrollo futuro
de PaperMC se realiza en Velocity. Para más información, consulta el [anuncio](https://forums.papermc.io/threads/1088/).

:::

Este es un breve resumen de las diferencias entre Velocity y otros programas de proxy populares. Consulta los detalles a continuación.
| Función                                  | BungeeCord | Waterfall | Velocity |
|------------------------------------------|------------|-----------|----------|
| Eficiencia de recursos                   | ❌         | ✅        | ✅✅     |
| Plugins de Velocity                       | ❌         | ❌        | ✅       |
| Plugins de BungeeCord                     | ✅         | ✅        | 🟨*      |
| Reenvío seguro de información de jugadores| ❌         | ❌        | ✅       |
| API compatible con funciones modernas de Minecraft | ❌ | ❌ | ✅ |
| Desarrollo activo                         | ❓         | ❌        | ✅       |
| Mejor compatibilidad con mods             | ❌         | ❌        | ✅*\*    |

\* _La API de Velocity no admite plugins creados para BungeeCord/Waterfall, pero se puede instalar [Snap](https://hangar.papermc.io/Phoenix616/Snap) para obtener compatibilidad experimental.
 El proyecto Velocity no mantiene Snap ni está afiliado a él._

\** _Compatibilidad completa con Forge de 1.7 a 1.12.2 y 1.20.2 o posterior._

## BungeeCord y sus derivados

No podemos analizar en profundidad toda la historia del software de proxy para Minecraft; te recomendamos el
[excelente artículo de Me4502](https://madelinemiller.dev/blog/decade-of-minecraft-multiplayer/), que
describe en detalle el mundo del multijugador de Minecraft.

### BungeeCord

Cuando inició el proyecto, el autor original de Velocity tenía más de 5 años de experiencia
usando BungeeCord y conocía a fondo sus peculiaridades.

Hay varios motivos por los que intentar mejorar BungeeCord era una causa perdida:

- BungeeCord es muy conservador con los cambios de API. Si un cambio rompe un plugin creado hace
  5 años por un desarrollador inactivo, no hay mucho que hacer.
- Los cambios que sí afectan a la API suelen responder a casos de uso muy específicos y de nicho; se desaprueban los cambios
  sustanciales (como demuestra la compatibilidad con colores RGB en `ChatColor`).
- El proyecto se gestiona, en esencia, como una catedral. En BungeeCord (y en su proyecto hermano, Spigot),
  la palabra de md_5 es ley. Una sencilla contribución para corregir un problema de seguridad le valió al desarrollador principal
  de Velocity al menos dos reprimendas de md_5.
- BungeeCord es abiertamente hostil a la continuidad de la compatibilidad con mods de Minecraft.
- Desde el lanzamiento de la primera versión de BungeeCord en 2012, han aparecido nuevas API de mods para _Minecraft_.
  Es hora de crear una API nueva y mejorada que evite los errores de la API de BungeeCord y se inspire en las nuevas API de mods de Minecraft.

### Waterfall

En parte gracias a la experiencia que adquirió con BungeeCord, el autor fundó el
proyecto Waterfall en 2016 como una bifurcación de BungeeCord, inspirada en Paper y con el objetivo explícito de
mejorar BungeeCord. _Probamos el siguiente paso lógico_.

Conoce la [ley de Hyrum](https://www.hyrumslaw.com/):

> With a sufficient number of users of an API, it does not matter what you promise in the contract:
> all observable behaviors of your system will be depended on by somebody.

Esta es la ley de Hyrum en forma de cómic, por si ayuda a entender la idea:

> <span class="img-inline">[![xkcd #1172](https://imgs.xkcd.com/comics/workflow.png)](https://xkcd.com/1172/)</span>
>
> ["Workflow"](https://xkcd.com/1172/), cómic de [xkcd](https://xkcd.com/) creado por Randall Munroe,
> con [licencia](https://xkcd.com/license.html)
> [CC BY-NC 2.5](https://creativecommons.org/licenses/by-nc/2.5/)

La mayoría de los plugins de BungeeCord dependen en gran medida de los comportamientos y peculiaridades específicos que expone BungeeCord,
que Velocity no puede reproducir a la perfección. Por eso, son muy pocos los cambios que se pueden hacer
a BungeeCord sin que los plugins dejen de comportarse igual.

Supongamos que juegas a un videojuego publicado por la Empresa A y que se ejecuta en un sistema operativo de la Empresa B.
Un día, la Empresa B publica una nueva versión del sistema operativo y la actualizas, solo para descubrir con horror
que el juego ya no funciona. (Peor aún: quizá el Estudio A ya haya cerrado y no vaya a publicar ningún parche.) ¿A quién culpas,
a la Empresa A por crear un producto defectuoso o a la Empresa B por romper el juego? [No es una situación hipotética](https://devblogs.microsoft.com/oldnewthing/20110131-00/?p=11633).

Podemos señalar un ejemplo en el que
[un intento](https://github.com/PaperMC/Waterfall/commit/c8eb6aec7bac82fd309fa6d6113b8a0418317b01)
para mejorar la gestión de los marcadores en 1.13 y posteriores
[se revirtió](https://github.com/PaperMC/Waterfall/issues/255) porque los plugins dependían del comportamiento defectuoso
de BungeeCord. En este punto, resulta bastante obvio por qué era mejor romper por completo con esa compatibilidad. Como ocurrió al principio de la vida del proyecto Velocity, probablemente
fue un motivo importante, aunque sin duda no el único.

### Un Velocity hipotético basado en la API de BungeeCord

Tenemos que mencionarlo brevemente porque fue un tema que surgió en los primeros días del
proyecto. Podríamos haber basado Velocity en la API de BungeeCord (o en una derivada, como la
API de Waterfall).

Esto conlleva los mismos problemas que Waterfall, quizá incluso más, ya que tendríamos que reproducir de forma independiente _todo_ el comportamiento
de la API de BungeeCord. El proyecto Wine lleva más de tres décadas intentando ofrecer
una capa de compatibilidad que permita ejecutar programas de Windows en Linux y otros sistemas operativos. Su trabajo
sigue en curso. Es difícil reproducir el comportamiento del entorno de otro sistema operativo.
Los autores de ReactOS lo tienen aún más difícil: intentan reproducir todas las peculiaridades de Windows, incluido el
kernel, y han tomado como referencia una versión de Windows publicada hace dos décadas. Su trabajo está todavía más lejos de completarse que el de Wine.

Tendríamos que dedicar mucho tiempo a fingir que Velocity se comporta exactamente igual que BungeeCord.
Rechazamos esta opción deliberadamente. No merece la pena.
