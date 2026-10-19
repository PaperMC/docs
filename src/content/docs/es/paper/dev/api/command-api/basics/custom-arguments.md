---
title: Argumentos personalizados
description: Guía sobre argumentos personalizados.
slug: es/paper/dev/command-api/basics/custom-arguments
---
Los argumentos personalizados no son más que un contenedor alrededor de los tipos de argumentos existentes, que permiten al desarrollador proporcionar un argumento con sugerencias y análisis reutilizables para reducir la repetición de código.

## ¿Por qué usarías argumentos personalizados?
Por ejemplo, si quieres un argumento para un jugador que esté conectado y sea operador, puedes usar un tipo de argumento de jugador, añadir sugerencias personalizadas y lanzar un `CommandSyntaxException` en el cuerpo del método `executes(...)`. Quedaría así:
```java
Commands.argument("player", ArgumentTypes.player())
    .suggests((context, builder) -> {
        Bukkit.getOnlinePlayers().stream()
            .filter(ServerOperator::isOp)
            .map(Player::getName)
            .filter(name -> name.toLowerCase(Locale.ROOT).startsWith(builder.getRemainingLowerCase()))
            .forEach(builder::suggest);
        return builder.buildFuture();
    })
    .executes(context -> {
        final Player player = context.getArgument("player", PlayerSelectorArgumentResolver.class).resolve(context.getSource()).getFirst();
        if (!player.isOp()) {
            throw new SimpleCommandExceptionType(new LiteralMessage(player.getName() + " no es operador del servidor.")).create();
        }

        context.getSource().getSender().sendRichMessage("El jugador <player_name> es operador del servidor.",
            Placeholder.component("player_name", player.displayName())
        );
        return Command.SINGLE_SUCCESS;
    })
```
Como puedes ver, hay mucha lógica que no está directamente relacionada con la funcionalidad del comando. Si queremos usar este mismo argumento en otro nodo, tenemos que copiar y pegar una gran cantidad de código, lo que sería muy tedioso.

La solución a este problema son los argumentos personalizados. Antes de entrar en detalles sobre ellos, así es como se vería el argumento cuando se implementara como un argumento personalizado:
```java title="OppedPlayerArgument.java"
public final class OppedPlayerArgument implements CustomArgumentType<Player, PlayerSelectorArgumentResolver> {

    private static final SimpleCommandExceptionType ERROR_BAD_SOURCE = new SimpleCommandExceptionType(
        new LiteralMessage("El origen debe ser un CommandSourceStack válido.")
    );

    private static final DynamicCommandExceptionType ERROR_NOT_OPERATOR = new DynamicCommandExceptionType(name -> {
        return new LiteralMessage(name + " no es operador del servidor.");
    });

    @Override
    public Player parse(final StringReader reader) {
        throw new UnsupportedOperationException("Este método nunca se invocará.");
    }

    @Override
    public <S> Player parse(final StringReader reader, final S source) throws CommandSyntaxException {
        if (!(source instanceof CommandSourceStack stack)) {
            throw ERROR_BAD_SOURCE.create();
        }

        final Player player = this.getNativeType().parse(reader).resolve(stack).getFirst();
        if (!player.isOp()) {
            throw ERROR_NOT_OPERATOR.create(player.getName());
        }

        return player;
    }

    @Override
    public ArgumentType<PlayerSelectorArgumentResolver> getNativeType() {
        return ArgumentTypes.player();
    }

    @Override
    public <S> CompletableFuture<Suggestions> listSuggestions(final CommandContext<S> context, final SuggestionsBuilder builder) {
        Bukkit.getOnlinePlayers().stream()
            .filter(ServerOperator::isOp)
            .map(Player::getName)
            .filter(name -> name.toLowerCase(Locale.ROOT).startsWith(builder.getRemainingLowerCase()))
            .forEach(builder::suggest);
        return builder.buildFuture();
    }
}
```
A primera vista, parece mucho más código del necesario para hacer la lógica en el propio árbol de comandos. Entonces ¿cuál es la ventaja? La respuesta se hace evidente con bastante rapidez cuando observamos cómo se declara ahora el argumento:
```java
Commands.argument("player", new OppedPlayerArgument())
    .executes(context -> {
        final Player player = context.getArgument("player", Player.class);

        context.getSource().getSender().sendRichMessage("El jugador <player_name> es operador del servidor.",
            Placeholder.component("player_name", player.displayName())
        );
        return Command.SINGLE_SUCCESS;
    })
```
Esto es mucho más legible y fácil de entender cuando se utiliza un argumento personalizado. ¡Y es reutilizable! Con suerte, ahora tienes una idea básica de **por qué** deberías usar argumentos personalizados.

## Examinando la interfaz `CustomArgumentType`
La interfaz se declara de la siguiente manera:
```java title="CustomArgumentType.java"
public interface CustomArgumentType<T, N> extends ArgumentType<T> {

    @Override
    T parse(StringReader reader) throws CommandSyntaxException;

    @Override
    default <S> T parse(final StringReader reader, final S source) throws CommandSyntaxException {
        return ArgumentType.super.parse(reader, source);
    }

    ArgumentType<N> getNativeType();

    @Override
    @ApiStatus.NonExtendable
    default Collection<String> getExamples() {
        return this.getNativeType().getExamples();
    }

    @Override
    default <S> CompletableFuture<Suggestions> listSuggestions(final CommandContext<S> context, final SuggestionsBuilder builder) {
        return ArgumentType.super.listSuggestions(context, builder);
    }
}
```
### Tipos genéricos
Hay tres tipos genéricos presentes en la interfaz:
- `T`: este es el tipo de argumento que se devuelve cuando se llama a `CommandContext#getArgument`.
- `N`: el tipo nativo del tipo de argumento que extiende este argumento personalizado. Utilizado como argumento "subyacente".
- `S`: Un tipo genérico para la fuente de comando. Generalmente será un `CommandSourceStack`.

### Métodos
| Declaración de método | Descripción |
|------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ArgumentType<N> getNativeType()` | Aquí se declara el tipo de argumento subyacente, que se utiliza como base para la validación de argumentos del lado del cliente.                                                                  |
| `T parse(StringReader reader) throws CommandSyntaxException` | Este método se utiliza si no se anula `T parse(StringReader, S)`. Aquí puede ejecutar la lógica de conversión y validación.                                                    |
| `<S> T parse(StringReader reader, S source)` | Si se anula, se preferirá este método al `T parse(StringReader)`. Tiene el mismo propósito, pero permite incluir la fuente en la lógica de análisis.                    |
| `Collection<String> getExamples()` | Este método **no** debe anularse. Se utiliza internamente para diferenciar ciertos tipos de argumentos durante el análisis.                                                        |
| `<S> CompletableFuture<Suggestions> listSuggestions(CommandContext<S> context, SuggestionsBuilder builder)` | Este método es el equivalente a `RequiredArgumentBuilder#suggests(SuggestionProvider<S>)`. Puede anular este método para enviar sus propias sugerencias al cliente. |

### Una implementación muy básica
```java title="BasicImplementation.java"
public class BasicImplementation implements CustomArgumentType<String, String> {

    @Override
    public String parse(final StringReader reader) {
        return reader.readUnquotedString();
    }

    @Override
    public ArgumentType<String> getNativeType() {
        return StringArgumentType.word();
    }
}
```
Observe el uso de `reader.readUnquotedString()`. Además de permitir que los tipos de argumentos existentes analicen su argumento, también puede leer la entrada manualmente. Aquí leemos una cadena sin comillas, lo mismo que un tipo de argumento de cadena de palabras.

## `CustomArgumentType.Converted<T, N>`
En caso de que necesite analizar el tipo nativo a su nuevo tipo, puede usar la interfaz `CustomArgumentType.Converted`. Esta interfaz es una extensión de la interfaz `CustomArgumentType`, que agrega dos métodos nuevos y reemplazables:
```java
T convert(N nativeType) throws CommandSyntaxException;

default <S> T convert(final N nativeType, final S source) throws CommandSyntaxException {
    return this.convert(nativeType);
}
```
Estos métodos funcionan de manera similar a los métodos `parse`, pero en su lugar le proporcionan el tipo nativo analizado en lugar de un `StringReader`. Esto redujo la necesidad de realizar manualmente operaciones de lectura de cadenas y, en su lugar, utiliza directamente las reglas de análisis del tipo nativo.

## Manejo de errores durante la fase de sugerencias
En caso de que esté buscando la capacidad de hacer que el cliente muestre la entrada actualmente escrita en rojo para mostrar la entrada no válida, debe tener en cuenta que esto **no es posible** con argumentos personalizados. El cliente sólo puede validar argumentos que conoce y no hay forma de lanzar un `CommandSyntaxException` durante la fase de sugerencias. La única forma de lograrlo es mediante el uso de **literales**, pero no se pueden modificar dinámicamente durante el tiempo de ejecución del servidor.

![](../../../../../../paper/dev/api/command-api/basics/assets/ice-cream-invalid.png)

## Ejemplo: argumento del helado
Un ejemplo práctico de cómo puede utilizar un argumento personalizado a su favor podría ser un argumento clásico de tipo enumeración. En nuestro caso, usamos esta enumeración `IceCreamFlavor`:
```java title="IceCreamFlavor.java"
public enum IceCreamFlavor {
    VANILLA,
    CHOCOLATE,
    STRAWBERRY;

    @Override
    public String toString() {
        return this.name().toLowerCase();
    }
}
```
Luego podemos usar un tipo de argumento personalizado convertido para convertir entre un argumento de cadena de palabras y nuestro tipo de enumeración, así:
```java title="IceCreamArgument.java"
public class IceCreamArgument implements CustomArgumentType.Converted<IceCreamFlavor, String> {

    private static final DynamicCommandExceptionType ERROR_INVALID_FLAVOR = new DynamicCommandExceptionType(flavor -> {
        return new LiteralMessage(flavor + " no es un sabor válido.");
    });

    @Override
    public IceCreamFlavor convert(final String nativeType) throws CommandSyntaxException {
        try {
            return IceCreamFlavor.valueOf(nativeType.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException _) {
            throw ERROR_INVALID_FLAVOR.create(nativeType);
        }
    }

    @Override
    public <S> CompletableFuture<Suggestions> listSuggestions(final CommandContext<S> context, final SuggestionsBuilder builder) {
        for (final IceCreamFlavor flavor : IceCreamFlavor.values()) {
            final String name = flavor.toString();

            // Sugiere solo si el nombre del sabor coincide con lo que escribió el usuario.
            if (name.startsWith(builder.getRemainingLowerCase())) {
                builder.suggest(name);
            }
        }

        return builder.buildFuture();
    }

    @Override
    public ArgumentType<String> getNativeType() {
        return StringArgumentType.word();
    }
}
```
Finalmente, podemos declarar nuestro comando así, ¡y listo! Además, puedes obtener directamente el argumento como un tipo `IceCreamFlavor` listo para usar, sin análisis adicional en el método `executes(...)`; eso hace que los argumentos personalizados sean muy potentes.
```java
Commands.argument("flavor", new IceCreamArgument())
    .executes(context -> {
        final IceCreamFlavor flavor = context.getArgument("flavor", IceCreamFlavor.class);

        context.getSource().getSender().sendRichMessage("<b><red>¡Ñ<green>A<aqua>M<light_purple>!</b> Acabas de probar una bola de <flavor>.",
            Placeholder.unparsed("flavor", flavor.toString())
        );
        return Command.SINGLE_SUCCESS;
    })
```
![](../../../../../../paper/dev/api/command-api/basics/assets/ice-cream.png)
