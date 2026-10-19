---
title: Libros
slug: es/adventure/book
description: Guía sobre los libros de Adventure.
---

## Crear un libro

Los libros se componen de:
  * Un componente para el título del libro
  * Un componente para el autor del libro
  * Una colección de componentes para las páginas del libro

**Ejemplo:**

```java
// Crear y abrir para la audiencia destinataria un libro sobre gatos
public void openMyBook(final Audience target) {
  final Component bookTitle = Component.text("Enciclopedia de los gatos");
  final Component bookAuthor = Component.text("kashike");
  final Collection<Component> bookPages = Cats.getCatKnowledge();

  final Book myBook = Book.book(bookTitle, bookAuthor, bookPages);
  target.openBook(myBook);
}
```

## Información adicional sobre los libros

Los libros de Adventure no están necesariamente vinculados a un objeto de libro con el que se pueda interactuar en el cliente.
En la versión actual, esa conexión debe implementarse fuera de Adventure.

Cualquier componente que supere el límite de texto por página del juego se truncará en el cliente; lo mismo se aplica
a la cantidad de componentes (páginas). Puedes leer más sobre estos límites en la [Minecraft Wiki](https://minecraft.wiki/w/Book_and_Quill#Writing).
