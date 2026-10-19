---
title: API de comandos
description: Cómo crear comandos en Velocity.
slug: es/velocity/dev/command-api
---

La API de comandos permite crear comandos que pueden ejecutar los jugadores conectados al proxy
y la consola.

## Crear un comando

Cada clase de comando debe implementar una subinterfaz de [](jd:velocity:com.velocitypowered.api.command.Command).
La elección depende del tipo de argumentos y del nivel de detalle de las sugerencias que se ofrecen al cliente. Entre ellas se incluyen:

### [](jd:velocity:com.velocitypowered.api.command.BrigadierCommand)

Internamente, Velocity usa la biblioteca [Brigadier](https://github.com/Mojang/brigadier) para registrar
y distribuir las acciones de los comandos. Puedes registrar tus propios `CommandNode` envolviéndolos en un
`BrigadierCommand`. Veamos un ejemplo que responde «¡Hola, mundo!» en celeste a quien ejecute el comando.

```java title="TestBrigadierCommand.java" collapse={1-11} showLineNumbers
package com.example.velocityplugin;

import com.mojang.brigadier.arguments.StringArgumentType;
import com.mojang.brigadier.Command;
import com.mojang.brigadier.tree.LiteralCommandNode;
import com.velocitypowered.api.command.BrigadierCommand;
import com.velocitypowered.api.command.CommandSource;
import com.velocitypowered.api.command.VelocityBrigadierMessage;
import com.velocitypowered.api.proxy.ProxyServer;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;

public final class TestBrigadierCommand {

  public static BrigadierCommand createBrigadierCommand(final ProxyServer proxy) {
    LiteralCommandNode<CommandSource> helloNode = BrigadierCommand.literalArgumentBuilder("test")
      // Aquí puedes filtrar quién puede ejecutar el comando.
      // Este es el lugar ideal para comprobar los permisos con "hasPermission".
      .requires(source -> source.hasPermission("test.permission"))
      // Aquí puedes añadir la lógica que se ejecutará al usar
      // el comando "/test" sin argumentos.
      .executes(context -> {
        // Aquí obtienes quién ejecutó el comando.
        CommandSource source = context.getSource();

        Component message = Component.text("¡Hola, mundo!", NamedTextColor.AQUA);
        source.sendMessage(message);

        // Devolver Command.SINGLE_SUCCESS indica que el comando se ejecutó correctamente.
        // Devolver BrigadierCommand.FORWARD enviará el comando al servidor.
        return Command.SINGLE_SUCCESS;
      })
      // Con el método "then" puedes añadir argumentos secundarios al comando.
      // Por ejemplo, este subcomando se ejecuta al usar "/test <algún argumento>".
      // RequiredArgumentBuilder permite definir argumentos cuyo valor se introduce al ejecutar el comando.
      // Este ejemplo usa StringArgumentType.word(), que acepta una sola palabra,
      // pero también puedes usar otros tipos de argumentos de Brigadier
      // que devuelven valores booleanos, enteros, decimales, cadenas y otros tipos.
      .then(BrigadierCommand.requiredArgumentBuilder("argument", StringArgumentType.word())
        // Aquí puedes definir las sugerencias si ArgumentType no ofrece ninguna.
        // En este ejemplo, se sugieren los nombres de todos los jugadores conectados.
        .suggests((context, builder) -> {
          // Aquí sugerimos los nombres de los jugadores junto con una descripción emergente,
          // que puede explicar un argumento o servir como decoración.
          proxy.getAllPlayers().forEach(player -> builder.suggest(
              player.getUsername(),
              // VelocityBrigadierMessage recibe un componente.
              // En este caso, el nombre del jugador se muestra con un degradado
              // arcoíris creado con MiniMessage.
              VelocityBrigadierMessage.tooltip(
                  MiniMessage.miniMessage().deserialize("<rainbow>" + player.getUsername())
              )
          ));
          // Si no necesitas añadir una descripción emergente a la sugerencia,
          // o si el comando solo está pensado para versiones anteriores a Minecraft 1.13,
          // puedes omitirla: los clientes antiguos no la mostrarán.
          builder.suggest("all");
          return builder.buildFuture();
        })
        // Aquí se ejecuta la lógica del comando "/test <algún argumento>".
        .executes(context -> {
          // Aquí obtienes el argumento que introdujo CommandSource.
          // Debes indicar el nombre exacto que le diste al argumento
          // y la clase que esperas recibir; en este caso, String.
          String argumentProvided = context.getArgument("argument", String.class);
          // Este método comprueba si la cadena coincide con el nombre de un jugador
          // y, si es así, le envía un mensaje.
          proxy.getPlayer(argumentProvided).ifPresent(player ->
            player.sendMessage(Component.text("¡Hola!"))
          );
          // Devolver Command.SINGLE_SUCCESS indica que el comando se ejecutó correctamente.
          // Devolver BrigadierCommand.FORWARD enviará el comando al servidor.
          return Command.SINGLE_SUCCESS;
        })
      )
      .build();

    // BrigadierCommand implementa Command.
    return new BrigadierCommand(helloNode);
  }
}
```

Los comandos Brigadier son totalmente compatibles con la versión 1.12.2 y anteriores.

Velocity no admite tipos de argumentos de comandos personalizados de plugins, ya que el cliente también tendría que admitirlos.
Recomendamos usar los tipos de Brigadier predefinidos.

### [](jd:velocity:com.velocitypowered.api.command.SimpleCommand)

Inspirado en la convención popularizada por Bukkit y BungeeCord, `SimpleCommand` tiene tres
métodos: uno para ejecutar el comando, otro para ofrecer sugerencias de autocompletado y
otro para comprobar si un [](jd:velocity:com.velocitypowered.api.command.CommandSource)
tiene permiso para usar el comando. Todos los métodos reciben un
[](jd:velocity:com.velocitypowered.api.command.SimpleCommand$Invocation)
objeto, que contiene el `CommandSource` que ejecutó el comando y los argumentos en forma de matriz de cadenas.
También se puede implementar el ejemplo anterior mediante esta interfaz:

```java title="TestCommand.java" collapse={1-8} showLineNumbers
package com.example.velocityplugin;

import com.velocitypowered.api.command.CommandSource;
import com.velocitypowered.api.command.SimpleCommand;
import java.util.concurrent.CompletableFuture;
import java.util.List;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;

public final class TestCommand implements SimpleCommand {

  @Override
  public void execute(final Invocation invocation) {
    CommandSource source = invocation.source();
    // Obtén los argumentos que siguen al alias del comando.
    String[] args = invocation.arguments();

    source.sendMessage(Component.text("¡Hola, mundo!", NamedTextColor.AQUA));
  }

  // Este método permite controlar quién puede ejecutar el comando.
  // Si quien lo ejecuta no tiene el permiso requerido,
  // el comando y su autocompletado se enviarán directamente
  // al servidor en el que se encuentra quien lo envió.
  @Override
  public boolean hasPermission(final Invocation invocation) {
    return invocation.source().hasPermission("command.test");
  }

  // Con este método puedes controlar las sugerencias que se envían
  // a CommandSource según los argumentos que ya haya escrito
  // o cualquier otro requisito que necesites.
  @Override
  public List<String> suggest(final Invocation invocation) {
    return List.of();
  }

  // Aquí puedes sugerir argumentos como en el método anterior, pero de forma asíncrona.
  // Se recomienda usar este método en lugar del anterior,
  // sobre todo si la lógica para generar sugerencias es más compleja.
  @Override
  public CompletableFuture<List<String>> suggestAsync(final Invocation invocation) {
    return CompletableFuture.completedFuture(List.of());
  }
}
```

Es importante tener en cuenta que [`invocation.arguments()`](jd:velocity:com.velocitypowered.api.command.CommandInvocation#arguments())
no incluye el alias del comando (por ejemplo, `teleport` en `/teleport foo bar`). Si no se especifican argumentos, se pasa una matriz vacía
en lugar de una matriz nula.

Si un jugador o la consola ejecuta el comando `/stats Player2 kills`, el primer
argumento será `Player2`, al que podemos acceder mediante `invocation.arguments()[0]`; el segundo
argumento será `kills`.

### [](jd:velocity:com.velocitypowered.api.command.RawCommand)

Hay casos en los que no necesitas procesar los argumentos. Por ejemplo:

- Un comando como `/say`, cuyos argumentos contienen el mensaje como una cadena.
- Usar un framework externo para procesar los comandos.

Un comando sin procesar indica al proxy que pase directamente el alias y los argumentos, sin
procesarlos. Veamos un ejemplo de comando que repite la entrada recibida:

```java title="EchoCommand.java" collapse={1-4} showLineNumbers
package com.example.velocityplugin;

import com.velocitypowered.api.command.RawCommand;
import net.kyori.adventure.text.Component;

public final class EchoCommand implements RawCommand {

  @Override
  public void execute(final Invocation invocation) {
    invocation.source().sendMessage(Component.text(invocation.arguments()));
  }

  @Override
  public boolean hasPermission(final Invocation invocation) {
    return invocation.source().hasPermission("command.echo");
  }
}
```

## Registrar un comando

Ahora que hemos creado un comando, debemos registrarlo para que funcione. Para registrar
comandos, se utiliza [](jd:velocity:com.velocitypowered.api.command.CommandManager).
Obtenemos el gestor de comandos mediante
[`proxyServer.getCommandManager()`](jd:velocity:com.velocitypowered.api.proxy.ProxyServer#getCommandManager())
con la instancia del proxy, o inyectándolo mediante la anotación
[`@Inject`](https://javadoc.io/doc/com.google.inject/guice/latest/com/google/inject/Inject.html)
en la clase principal. El método de registro requiere dos parámetros: los metadatos del comando y el objeto del comando.

[](jd:velocity:com.velocitypowered.api.command.CommandMeta)
contiene los alias, que no distinguen entre mayúsculas y minúsculas, y otras funciones avanzadas.
`CommandManager` proporciona un constructor de metadatos mediante el método
[`metaBuilder(String alias)`](jd:velocity:com.velocitypowered.api.command.CommandManager#metaBuilder(java.lang.String)).

```java title="HelloWorldPlugin.java" collapse={1-8} showLineNumbers
package com.example.velocityplugin;

import com.google.inject.Inject;
import com.velocitypowered.api.command.BrigadierCommand;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.proxy.ProxyServer;

@Plugin(id = "helloworld")
public final class HelloWorldPlugin {
  private final ProxyServer proxy;

  @Inject
  public HelloWorldPlugin(ProxyServer proxy) {
    this.proxy = proxy;
  }

  @Subscribe
  public void onProxyInitialize(ProxyInitializeEvent event) {
    CommandManager commandManager = proxy.getCommandManager();
    // Aquí puedes definir metadatos del comando, como sus alias y el plugin al que pertenece (recomendado).
    CommandMeta commandMeta = commandManager.metaBuilder("test")
      // Esto creará un alias nuevo para el comando "/test",
      // con los mismos argumentos y la misma funcionalidad.
      .aliases("otherAlias", "anotherAlias")
      .plugin(this)
      .build();

    // Puedes sustituir esto por "new EchoCommand()" o "new TestCommand()".
    // SimpleCommand simpleCommand = new TestCommand();
    // RawCommand rawCommand = new EchoCommand();
    // El registro se hace del mismo modo, ya que las tres interfaces implementan "Command".
    BrigadierCommand commandToRegister = TestBrigadierCommand.createBrigadierCommand(proxy);

    // Por último, registra el comando.
    commandManager.register(commandMeta, commandToRegister);
  }
}
```

Si registras un `BrigadierCommand`, quizá prefieras usar el método
[`register(BrigadierCommand)`](jd:velocity:com.velocitypowered.api.command.CommandManager#register(com.velocitypowered.api.command.BrigadierCommand))
o [`metaBuilder(BrigadierCommand)`](jd:velocity:com.velocitypowered.api.command.CommandManager#metaBuilder(com.velocitypowered.api.command.BrigadierCommand))
para especificar alias adicionales.
