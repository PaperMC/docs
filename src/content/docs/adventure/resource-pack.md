---
title: Resource packs
description: A guide to using resource packs with Adventure.
---

On top of the resource packs controlled by each player on their client, the game allows servers to send resource pack URLs to clients that the players can choose to accept. This allows servers to provide customized styling.

Initially this just allowed sending a single resource pack, but starting with *Minecraft 1.20.3* the server can send multiple resource packs to be stacked, and if needed removed individually.

## Sending resource packs

A resource pack is identified by:
  * its UUID
  * a URI to the resource pack ZIP file
  * the SHA-1 hash of the resource pack ZIP file as a hex string

This is referred to as `ResourcePackInfo`.

For every batch of resource packs being sent, a `ResourcePackRequest`, there is:
  * one or more resource packs
  * a callback to perform actions based on the responses from the client
  * a toggle for whether to replace any existing server-provided resource packs, or stack the most recent packs on top
  * whether these resource packs are required
  * a prompt to display to the user if they have not yet chosen whether to allow server resource packs

## Examples

Send a single resource pack to a client that is required, with a UUID computed based on its name.

```java
private static final ResourcePackInfo PACK_INFO = ResourcePackInfo.resourcePackInfo()
  .uri(URI.create("https://example.com/resourcepack.zip"))
  .hash("2849ace6aa689a8c610907a41c03537310949294")
  .build();

public void sendResourcePack(final @NonNull Audience target) {
  final ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
    .packs(PACK_INFO)
    .prompt(Component.text("Please download the resource pack!"))
    .required(true)
    .build();

  // Send the resource pack request to the target audience
  target.sendResourcePacks(request);
}

public void sendOptionalResourcePack(final @NonNull Audience target) {
  final ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
    .packs(PACK_INFO)
    .prompt(Component.text("Please download the resource pack!"))
    .required(false)
    .build();

  // Send the resource pack request to the target audience
  target.sendResourcePacks(request);
}
```

## Callbacks

The callback function allows servers to respond to pack download feedback sent by the client. Newer versions of the game provide more information about different phases, but any version will provide basic status info about download and application. Keep in mind that the responses are entirely driven by the client, so modded clients may send incorrect information (for example, saying a required resource pack has been applied when it has not), none at all, or even nonsensical information (status updates after a terminal update has been received). Any action taken based on a callback should therefore be defensively designed to cope with client creativity.

The audience provided in the callback aims to be the exact same audience the resource pack was sent to in the case of wrapping audiences, re-wrapping any underlying returned value where necessary.

## Removing resource packs

Resource packs can be removed, either some quantity at a time with `Audience.removeResourcePacks()`, or all at once with `Audience.clearResourcePacks()`.

The removal methods have multiple overloads, allowing removal by a bare UUID, or by reusing the data structures used for applying resource packs.
