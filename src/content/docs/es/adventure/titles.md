---
title: Títulos
slug: es/adventure/titles
description: Mostrar títulos a los jugadores.
---

## Crear un título

Los títulos se componen de:
  * Un componente para el título principal
  * Un componente para el subtítulo
  * Opcionalmente, se puede usar un objeto `Title.Times` para determinar la duración de la aparición gradual, la permanencia en pantalla y la desaparición gradual


**Ejemplos:**

```java
public void showMyTitle(final Audience target) {
  final Component mainTitle = Component.text("Este es el título principal", NamedTextColor.WHITE);
  final Component subtitle = Component.text("Este es el subtítulo", NamedTextColor.GRAY);

  // Crear un título sencillo con los valores predeterminados de aparición, permanencia y desaparición gradual
  final Title title = Title.title(mainTitle, subtitle);

  // Enviar el título a la audiencia
  target.showTitle(title);
}

public void showMyTitleWithDurations(final Audience target) {
  final Title.Times times = Title.Times.times(Duration.ofMillis(500), Duration.ofMillis(3000), Duration.ofMillis(1000));
  // Este título usará el objeto times para aparecer en 500 ms, permanecer 3000 ms y desaparecer en 1000 ms
  final Title title = Title.title(Component.text("¡Hola!"), Component.empty(), times);

  // Enviar el título; también puedes usar Audience#clearTitle() para quitarlo en cualquier momento
  target.showTitle(title);
}
```
