---
title: Registro
description: Una guía para registrar comandos de brigadier.
slug: es/paper/dev/command-api/basics/registration
---
En los capítulos anteriores, analizamos exhaustivamente cómo funciona Brigadier, pero nunca explicamos cómo registrar comandos. ¡Así que lo haremos aquí mismo!

## El administrador de eventos del ciclo de vida
En Paper, los comandos de Brigadier se registran utilizando el `LifecycleEventManager`. Esta es una clase especial que nos permite registrar comandos de tal manera que nunca tengamos que preocuparnos por manejar varios eventos de recarga del servidor, como `/reload`. En cambio, todo lo que registremos usando el `LifecycleEventManager`, se volverá a registrar cada vez que sea necesario.

Pero ¿cómo se accede a un `LifecycleEventManager` capaz de registrar comandos? Hay dos "contextos" en los que puede utilizar LifecycleEventManager. El primero, y el preferido, está en la clase `PluginBootstrap` de nuestro complemento.

### Registrarse dentro del programa previo del complemento
:::note
Esto requiere que utilice un [complemento de Paper](/es/paper/dev/getting-started/paper-plugins) (con un `paper-plugin.yml`).

Si no está utilizando `paper-plugin.yml`, puede [registrar sus comandos dentro de la clase principal de su complemento](#registering-inside-the-plugins-main-class).
:::
Podemos obtener acceso a un `LifecycleEventManager` capaz de registrar comandos ejecutando `context.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, event -> {})` dentro de nuestro método bootstrap, así:
```java title="ExamplePluginBootstrap.java"
public final class ExamplePluginBootstrap implements PluginBootstrap {

    @Override
    public void bootstrap(final BootstrapContext context) {
        context.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, event -> {
            // Registra tus comandos aquí...
        });
    }
}
```
Un resumen rápido de lo que significa todo esto: al ejecutar `context.getLifecycleManager()`, obtenemos un objeto `LifecycleEventManager<BootstrapContext>`. Podemos llamar al `LifecycleEventManager#registerEventHandler(LifecycleEventType, LifecycleEventHandler)` para registrar nuestro evento de ciclo de vida. El primer parámetro declara el tipo de evento del ciclo de vida para el que queremos registrar el controlador, el segundo parámetro es una interfaz que se ve así:
```java
@FunctionalInterface
public interface LifecycleEventHandler<E extends LifecycleEvent> {
    void run(E event);
}
```
Debido a que es una interfaz funcional, podemos, en lugar de implementarla, simplemente pasar una lambda que tiene un parámetro, `E`, y ningún valor de retorno. El tipo genérico `E` es `ReloadableRegistrarEvent<Commands>`, que por lo tanto también es el tipo de nuestro parámetro lambda.

La clase `ReloadableRegistrarEvent<Commands>` tiene dos métodos: `ReloadableRegistrarEvent.Cause cause()` y `Commands registrar()`. El método más relevante para nosotros es el `registrar`. Con él podremos registrar nuestros comandos.
:::tip
El registro de comandos en el programa previo del complemento permite que las funciones del paquete de datos utilicen sus comandos en una etapa más temprana del proceso de inicio del servidor.
:::
### Registrarse dentro de la clase principal del complemento
Obtener acceso a un `LifecycleEventManager` para comandos dentro de la clase principal de nuestro complemento es muy similar a cómo acceder a él dentro de la clase PluginBootstrap, con la diferencia de que en lugar de obtener el `LifecycleEventManager` usando el `BootstrapContext` que se nos proporcionó en el método de arranque de nuestra clase PluginBootstrap, podemos simplemente recuperarlo usando `Plugin#getLifecycleManager`.
```java title="ExamplePlugin.java"
public final class ExamplePlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        this.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, event -> {
            // Registra tus comandos aquí...
        });
    }
}
```
Esto sigue el mismo concepto que el de PluginBootstrap, solo que en lugar de recibir un `LifecycleEventManager<BootstrapContext>`, se nos da un `LifecycleEventManager<Plugin>`. Esto realmente no importa para nuestros casos de uso, pero es mejor que lo sepas. El resto de los métodos funcionan exactamente de la misma manera que con el `PluginBootstrap` parametrizado `LifecycleEventManager`.

## Registrar comandos usando la clase Comandos
Ahora que tenemos acceso a la instancia de una clase `Commands` a través de `event.registrar()` en nuestro controlador de eventos, tenemos acceso a algunas sobrecargas del método `Commands#register`.

### Registro de un LiteralCommandNode
La mayor parte del tiempo, utilizará un `LiteralArgumentBuilder` para construir su árbol de comandos. Para recuperar un `LiteralCommandNode` de ese objeto, necesitamos llamar al método `LiteralArgumentBuilder#build()`:
```java
LiteralArgumentBuilder<CommandSourceStack> command = Commands.literal("testcmd")
    .then(Commands.literal("argument_one"))
    .then(Commands.literal("argument_two"));

LiteralCommandNode<CommandSourceStack> buildCommand = command.build();
```
O en resumen:
```java
LiteralCommandNode<CommandSourceStack> buildCommand = Commands.literal("testcmd")
    .then(Commands.literal("argument_one"))
    .then(Commands.literal("argument_two"))
    .build();
```
Ahora que hemos recuperado nuestro `LiteralCommandNode`, podemos registrarlo. Para eso contamos con múltiples sobrecargas, que opcionalmente nos permiten establecer alias y/o la descripción. Registrar nuestro "testcmd" podría verse así:
```java
context.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, event -> {
    event.registrar().register(buildCommand);
});
```
### Registro de un comando básico
Un [](jd:paper:io.papermc.paper.command.brigadier.BasicCommand) es una forma similar a Bukkit de definir comandos. En lugar de crear un árbol de comandos, permitimos todas las entradas del usuario y recuperamos los argumentos como una simple matriz de cadenas. Este tipo de comandos es particularmente útil para comandos muy simples basados ​​en texto, como el comando `/broadcast`. Puede leer más detalles sobre los comandos básicos [aquí](/es/paper/dev/command-api/misc/basic-command).

Suponiendo que ya tienes tu objeto `BasicCommand`, podemos registrarlo así:
```java
final BasicCommand basicCommand = ...;

this.getLifecycleManager().registerEventHandler(LifecycleEvents.COMMANDS, event -> {
    event.registrar().register("commandname", basicCommand);
});
```
Al igual que en `LiteralCommandNode`, también tenemos sobrecargas para configurar información adicional para nuestro comando.

## Referencia adicional
* Para obtener una referencia rápida sobre LifecycleEventManager, haga clic [aquí](/es/paper/dev/lifecycle).
