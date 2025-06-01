---
title: Books
description: A guide to Adventure Books.
---

## Constructing a Book

Books are composed of:
  * A component used for the title of the book
  * A component used for the author of the book
  * A collection of components used for the book pages

**Example:**

```java
// Create and open a book about cats for the target audience
public void openMyBook(final @NonNull Audience target) {
    Component bookTitle = Component.text("Encyclopedia of cats");
    Component bookAuthor = Component.text("kashike");
    Collection<Component> bookPages = Cats.getCatKnowledge();

    Book myBook = Book.book(bookTitle, bookAuthor, bookPages);
    target.openBook(myBook);
}
```

## Extra info regarding Books

Books in adventure are not necessarily connected to an interactable book item in the client.
As of the current release such a connection needs to be implemented outside of adventure.

Any component that surpasses the game limit for text per page will be truncated client side, the same applies
to the amount of components (pages). Further reading about these limits can be done at the [Minecraft Wiki](https://minecraft.wiki/w/Book_and_Quill#Writing).
