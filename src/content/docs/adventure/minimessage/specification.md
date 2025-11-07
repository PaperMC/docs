---
title: Language Specification
slug: adventure/minimessage/specification
description: A developer-facing specification of the MiniMessage format.
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 4
---

This document outlines the MiniMessage format in detail to aid developers who wish to implement their own MiniMessage
parser from scratch or understand the internal processes happening during the parsing of MiniMesssage formatted strings.

The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”,
“MAY”, and “OPTIONAL” in this document are to be interpreted as described in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## The MiniMessage language

The MiniMessage language is a markup format used for representing Minecraft's component-based text
system in a human-readable and modifiable way. Broadly speaking, the language consists of two types
of tokens: **plain text** and **tags**.

Plain text is any string. This string is UTF-16 compatible. The following is an example of a valid
plain text part of a MiniMessage-formatted string:

```mm
The MiniMessage format was made to be as simple as possible.
Emojies are allowed 😅. So are japanese characters, like 紙.
```

MiniMessage tags are primarily used for adding markup information to plain text parts. They can, however,
also add entirely new content into the serialized component. The way how a tag is resolved makes no
difference to the MiniMessage lexer. A tag has the following structure:

```mm
<tagname flags named_argument=value :a sequenced argument:another one>
```

A tag consists of the following parts:

- `< >`: All tags are surrounded by less than and more than symbols.
- `tagname`: Every tag starts with the name. The name follows the list of characters mentioned as allowed
  in the [misc/identifiers](#identifiers) section.
- Tags can have arguments. There are two distinctions between argument types: named and sequenced. Named arguments
  are, as the name implies, named in some way. Sequenced arguments do not have a name, instead they are a simple list
  of string values. [Tag argument documentation can be found later in the page](#tag-arguments).

### Tag syntax

MiniMessage tags can surround text.

```mm
<tagname>Inner text</tagname> and outer text.
```

Tags can be closed by repeating the tag, with a slash in front of the name. Tags are closed implicitly
when the end of the string is reached. Furthermore, tags can be nested:

```mm
<first_tag>Some text <second_tag>even more text</second_tag>, and that's really it!
```

Nested tags are closed implicitly when the outer tag is closed.

```mm
This text is unmarked <outer_tag>marked, <inner_tag>inner</outer_tag>, and again no longer marked.
```

If a tag has arguments, these must not be repeated on the closing tag.

```mm
<tagname:with an argument>Some text</tagname>
```

Lastly, normal tags can be closed instantly by prepending a `/` to the more-than symbol of an opening tag.

```mm
This tag is auto-closed: <tagname/>
```

## Tag arguments

Arguments are placed between the tag name and the closing more-than symbol.

```mm
<tagname [arguments here]>
```

### Named argument types

Before each named argument, a piece of [whitespace](#whitespace) must be present.

There exists two types of named arguments: value-based arguments and flag arguments.

#### Flag argument type

Flags may be preceded by a single exclamation mark `!` and must follow the rules set by [identifiers](#identifiers).

```mm
<tagname some_flag another_flag_4_you !inverted_flag>
```

The following shows a tag with invalid flags:

```mm
<tagname SomeCoolFlag !!double_inverted what-even-is-happening-here?>
```

#### Valued argument type

Named arguments with a value consist of an identifier, an equal symbol `=`, and a value.

The identifier follows the rules as explained in the [misc/identifiers](#identifiers) section of this page.
The value may consist of any UTF-16 characters, but must not contain any whitespace, unless explicitly quoted.
Please refer to [misc/quoting](#quoting) for any specifics.

Here is an example for valid valued named arguments:

```mm
<birdtag bird=parrot color='red and blue'>
```

And example for invalid valued named arguments:

```mm
<birbtag vöglein=papagei Colour=red and blue>
```

:::note

The above tag, assuming the identifiers were valid, would actually parse both `and` and `blue` as flags.

:::

#### Combining flags and values

These two named types can be combined in any way.

```mm
<combined_tag aflag some=value !inverted_flag really=yeah!>
```

### Sequential arguments

Sequential arguments are declared at the end of the tag. Each sequential argument starts with a colon `:`.
Unless named arguments are present, a whitespace before the first colon `:` is not necessary.

Sequential arguments may contain any UTF-16 characters. Any instances of `<`, `>`, or `:` characters
must either be escaped (see [misc/escaping](#escaping)) or the argument must be wrapped in quotes
(see [misc/quoting](#quoting)).

The following are valid MiniMessage tags with sequential arguments:

```mm
<simpletag:hey there>

<another:first argument:second argument>

<with_whitespace   :this is perfectly fine>

<nested_mm:\<some_cool_tag\> and a \: colon!>

<nested_mm:"<some_cool_tag> and a : colon, but it's quoted!">
```

### Combining argument types

Named and sequential arguments can be used together. The general syntax looks as follows:

```mm
<tagname[ named_arguments ][:sequenced:arguments]>
```

All named arguments must be located between the tag name and the first non-value colon.

A few examples for valid tags making use of both named and sequenced arguments:

```mm
<combined coolness=true flags :and sequenced args>

<combined flags !over more_flags and even !more flagss :I'd call this cool:Would you?:Yeah for sure>

<combined tic=tac :time's up!>
```

## Misc

This section defines miscellaneous behavior of common parts.

### Identifiers

All identifiers must be lowercased and contain only alphanumerical characters, `_`, or '-'. All identifiers
used as named argument names should be unique.

### Quoting
Argument values can be quoted. A value counts as quoted if the first character is a `'` or `"`. The quoted
value ends as soon as another unquoted quote of the same character as the starting quote is found at the
end of an argument.

Between the opening and the closing quote, any UTF-16 characters may be present. This also includes the same
quote as used for the string. The following would be a valid tag;

```mm
<tag:"double quoted", yet contains a double quote?">
```

This is because the `"` in the middle is **not the last character of the value**. Therefore, it is read
literally, since the tag would otherwise be invalid.

:::tip

As long as the quote is not closed, the lexer must continue reading characters. If the end of the
input is reached before closing quote is found, the tag and any following characters should be
read as plain text, as the tag is never closed. This is to aid users in finding the error in their syntax.

:::

### Whitespace

A whitespace character may be a classical space `\s`, a tab character `\t`,
a newline `\n`, or a carriage return `\r`.

### Escaping

In MiniMessage, certain symbols, which would be interpreted differently by a lexer may be preceded by a backslash `\`
to instead be included literally. This includes backslash `\` characters, if they would have any effect on the next
symbol. If a backlash character had no effect, it is included literally.

## Formal grammar

This segment declares the formal grammar (in a flavor of the Backus-Naur form) which specifies the MiniMessage language.

The specific flavor used here changes that non-terminal symbols are no longer enclosed in angle brackets `<>`
and the `::=` meta symbol is replaced by `→`. Curly brackets `{}` declare optional parts. Lastly, a `+` suffix
declares that a symbol should appear at least once, but may appear more often, whilst a `*` suffix declares that
a symbol may appear once or more often.

```bnf
; Important notes regarding this specific grammar: due to the massive number of characters included
; in the UTF-16 characterset, some special non-terminal symbols have been added:
;
; utf-16-char                       → includes all UTF-16 characters.
;
; utf-16-char-no-whitespace         → includes all UTF-16 characters except for spaces (\s), tabs (\t), newlines (\n)
;                                     and carriage returns (\r).
;
; utf-16-char-no-angle-or-colon     → includes all UTF-16 characters except for the
;                                     angle-bracket characters (<>) and colon (:). However
;                                     those characters are valid if an uneven number of backslash
;                                     characters is located infront of them.

minimessage           → string {tag string}

string                → utf-16-char*

tag                   → "<" tag-name tag-arguments "/>"
tag                   → "<" tag-name tag-arguments ">" minimessage {"</" tag-name ">"}

tag-name              → identifier

tag-arguments         → "" | named-argument " "+ sequential-argument | named-argument | " "* sequential-argument

named-argument        → "" | " "+ {"!"} identifier {named-argument} | " "+ identifier "=" named-value {named-argument}

named-value           → "" | quoted | no-whitespace-string

no-whitespace-string  → utf-16-char-no-whitespace*

sequential-argument   → ":" sequential-value {sequential-argument}

sequential-value      → "" | quoted | sequential-string

sequential-string     → utf-16-char-no-angle-or-colon*

quoted                → "'" string "'" | """ string """

identifier            → alphanumeric+

alphanumeric          → "a" | "b" | "c" | "d"
                        | "e" | "f" | "g" | "h"
                        | "i" | "j" | "k" | "l"
                        | "m" | "n" | "o" | "p"
                        | "q" | "r" | "s" | "t"
                        | "u" | "v" | "w" | "x"
                        | "y" | "z" | "_" | "0"
                        | "1" | "2" | "3" | "4"
                        | "5" | "6" | "7" | "8"
                        | "9" | "-"
```
