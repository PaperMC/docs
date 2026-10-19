---
title: Correcciones de errores
description: Explicación de los errores de Vanilla que corregimos en Paper.
slug: es/paper/misc/paper-bug-fixes
---

Paper corrige muchos problemas técnicos y de jugabilidad de Minecraft. Entre las correcciones más conocidas están las de duplicación de TNT y rotura de bedrock.

## Errores de Vanilla

Paper corrige muchos errores de Vanilla que Mojang no pretendía. Aplicamos estos parches para corregir comportamientos o evitar abusos e
inestabilidad en el servidor. Algunas correcciones se pueden configurar, ya que entendemos que ciertos servidores quizá quieran conservar el
comportamiento de Vanilla. Encontrarás estas opciones en la [configuración global](/es/paper/reference/global-configuration)
y en la [configuración por mundo](/es/paper/reference/world-configuration).

### ¿Qué se considera un comportamiento previsto y qué es un error?

Cuando alguien nos informa de un problema, consultamos el sistema de seguimiento de problemas de Mojang. Si ya se informó allí, comprobamos si:

1) Se confirmó que es un error
2) Tiene una prioridad asignada

Si cumple estos dos criterios, aceptaremos cambios para corregirlo, ya que Mojang puede tardar mucho en hacerlo
(a veces, años). Si Mojang rechaza un problema, normalmente no lo «corregimos», pues se considera un comportamiento previsto.

## Errores de duplicación

Como la duplicación de TNT se considera una forma de minería automatizada y no una duplicación de recursos, ofrecemos una opción para
restaurarla. Por desgracia, esto también vuelve a habilitar la duplicación de alfombras y raíles. Normalmente no ofreceríamos una opción de configuración para ello,
pero se trata del mismo error, así que no tenemos alternativa. La opción de configuración es la siguiente:

```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-piston-duplication: true
```

También puedes restaurar la posibilidad de duplicar bloques afectados por la gravedad, como la arena, mediante portales del End. No se
recomienda, ya que puede causar problemas en el servidor, pero ofrecemos una opción de configuración para restablecer esta función:
```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-unsafe-end-portal-teleportation: true
```

Si quieres volver a habilitar los exploits de duplicación con ganchos de cuerda, puedes hacerlo activando la siguiente opción:
```yaml title="config/paper-global.yml"
unsupported-settings:
  skip-tripwire-hook-placement-validation: true
```

:::caution
Activar esta opción no garantiza que funcionen todos los diseños de duplicadores de ganchos de cuerda.
Los diseños que dependen de una actualización de puerta en el mismo tick podrían seguir fallando debido al manejo de la física de bloques de Paper. Consulta
[la explicación del mantenedor](https://github.com/PaperMC/Paper/issues/12114#issuecomment-2660579220)
para obtener más contexto. La [implementación original](https://github.com/PaperMC/Paper/pull/12091)
se probó con [este diseño de duplicador](https://www.youtube.com/watch?v=sRYuZn4r9RY).
:::

## Rotura de bloques

También corregimos la posibilidad de romper bedrock y los marcos de portal del End. Ofrecemos una opción de configuración para restaurar esta
función, aunque no se recomienda:
```yaml title="config/paper-global.yml"
unsupported-settings:
  allow-permanent-block-break-exploits: true
```

## Nota final

No te ofreceremos asistencia si tienes problemas mientras estas opciones estén activadas, ya que pueden causar efectos secundarios imprevistos.
Tampoco se garantiza que estas opciones sigan admitiéndose en el futuro: su comportamiento puede cambiar o pueden eliminarse en cualquier momento.

Para conocer los motivos históricos por los que no ofrecemos opciones de configuración para muchos errores de duplicación, consulta:
[#3724](https://github.com/PaperMC/Paper/issues/3724)
