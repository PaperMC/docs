---
title: ViaVersion
slug: es/adventure/platform/viaversion
description: Uso de Adventure con ViaVersion.
---

:::danger

La implementación de la plataforma Adventure para ViaVersion ya no se mantiene.
El equipo de Adventure ya no ofrece asistencia para estas bibliotecas.

Recomendamos que quienes usan estas bibliotecas migren a plataformas modernas con [compatibilidad nativa con Adventure](/es/adventure/platform/native) (por ejemplo, Velocity, Paper y Sponge API 8 o posterior).

:::

En las plataformas compatibles (Sponge 7 y Bukkit), Adventure puede ampliar su funcionalidad
usando la API de [ViaVersion](https://hangar.papermc.io/ViaVersion/ViaVersion)
para enviar paquetes directamente al cliente. Por ejemplo, esto permite que un plugin de un servidor de Minecraft
1.7 envíe mensajes de chat y títulos RGB a clientes que usan versiones más recientes de Minecraft.

Si incluyes las plataformas Sponge o Bukkit, no tienes que hacer nada más: ViaVersion
se detectará y se habilitará su compatibilidad.
