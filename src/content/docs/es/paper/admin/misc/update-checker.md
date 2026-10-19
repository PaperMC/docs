---
title: Comprobador de actualizaciones
description: Documentación del comprobador automático de actualizaciones integrado en Paper.
slug: es/paper/misc/update-checker
---

Desde la versión 1.21.11, Paper incluye un comprobador de actualizaciones que avisa a los administradores del servidor al iniciarlo si hay una nueva versión de Paper disponible.

## Cómo funciona

Al iniciarse, Paper compara su versión actual con la última versión disponible en el canal estable de los servidores de PaperMC.
Si encuentra una versión más reciente, imprimirá un aviso en la consola y en los registros del servidor.

También puedes buscar actualizaciones manualmente en cualquier momento ejecutando el comando `version` en la consola del servidor (o dentro del juego si tienes el permiso `bukkit.command.version`).

## Qué información se envía

El comprobador de actualizaciones envía la siguiente información a los servidores de PaperMC:
- La versión actual de Paper
- La dirección IP de cliente de tu servidor (como ocurre con cualquier solicitud http)

Actualmente, PaperMC no almacena ni analiza esta información, aunque las solicitudes pasan por CloudFlare.

## Configuración
Puedes desactivar el comprobador de actualizaciones en el archivo de configuración `paper-global.yml`. La sección correspondiente es la siguiente:

```yaml title="config/paper-global.yml"
update-checker:
  enabled: false
```

También puedes desactivarlo añadiendo el siguiente argumento de JVM al iniciar el servidor:

```bash
-Dpaper.disableStartupVersionCheck
```
