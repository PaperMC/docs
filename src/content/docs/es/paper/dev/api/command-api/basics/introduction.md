---
title: Introducción
description: Una guía para la API de comando Brigadier de Paper.
slug: es/paper/dev/command-api/basics/introduction
---
El sistema de comando de Paper está construido sobre el sistema de comando Brigadier de Minecraft. Este sistema proporciona una forma potente y flexible de definir comandos y argumentos. Ofrece muchas ventajas sobre el sistema de comando Bukkit, ampliamente utilizado anteriormente:
- Menos análisis o verificación de errores requeridos por el desarrollador para los argumentos.
- Mejor experiencia de usuario con comprobación de errores del cliente.
- Integración con eventos de recarga, permitiendo la definición de comandos utilizables en paquetes de datos.
- Creación más sencilla de subcomandos.
:::note
Para ver una comparación entre el nuevo sistema Brigadier y el antiguo sistema Bukkit, [haga clic aquí](/es/paper/dev/command-api/misc/comparison-bukkit-brigadier).
:::
## Guía
:::tip
Si la API Brigadier parece demasiado complicada, puede comenzar con [comandos básicos](/es/paper/dev/command-api/misc/basic-command). Proporcionan una forma sencilla de crear comandos, con sólo una pequeña curva de aprendizaje.
:::
Vale la pena visitar primero los siguientes sitios cuando aprenda sobre Brigadier:
- [El árbol de comandos](/es/paper/dev/command-api/basics/command-tree)
- [Argumentos y literales](/es/paper/dev/command-api/basics/arguments-and-literals)
- [Ejecutores de comandos](/es/paper/dev/command-api/basics/executors)
- [Registro de comando](/es/paper/dev/command-api/basics/registration)
- [Requisitos de comando](/es/paper/dev/command-api/basics/requirements)
- [Sugerencias de argumentos](/es/paper/dev/command-api/basics/argument-suggestions)
- [Argumentos personalizados](/es/paper/dev/command-api/basics/custom-arguments)

Para obtener una referencia de argumentos más avanzados, debería buscar aquí:
- [Argumentos de Minecraft](/es/paper/dev/command-api/arguments/minecraft)
:::danger[Páginas futuras]
Las siguientes páginas se agregarán a la documentación en el futuro:

- **Tutorial: Creación de comandos de utilidad**
- **El despachador de comandos**
- **Bifurcaciones y redirecciones**
- **Tutorial: Ampliación del comando de ejecución básica**
:::
## Soporte adicional
Para obtener ayuda con respecto a la API de comandos, siempre puedes preguntar en nuestro [servidor de Discord](https://discord.gg/PaperMC) en el canal [`#paper-dev`](https://discord.com/channels/289587909051416579/555462289851940864).
