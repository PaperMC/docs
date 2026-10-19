---
title: Actualizar
description: Paper incorpora nuevas funciones y correcciones todos los días; esta guía explica el proceso de actualización.
slug: es/paper/updating
---

Actualizar Paper es una parte importante de la administración de cualquier servidor. Como todos los días se incorporan nuevas funciones y correcciones,
recomendamos actualizar al menos una vez por semana para proteger el servidor frente a los errores más recientes.
Instalar actualizaciones es muy sencillo, pero es importante saber hacerlo correctamente.

:::caution[No sustituyas archivos JAR mientras el servidor esté en ejecución]

A menos que sepas exactamente qué haces y por qué, nunca es buena idea sustituir archivos JAR mientras el servidor está en ejecución,
ya sean plugins o el propio Paper.

:::

## Paso 1. Crear una copia de seguridad

:::tip

Si usas un servicio de alojamiento compartido, puede que el proveedor incluya una función para crear copias de seguridad. Consulta su
documentación antes de continuar.

:::

Este es el paso más importante y, aun así, el que más se suele omitir. Aunque es poco probable que
actualizar Paper por sí solo cause problemas que requieran restaurar una copia de seguridad, ¡los fallos de plugins
u otros accidentes sí podrían hacerlo! Aprovecha la actualización para crear una copia de seguridad. Contar con copias
de seguridad funcionales es esencial para cualquier servidor, grande o pequeño. Los elementos principales que debes respaldar son:

- Las carpetas de los mundos
- Los archivos de configuración del servidor
- Los archivos de configuración y los JAR de los plugins

Procura tener copias de seguridad de distintos momentos y guardarlas en un lugar seguro. Una opción habitual
es mantener copias rotativas, de modo que siempre conserves una cantidad determinada de copias correspondientes a un período concreto.

## Paso 2. Actualizar plugins

Al igual que es importante actualizar Paper, también lo es mantener los plugins al día. Nunca sabes en qué pueden estar trabajando sus autores:
correcciones de errores o nuevas funciones.

Una función poco conocida de los servidores Paper es la carpeta `update`. Así se usa:

1. Crea una carpeta llamada `update` dentro de la carpeta `plugins`.
2. Descarga uno por uno los plugins que quieras actualizar y colócalos en la carpeta `update`.
3. Reinicia el servidor. No elimines ni modifiques los plugins que estén fuera de la carpeta `update`.

De este modo, puedes actualizar todos tus plugins a la vez sin mantener el servidor apagado ni sustituir sus JAR mientras está en ejecución.
No es necesario reiniciar el servidor antes de actualizar Paper. Esta función te permite actualizar Paper y los plugins
al mismo tiempo, sin necesidad de períodos de inactividad adicionales.

## Paso 3. Actualizar Paper

:::tip

Si usas un servicio de alojamiento compartido, puede que el proveedor incluya una función de actualización. Consulta su
documentación antes de continuar.

:::

Actualizar Paper es muy sencillo.

1. Descarga un JAR nuevo desde [nuestra página de descargas](https://papermc.io/downloads).
2. Detén el servidor. No se recomienda sustituir el JAR de Paper mientras el servidor está en ejecución, ya que puede causar problemas.
3. Cambia el nombre del archivo descargado para que coincida con el indicado en el [comando de inicio](/es/paper/getting-started#ejecutar-el-servidor).
4. Sustituye el antiguo JAR de Paper por el nuevo archivo renombrado.
5. Inicia el servidor. Revisa el registro de inicio para asegurarte de que todo salga bien. Si hay conflictos o problemas
   con plugins, aparecerán aquí.

Para reducir al mínimo el tiempo de inactividad durante las actualizaciones, algunos administradores, en vez de sustituir el JAR del servidor,
suben uno nuevo y configuran el script de inicio para usarlo en el próximo reinicio. Ambas son estrategias de actualización válidas.

:::caution[Actualizaciones automáticas]

Aunque instalar actualizaciones automáticamente puede resultar práctico (y el [servicio de descargas](/es/misc/downloads-service) de Paper te lo
permite fácilmente), Paper no lo recomienda debido a la posibilidad de conflictos entre plugins
u otros problemas que quizá desconozcas. Supervisa siempre el proceso de actualización y revisa con atención
el registro del servidor después.

Si decides instalar actualizaciones automáticamente, ¡asegúrate de contar con una estrategia de copias de seguridad que funcione!

:::
