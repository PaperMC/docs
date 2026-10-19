---
title: Guía de migración
description: Cómo migrar tu proxy entre distintas versiones de Velocity.
slug: es/velocity/migration
---

¿Es la primera vez que usas Velocity o vas a actualizarlo a una versión nueva? Esta página resume lo que
debes tener en cuenta para realizar una migración correctamente.

## Migrar de Velocity 1.0.x a Velocity 1.1.0

Pasar de Velocity 1.0.x a Velocity 1.1.0 debería ser tan sencillo como reemplazar el JAR de Velocity
y reiniciar el proxy. Quizá quieras hacer una copia de seguridad de `velocity.toml` y luego eliminar el archivo actual
para que Velocity lo vuelva a generar e incluya los nuevos ajustes que introduce Velocity 1.1.0.
