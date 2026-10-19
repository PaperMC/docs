---
title: Compatibilidad con Folia y Paper
description: Cómo admitir tanto Folia como Paper dentro de su complemento.
slug: es/paper/dev/folia-support
---
![](https://assets.papermc.io/brand/folia.png)

[Folia](https://github.com/PaperMC/Folia) es una bifurcación de Paper, que actualmente mantiene el equipo de PaperMC. Agrega la capacidad de dividir el mundo en regiones, como se describe con más detalle [aquí](/es/folia/reference/overview).

# Marcar el complemento como compatible con Folia

Los complementos no se pueden ejecutar en Folia si no tiene este campo en su paper-plugin.yml (o plugin.yml, respectivamente):
```yaml
folia-supported: true
```

:::danger
Marcar un complemento como compatible con Folia *no es suficiente* para admitir Folia. Debe desarrollar su complemento especialmente con la intención de respaldar a Folia, teniendo en cuenta las cosas mencionadas en esta página.
:::
# Comprobando Folia

Dependiendo de la plataforma en la que se ejecute su complemento, es posible que necesite implementar funciones de manera diferente. Para ello, puede utilizar este método de utilidad para comprobar si el servidor actual está ejecutando Folia:
```java
private static boolean isFolia() {
    return ServerBuildInfo.buildInfo().isBrandCompatible(Key.key("papermc", "folia"));
}
```
## Programadores

Para admitir Paper y Folia, debe utilizar el programador correcto. Folia tiene diferentes tipos de programadores que pueden usarse para diferentes cosas. Ellos son:

- [Global](#global-scheduler)
- [Región](#region-scheduler)
- [Asíncrono](#async-scheduler)
- [Entidad](#entity-scheduler)

Si utiliza estos programadores cuando ejecuta Paper, se manejarán internamente para proporcionar la misma funcionalidad que si estuviera ejecutando Folia.

### Programador global
Las tareas que ejecute en el planificador global se ejecutarán en la región global; consulte [aquí](/es/folia/reference/overview#global-region) para obtener más información. Debe utilizar este planificador para cualquier tarea que no pertenezca a una región en particular. Puede obtenerlo así:
```java
GlobalRegionScheduler globalScheduler = server.getGlobalRegionScheduler();
```
### Programador de región
El programador de la región estará a cargo de ejecutar tareas para la región propietaria de una determinada ubicación. No utilice este programador para operaciones en entidades, ya que este programador está vinculado a la región. Cada entidad tiene su [propio programador](#entity-scheduler) que lo seguirá en todas las regiones. Como ejemplo, digamos que quiero establecer un bloque en una colmena:
```java
Location locationToChange = ...;
RegionScheduler scheduler = server.getRegionScheduler();

scheduler.execute(plugin, locationToChange, () -> {
    locationToChange.getBlock().setType(Material.BEEHIVE);
});
```
Pasamos la ubicación como parámetro a [](jd:paper:io.papermc.paper.threadedregions.scheduler.RegionScheduler), ya que necesita determinar en qué región ejecutar.

### Programador asíncrono
El programador asíncrono se puede utilizar para ejecutar tareas independientemente del proceso de tick del servidor. Esto se puede recuperar con:
```java
AsyncScheduler asyncScheduler = server.getAsyncScheduler();
```
### Programador de entidades
Los programadores de entidades se utilizan para ejecutar tareas en una entidad. Estos seguirán a la entidad a donde quiera que vaya, por lo que debes usarlos en lugar de los programadores de región.
```java
EntityScheduler scheduler = entity.getScheduler();
```
