---
title: Plugins de Paper
description: Guía sobre los aspectos básicos y avanzados de los plugins de Paper.
slug: es/paper/reference/paper-plugins
---

Esta página explica los nuevos conceptos y las posibles confusiones que pueden surgir con los plugins de Paper.

:::note

Los desarrolladores pueden obtener más información sobre los plugins de Paper [aquí](/es/paper/dev/getting-started/paper-plugins).

:::

## ¿Qué son?

Los plugins de Paper son plugins que carga el nuevo framework de carga de plugins de Paper. Los desarrolladores los usan para
aprovechar sistemas modernos que ofrece Mojang, como los paquetes de datos.

![Lista de plugins](../../../../paper/admin/reference/assets/plugin-list.png)

## ¿En qué se diferencian?

Cuando están habilitados, los plugins de Paper son **idénticos** a los de Bukkit. Esto permite que los plugins se comuniquen entre sí y sean totalmente compatibles; es decir, tanto
los plugins de Bukkit como los de Paper pueden depender unos de otros sin problemas.

Los plugins de Paper solo se pueden cargar con el cargador de plugins de Paper y pueden usar API nuevas que no están disponibles para los plugins de Bukkit.

### ¿Cómo añado plugins de Paper?

Los plugins de Paper se añaden igual que los de Bukkit, así que puedes seguir [esta guía](/es/paper/adding-plugins).

### Carga cíclica de plugins

Con la introducción de los plugins de Paper, Paper incorpora un nuevo cargador que corrige algunos problemas peculiares.
Sin embargo, como consecuencia, ya no se admite la [carga cíclica](/es/paper/dev/getting-started/paper-plugins#cyclic-plugin-loading) entre plugins.

Si Paper detecta un ciclo, el servidor se cerrará y mostrará un error.

:::danger[Heredado]

Si tu servidor **requiere** esta carga circular, puedes habilitarla añadiendo el indicador de inicio [`-Dpaper.useLegacyPluginLoading=true`](/es/paper/reference/system-properties#paperuselegacypluginloading).
Ten en cuenta que puede dejar de admitirse en el futuro.

:::
