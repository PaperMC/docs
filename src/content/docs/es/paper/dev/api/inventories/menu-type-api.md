---
title: API de tipo de menú
slug: es/paper/dev/menu-type-api
description: Una guía para la API de tipo de menú.
version: 1.21.8
---
Minecraft tiene muchos tipos de menús. Desde cofres hasta mesas de elaboración, yunques e incluso menús comerciales de los aldeanos. Con la antigua API de inventario de Bukkit, no era posible replicar la mayoría de estos a la perfección. Precisamente por este motivo se introdujo la API de tipo menú.

## ¿Qué es un menú?
Los menús, también conocidos como vistas, son interfaces de usuario que los jugadores pueden crear y ver. La interfaz [](jd:paper:org.bukkit.inventory.MenuType) declara todos los tipos de menú posibles que puede tener un menú. La diferencia entre menús e inventarios es que los inventarios son contenedores y los menús son sus representaciones visuales.

Los menús creados con esta API **siguen la misma lógica que Vanilla**, lo que significa que son completamente funcionales. Algunos de ellos pueden representar directamente un bloque, como un horno. El [`MERCHANT`](jd:paper:org.bukkit.inventory.MenuType#MERCHANT) puede representar una entidad comercial en el mundo.

## ¿Qué son las vistas de inventario?
Un [](jd:paper:org.bukkit.inventory.InventoryView) es una vista específica creada a partir de un tipo de menú. En el sentido general, una vista de inventario vincula **dos inventarios separados** y siempre tiene un jugador viéndolos. El inventario vinculado inferior es el inventario del jugador.

Algunas vistas tienen subinterfaces especializadas para comprobar rápidamente su tipo, como [](jd:paper:org.bukkit.inventory.view.FurnaceView) para inventarios de hornos. Para otras vistas, que no tienen su propio subtipo, puede utilizar el método [](jd:paper:org.bukkit.inventory.InventoryView#getMenuType()).

## Crear vistas de inventario a partir de tipos de menú
La forma más común de crear vistas de inventario a partir de tipos de menú es mediante el uso de sus respectivos constructores. **Cada tipo de menú tiene un constructor** que se puede utilizar para personalizar la vista resultante. Por ejemplo, se puede crear y abrir una vista de inventario de mesa de elaboración simple de esta manera:
```java
// MenuType.CRAFTING se usa para abrir una mesa de trabajo.
MenuType.CRAFTING.builder()

    // Establece el título de la vista, que aparecerá en la parte superior.
    .title(Component.text("The inventory view's title"))

    // Determina si el servidor debe comprobar que el jugador pueda llegar a la ubicación.
    .checkReachable(true)

    // Establece la ubicación. Como checkReachable está en `true`, debe ser una mesa de trabajo
    // válida. El servidor comprobará que el jugador no se aleje demasiado para usarla y cerrará
    // su inventario si la mesa de trabajo se desplaza.
    .location(location)

    // Crea esta vista para el jugador indicado y vincula el inventario de la mesa de trabajo
    // con el inventario del jugador.
    .build(player)

    // Abre la vista.
    .open();
```

:::tip
Los constructores se pueden reutilizar para reducir la repetición de código. También se pueden [clonar](jd:paper:org.bukkit.inventory.view.builder.InventoryViewBuilder#copy()) para operaciones más complejas.
:::
## Abrir bloques que tienen menús
Casi todas las vistas de inventario tienen un bloque adjunto. La única excepción es el [`MenuType.MERCHANT`](jd:paper:org.bukkit.inventory.MenuType#MERCHANT), que en su lugar tiene un [](jd:paper:org.bukkit.inventory.Merchant) adjunto.

Hay dos tipos de bloques que tienen menús: bloques de entidad de bloque y bloques sin estado.

Los bloques sin estado, como su nombre lo indica, no tienen ningún estado asociado. Entre ellos se encuentran la mayoría de los bloques de "banco de trabajo", como mesas de elaboración, piedras de afilar, yunques y más.

Los bloques de entidad de bloque (también conocidos como bloques de entidad de mosaico) tienen un estado asociado. Es decir, cuando abre una ubicación específica con el método de construcción `#location` y el bloque coincide con el bloque esperado del tipo de menú, el estado de ese bloque puede cambiar. Esto significa que todos los jugadores podrán ver el cambio en vivo.

Debajo de esos bloques se cuentan la baliza, los cofres, los hornos y similares. Por ejemplo, [`MenuType.FURNACE`](jd:paper:org.bukkit.inventory.MenuType#FURNACE) esperaría un bloque de horno.

## Vistas de inventario persistentes
¡Las vistas de inventario se pueden reutilizar! Esto es útil para operaciones persistentes.

Por ejemplo, podemos escribir un comando `/persistent` que abre el alijo persistente del jugador.
```java title="CommandPersistent.java" showLineNumbers
public class CommandPersistent implements Listener {

    // Un mapa donde se guardan todas las vistas de inventario. Por lo general, no se recomienda
    // usar objetos Player como claves o valores, pero en este caso es aceptable.
    // porque la vista de inventario también está vinculada a un objeto Player, así que de todos
    // modos no podríamos reutilizarla cuando el jugador vuelva a conectarse.
    private static final Map<Player, InventoryView> VIEWS = new HashMap<>();

    // Crea un comando. Encontrarás más información en la documentación de la API de comandos.
    // páginas y, por tanto, no se cubrirán aquí.
    public static LiteralCommandNode<CommandSourceStack> createCommand() {
        return Commands.literal("persistent").executes(context -> {
            Player player = context.getSource().getPlayerOrThrow();

            // Primero, intenta obtener una vista guardada.
            InventoryView view = VIEWS.computeIfAbsent(player, p -> {
                // Si no hay ninguna vista guardada, créala.
                return MenuType.GENERIC_9X6.builder()
                    .title(Component.text(p.getName() + "'s stash", NamedTextColor.DARK_RED))
                    .build(p);
            });

            // Como la vista de inventario está vinculada directamente al jugador, no hace falta
            // volver a asignarlo; basta con abrirla.
            view.open();
            return Command.SINGLE_SUCCESS;
        }).build();
    }

    // Debemos hacer dos cosas cuando se produzca el evento de salida:
    // 1. Elimina la entrada del jugador del mapa, ya que deja de ser válida.
    // 2. Guarda el inventario superior en algún sitio para que persista al reiniciar el servidor.
    @EventHandler
    void onPlayerQuit(PlayerQuitEvent event) {
        InventoryView view = VIEWS.remove(event.getPlayer());
        if (view != null) {
            Inventory inventory = view.getTopInventory();
            // Guarda el contenido del inventario en un archivo o una base de datos.
        }
    }
}
```
