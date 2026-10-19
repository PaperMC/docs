---
title: Análisis de rendimiento
description: Cómo analizar el rendimiento de tu servidor Paper.
slug: es/paper/profiling
---

El análisis de rendimiento permite diagnosticar problemas de rendimiento del servidor.
Un perfilador mide ciertas características de un servidor en ejecución: por ejemplo, con qué frecuencia se llama a un método
y cuánto tiempo consume en un solo tick, cuánto dura y con qué frecuencia se ejecuta el recolector de basura, entre otros datos.

:::caution

_Para que el análisis sea eficaz, el problema que intentas diagnosticar debe estar ocurriendo en ese momento._

:::

Si necesitas ayuda para analizar un problema de rendimiento, comparte un informe de spark en el
[servidor de Discord de PaperMC](https://discord.gg/PaperMC) (#paper-help).

## spark

Desde la versión 1.21, Paper incluye el perfilador [spark](https://spark.lucko.me/), que es la forma recomendada
de analizar el rendimiento de Paper.

Para empezar a analizar el rendimiento del servidor, ejecuta este comando:
```
/spark profiler start --timeout 600
```

Después de 10 minutos, se mostrará una URL al informe del perfilador. Puedes analizarlo por tu cuenta o compartirlo
con el desarrollador de un plugin o en los canales de asistencia de Paper.

Esto es solo una pequeña parte de lo que puede hacer spark. Si quieres conocer sus distintas funciones
o aprender a analizar informes por tu cuenta, consulta la documentación de spark [aquí](https://spark.lucko.me/docs/).

:::tip

Si quieres usar una versión de spark más reciente que la incluida, coloca el JAR independiente del plugin spark
en el directorio `plugins` y establece en `true` la propiedad del sistema
[`paper.preferSparkPlugin`](/es/paper/reference/system-properties#paperprefersparkplugin).

Si quieres usar [marcadores de posición](https://spark.lucko.me/docs/misc/Placeholders) de PlaceholderAPI
con la versión de spark incluida, debes instalar la [expansión de spark](https://api.extendedclip.com/expansions/spark/)
desde eCloud de PAPI (`/papi ecloud download spark` y `/papi reload`).

:::

## Timings

Paper también incluye el perfilador [Timings v2](https://timings.aikar.co/), pero lleva varios años sin mantenimiento
y sus informes son difíciles de interpretar para principiantes. Se ha dejado obsoleto en favor de
spark y está desactivado de forma predeterminada desde la versión 1.21. Consulta [este debate](https://github.com/PaperMC/Paper/discussions/10565)
para obtener más información.
