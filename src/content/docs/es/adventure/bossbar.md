---
title: Barras de jefe
slug: es/adventure/bossbar
description: Guía sobre las barras de jefe de Adventure.
---

## Crear una barra de jefe

Las barras de jefe se componen de:
  * Un componente para el título de la barra de jefe
  * Un número de 0 a 1 que determina cuánto se llena la barra de jefe
  * Un color, que se reducirá a una paleta compatible en clientes <1.9
  * Una superposición que determina el número de segmentos visuales de la barra de jefe


**Ejemplos:**

```java
private @Nullable BossBar activeBar;

public void showMyBossBar(final Audience target) {
  final Component name = Component.text("Barra de jefe increíble");
  // Crear una barra de jefe roja, vacía y sin segmentos
  final BossBar emptyBar = BossBar.bossBar(name, 0, BossBar.Color.RED, BossBar.Overlay.PROGRESS);
  // Crear una barra de jefe verde, con un 50 % de progreso y 10 segmentos
  final BossBar halfBar = BossBar.bossBar(name, 0.5F, BossBar.Color.GREEN, BossBar.Overlay.NOTCHED_10);
  // etc.
  final BossBar fullBar = BossBar.bossBar(name, 1, BossBar.Color.BLUE, BossBar.Overlay.NOTCHED_20);

  // Enviar una barra de jefe a la audiencia
  target.showBossBar(fullBar);

  // Guardarla localmente para poder ocultarla manualmente más adelante
  this.activeBar = fullBar;
}

public void hideActiveBossBar(final Audience target) {
  target.hideBossBar(this.activeBar);
  this.activeBar = null;
}
```

## Cambiar una barra de jefe activa

Las barras de jefe son mutables y reaccionan a los cambios en su objeto:
la vista del juego se actualizará automáticamente, ¡sin necesidad de refrescarla manualmente!

Por tanto, si esta barra de jefe está activa:

```java
final BossBar bossBar = BossBar.bossBar(Component.text("Contador de gatos"), 0, BossBar.Color.RED, BossBar.Overlay.PROGRESS);
```

y se llama a `BossBar.name()` con un componente

```java
final Component newText = Component.text("Contador de patos");
bossBar.name(newText);
```

la barra de jefe se actualizará automáticamente. Lo mismo ocurre con `progress`, `color` y `overlay`.
