---
title: Argumentos y literales
description: Una guía extensa para ordenar argumentos y literales.
slug: es/paper/dev/command-api/basics/arguments-and-literals
---

:::note
En los [documentos del árbol de comandos](/es/paper/dev/command-api/basics/command-tree) hemos analizado la estructura de los comandos del brigadier y cómo construir un árbol de comandos. Si aún no ha terminado de leerlo, le recomendamos encarecidamente que lo haga antes de leer sobre argumentos y literales.
:::
## Introducción

Cada método `.then(...)` de un `ArgumentBuilder<CommandSourceStack, ?>` recibe otro objeto `ArgumentBuilder<CommandSourceStack, ?>`. Esta clase abstracta tiene dos implementaciones: `RequiredArgumentBuilder` y `LiteralArgumentBuilder`. Al usar Brigadier con Paper, creamos estos objetos mediante `Commands.literal(String)` para `LiteralArgumentBuilder` o `Commands.argument(String, ArgumentType<T>)` para `RequiredArgumentBuilder`.

Como explicación de cuál es la diferencia, puedes imaginarlo así:
* Un argumento es una variable ingresada por el usuario. Es semi-impredecible, pero siempre devolverá una entrada válida del objeto que respalda.
* Un literal es una entrada no variable realizada por el usuario. Se utiliza principalmente como una forma de definir entradas predecibles, ya que cada literal es una nueva rama en nuestro árbol de comandos.

## Literales
En el código, generalmente no se puede acceder a los literales. Sin embargo, debido a la naturaleza de nuestro árbol de comandos, siempre podemos saber en qué rama literal nos encontramos actualmente:
```java
Commands.literal("plant")
    .then(Commands.literal("tree")
        .executes(context -> {
            // Aquí estamos en /plant tree.
        })
    )
    .then(Commands.literal("grass")
        .executes(context -> {
            // Aquí estamos en /plant grass.
        })
    )
```

:::tip
Es posible que observe el uso del método `executes`. Este método declara lógica a nuestras ramas. Si una rama no tiene el método `executes` definido, no será ejecutable. Para obtener más información sobre la lógica de ejecución, [haga clic aquí](/es/paper/dev/command-api/basics/executors).
:::
## Argumentos
Los argumentos son un poco más complejos. También definen una nueva rama de un árbol, pero no son directamente predecibles. Cada argumento se crea usando `Commands.argument(String, ArgumentType<T>)`. Ese método devuelve un `RequiredArgumentBuilder`. El parámetro de tipo `T` declara el tipo de retorno del argumento, que luego puede usar dentro de su método `executes`. Eso significa que si ingresa un `ArgumentType<Integer>`, puede recuperar el valor de ese argumento como un número entero, ¡sin necesidad de análisis manual! Hay algunos tipos de argumentos primitivos integrados que podemos usar para los argumentos:

| Tipo de argumento | Tipo resuelto | Posible entrada | Descripción |
|----------------------------------|---------------|---------------------|--------------------------------------------------------------------------------------------|
| BoolArgumentType.bool() | Booleano | verdadero/falso | Sólo permite un valor booleano |
| IntegerArgumentType.integer() | Entero | 253, -123, 0 | Cualquier número entero válido |
| LongArgumentType.longArg() | Largo | 25418263123783 | Cualquier largo válido |
| FloatArgumentType.floatArg() | Flotador | 253,2, -25,0 | Cualquier flotador válido |
| DoubleArgumentType.doubleArg() | Doble | 4123,242, -1,1 | Cualquier doble válido |
| StringArgumentType.palabra() | Cadena | cartas-y+1234567 | Una sola palabra. Solo puede contener letras y números y estos caracteres: `+`, `-`, `_` y `.` |
| StringArgumentType.string() | Cadena | "con espacios" | Una sola palabra o, si se cita, cualquier cadena válida con espacios |
| StringArgumentType.greedyString() | Cadena | espacios sin comillas | La entrada escrita literal. Puede contener cualquier carácter. Tiene que ser el último argumento |
### Tipo de argumento booleano y análisis de argumentos
Se utiliza un tipo de argumento booleano para recuperar, bueno, un valor booleano. Un ejemplo de uso para esto podría ser un comando `/serverflight` que permite habilitar y deshabilitar el vuelo del servidor con `/serverflight true` y `/serverflight false`:
```java
Commands.literal("serverflight")
    .then(Commands.argument("allow", BoolArgumentType.bool())
        .executes(context -> {
            boolean allow = context.getArgument("allow", boolean.class);
            // Activa o desactiva el vuelo en el servidor.
        })
    )
```
Aquí puede ver cómo se accedería a un argumento en código. El primer parámetro para el método `Commands.argument(String, ArgumentType<T>)` toma el nombre del nodo. Los literales no requieren esto, ya que su nombre es el mismo que su valor. Pero aquí necesitamos una manera de acceder al argumento. El parámetro de ejecuta-lambda tiene un método llamado `V getArgument(String, Class<V>)`. El primer parámetro es el nombre del argumento que queremos recuperar. El segundo parámetro es el valor de retorno del argumento. Como usamos un argumento booleano, ingresamos `boolean.class` y recuperamos el valor del argumento como tal.

### Argumentos numéricos
Todos los argumentos numéricos (como `IntegerArgumentType.integer()`) tienen tres sobrecargas:

| Sobrecarga | Descripción |
|-------------------------------------------------|--------------------------------------------------------------------|
| `IntegerArgumentType.integer()` | Cualquier valor entre Integer.MIN_VALUE y Integer.MAX_VALUE |
| `IntegerArgumentType.integer(int min)` | Cualquier valor entre min y Integer.MAX_VALUE |
| `IntegerArgumentType.integer(int min, int max)` | Cualquier valor entre mínimo y máximo |

Esto es particularmente útil para filtrar entradas demasiado altas o demasiado bajas. Como ejemplo, podemos definir un comando `/flyspeed`. Como el método [](jd:paper:org.bukkit.entity.Player#setFlySpeed(float)) solo acepta flotadores entre -1 y 1, donde -1 es una dirección inversa, tendría sentido limitar los valores entre 0 y 1 para valores de velocidad no negativos dentro de los límites. Esto se puede lograr con el siguiente árbol de comandos:
```java
Commands.literal("flyspeed")
    .then(Commands.argument("speed", FloatArgumentType.floatArg(0, 1.0F))
        .executes(context -> {
            float speed = context.getArgument("speed", float.class);
            // Establece la velocidad de vuelo del jugador.
            return Command.SINGLE_SUCCESS;
        })
    )
```

:::tip
Algunos argumentos pueden tener formas especiales de recuperarse. En particular, todos los argumentos proporcionados por Brigadier (los que se mencionan en esta página) tienen un solucionador para obtener su propio valor de argumento. Para el argumento flotante, esto se vería así:
```java
float speed = FloatArgumentType.getFloat(context, "speed");
```
Generalmente no importa si usa `context.getArgument` o `FloatArgumentType.getFloat`, ya que sigue la misma lógica, pero en documentación futura, los valores primitivos podrían recuperarse usando sus propios analizadores.

Estos analizadores para argumentos nativos de brigada existen. Todos estos toman `(CommandContext<?> context, String name)` como parámetros del método:
- `BoolArgumentType.getBool`
- `IntegerArgumentType.getInteger`
- `LongArgumentType.getLong`
- `FloatArgumentType.getFloat`
- `DoubleArgumentType.getDouble`
- `StringArgumentType.getString`
:::
Ahora, si ingresamos un valor flotante válido entre 0 y 1, el comando se ejecutará correctamente: ![](../../../../../../paper/dev/api/command-api/basics/assets/valid-float.png)

Pero si ingresamos un valor flotante demasiado pequeño o demasiado grande, se generará un error **en el cliente**: ![](../../../../../../paper/dev/api/command-api/basics/assets/small-float.png) ![](../../../../../../paper/dev/api/command-api/basics/assets/big-float.png)

Esta es la principal ventaja de los argumentos nativos: el propio cliente realiza una simple comprobación de errores en los argumentos, lo que mejora mucho la experiencia del usuario al ejecutar un comando, ya que puede ver entradas no válidas sin enviar el comando al servidor.

### Argumentos de cadena
Hay tres argumentos de cadena: `word`, `string` y `greedyString`.

El argumento de cadena `word` es el más simple de ellos. Solo acepta una sola palabra que consta de caracteres alfanuméricos y estos caracteres especiales: `+`, `-`, `_` y `.`.
* ✅ `.this_is_valid_input.`
* ❌ `this is invalid input`
* ❌ `"also_invalid"`
* ✅ `-10_numbers_are_valid`
* ❌ `@_@`

El argumento `string` es un poco más complicado. Si no está entrecomillado, sigue las mismas reglas que el argumento `word`. Sólo caracteres alfanuméricos y los caracteres especiales mencionados. Pero si pones tu cadena entre comillas, puedes ingresar cualquier combinación de caracteres Unicode que desees. Las comillas `"` se pueden escapar usando una barra invertida `\`.
* ✅ `this_is-valid-input`
* ✅ `"\"quotes\""`
* ❌ `this is invalid input`
* ✅ `"this is valid input again"`
* ✅ `"also_valid"`
* ✅ `"紙の神"`

El argumento `greedyString` es el único argumento que no realiza ningún análisis. Debido a su carácter "codicioso", no permite ningún argumento después de su declaración. Eso también significa que cualquier entrada es completamente válida y no requiere comillas. De hecho, las comillas se cuentan como caracteres literales.
* ✅ `this_is_valid_input`
* ✅ `this is valid as well input`
* ✅ `"this is valid input again"`
* ✅ `also_valid`
* ✅ `紙の神`

Aquí puedes ver los argumentos en acción: ![](../../../../../../paper/dev/api/command-api/basics/assets/string-arguments.gif)

## Referencia adicional
### Argumentos de Minecraft
Además de estos argumentos de Brigadier integrados, Paper también define innumerables argumentos personalizados. Se puede acceder a estos en un contexto estático con la clase `ArgumentTypes`. Puedes leer más sobre estos [aquí](/es/paper/dev/command-api/arguments/minecraft).
### Argumentos personalizados
A veces desea definir sus propios argumentos personalizados. Para eso puedes implementar la interfaz `CustomArgumentType<T, N>`. Puedes leer más sobre estos [aquí](/es/paper/dev/command-api/basics/custom-arguments).
