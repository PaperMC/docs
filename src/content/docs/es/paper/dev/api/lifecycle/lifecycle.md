---
title: API de ciclo de vida
description: Una introducción a la API del ciclo de vida de Paper.
slug: es/paper/dev/lifecycle
sidebar:
  label: Introduction
---
La API del ciclo de vida se puede utilizar para el registro relacionado con el ciclo de vida. Actualmente se utiliza al registrar [comandos de Brigadier](/es/paper/dev/command-api/basics/introduction) y modificar [registros](/es/paper/dev/registries/#create-new-entries) o [paquetes de datos](/es/paper/dev/lifecycle/datapacks/). Generalmente, los sistemas que se inicializan muy temprano en el proceso de inicio pueden aprovechar este sistema de eventos.

## Administrador de eventos del ciclo de vida

El [](jd:paper:io.papermc.paper.plugin.lifecycle.event.LifecycleEventManager) está vinculado a una instancia [](jd:paper:org.bukkit.plugin.Plugin) o a una [](jd:paper:io.papermc.paper.plugin.bootstrap.BootstrapContext) dependiendo de desde dónde acceda. Por ejemplo, en la clase principal de su complemento:
```java title="ExamplePlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
}
```
O, con un programa previo:
```java title="ExamplePluginBootstrap.java"
@Override
public void bootstrap(final BootstrapContext context) {
    final LifecycleEventManager<BootstrapContext> lifecycleManager = context.getLifecycleManager();
}
```
## Eventos del ciclo de vida

Después de obtener el `LifecycleEventManager` correcto, cree un controlador de eventos seleccionando un tipo de evento de [](jd:paper:io.papermc.paper.plugin.lifecycle.event.types.LifecycleEvents):
```java title="ExamplePlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    final PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler(event -> {
        // Handler del evento.
    });
}
```
### Configuración

Cada controlador creado se puede configurar de varias maneras. Las opciones de configuración disponibles dependen del tipo de evento en sí y variarán de un tipo de evento a otro.

#### Prioridad

Establecer la prioridad de un controlador puede determinar dónde se ejecuta en relación con otros controladores en el mismo tipo de evento. Cuanto menor sea el número, antes se ejecutará. La prioridad predeterminada es 0.

#### Monitorear

Marcar el controlador como monitor hará que se llame después de que se haya llamado a todos los demás controladores que no son monitores. Utilice esto únicamente para inspeccionar algún estado del evento. No modifique ningún estado en el controlador.

La prioridad y el estado del monitor son opciones exclusivas; configurar una restablecerá la otra.
```java title="ExamplePlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    final PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler(event -> {
        // Handler del evento.
    });
    config.priority(10); // sets a priority of 10
    // o
    config.monitor(); // marca el manejador como monitor
}
```
### Registrarse

Una vez que se ha configurado el controlador, se puede registrar con el administrador del ciclo de vida:
```java title="ExamplePlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    final PrioritizedLifecycleEventHandlerConfiguration<LifecycleEventOwner> config = LifecycleEvents.SOME_EVENT.newHandler(event -> {
        // Handler del evento.
    }).priority(10);
    lifecycleManager.registerEventHandler(config);
}
```
También existe una forma abreviada de registrar solo el controlador sin realizar ninguna configuración:
```java title="ExamplePlugin.java"
@Override
public void onEnable() {
    final LifecycleEventManager<Plugin> lifecycleManager = this.getLifecycleManager();
    lifecycleManager.registerEventHandler(LifecycleEvents.COMMANDS, event -> {
        // Handler del evento.
    });
}
```

:::note
Algunos tipos de eventos tienen comportamientos especiales que restringen ciertas mecánicas. La funcionalidad de recarga de complementos (a través de `/bukkit:reload` o `Server#reload()`) se desactiva si los complementos registran controladores en determinadas situaciones. Esto se debe a que las recargas del complemento tienen que descargar completamente el complemento y sus clases, lo cual es un problema si se debe ejecutar un evento mientras el complemento está descargado.
:::
## ¿Por qué existe esto?

Ya tenemos un sistema de eventos, ¿por qué necesitamos otro? Ésta es una pregunta justa. La respuesta es que algunos de estos eventos se activan mucho antes de que se creen las instancias `JavaPlugin`, antes de que se cree la instancia `MinecraftServer`, justo al comienzo del inicio del servidor. Esto puede ocurrir antes de que se hayan inicializado todos los registros, que es una de las primeras cosas que sucede en un servidor Vanilla. El sistema de eventos Bukkit existente no está diseñado para existir en este momento, y modificarlo para que admita este entorno es más problemático que simplemente tener un sistema separado para eventos específicos que pueden activarse durante esta inicialización temprana.
:::note[Explicación técnica]
Aquí hay una lista cada vez mayor de razones específicas por las que no podemos simplemente modificar el sistema de eventos existente para respaldar esta nueva necesidad de eventos:

- No puedes tener genéricos en los eventos de Bukkit porque no hay verificación de tiempo de compilación ya que son
  registrado reflexivamente. Esto es un problema porque la mayoría de los eventos seguirán un patrón muy similar, específicamente los eventos del registro. Si no podemos usar genéricos, habrá muchas clases inútiles.

- Otra razón es que el sistema existente tiene prioridades, pero siempre las tiene. con el ciclo de vida
  eventos, puede haber algunos eventos para los cuales no queremos admitir prioridades (en ese caso, se basaría únicamente en el orden de carga del complemento).

- Existe demasiado tarde. `HandlerList` y el registro de eventos utilizan la instancia `Plugin` que no existe,
  y no puede existir durante el programa previo. Cambiar esto requeriría una reescritura sustancial del sistema existente y probablemente confundiría a los usuarios de API que esperan que todos los `RegisteredListeners` tengan un complemento adjunto.

- Un nuevo sistema nos permite utilizar interfaces e implementaciones de servidor para eventos que dramáticamente
  los simplifica. Con el sistema Bukkit, podrías hacer esto con un evento de implementación del servidor que extienda el evento de API, pero las interfaces son más flexibles.

- Un nuevo sistema nos permite aplicar, en el momento de la compilación, qué eventos puede registrar y dónde según el
  contexto del registro. Por lo tanto, ni siquiera puede registrar un controlador para un evento en el lugar equivocado, eso será un error del compilador gracias a nuestra implementación que utiliza genéricos.
:::
