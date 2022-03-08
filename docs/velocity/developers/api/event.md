---
slug: /velocity/developers/event-api
---

# Working With Events

Listening to events with Velocity's `@Subscribe` annotation is straightforward. You've already seen
one such listener, using the ProxyInitializeEvent in your main class. Additional events can be found
on the [Javadoc](https://jd.velocitypowered.com/3.0.0/).

## Creating a listener method

To listen to an event, mark the method with `@Subscribe`, like shown. This works similarly to
annotation-driven event listening in other APIs you may be familiar with; it's the equivalent of
Bukkit's/Bungee's `@EventHandler` and Sponge's `@Listener`.

```java
@Subscribe
public void onPlayerChat(PlayerChatEvent event) {
	// do stuff
}
```

:::tip

Note that the import is `com.velocitypowered.api.event.Subscribe` and _not_ in
`com.google.common.eventbus`.

:::

## Orders

Every listener has a `PostOrder`. When an event is fired, the order in which listeners are invoked
is defined by their `PostOrder`. Listeners using `PostOrder.FIRST` are called first, then EARLY,
NORMAL, etc.

State the desired order in the `@Subscribe` annotation:

```java
@Subscribe(order = PostOrder.NORMAL)
public void onPlayerChat(PlayerChatEvent event) {
	// do stuff
}
```

`NORMAL` is the default value if you do not specify an order.

## Registering listeners

Velocity automatically registers your main plugin class as an event listener. This is handy for
initialization and for simple plugins, but for more complex plugins, you will want to separate your
event handlers from the main plugin class. To do so, you will need to register with the EventManager
any other listeners you have:

The event system supports registering an object as a listener (allowing you to use `@Subscribe` to
mark event handlers) or registering functional listeners.

### Registering an object as a listener

```java
server.getEventManager().register(plugin, listener);
```

Both parameters are `Object`. The first argument is your plugin's object, and the second argument
should be the listener to register. For example:

```java
@Plugin(id = "myfirstplugin", name = "My Plugin", version = "0.1.0", dependencies = {@Dependency(id = "wonderplugin")})
public class VelocityTest {

  private final ProxyServer server;
  private final Logger logger;

  @Inject
  public VelocityTest(ProxyServer server, Logger logger) {
    this.server = server;
    this.logger = logger;
  }

  @Subscribe
  public void onInitialize(ProxyInitializeEvent event) {
    server.getEventManager().register(this, new MyListener());
  }
}

public class MyListener {

  @Subscribe(order = PostOrder.EARLY)
  public void onPlayerChat(PlayerChatEvent event) {
    // do something here
  }

}
```

### Registering a functional-style listener

As an alternative to `@Subscribe`, you can also use the functional `EventHandler` interface and
register yours with `register(Object plugin, Class<E> eventClass, EventHandler<E> handler)`:

```java
  server.getEventManager().register(this, PlayerChatEvent.class, event -> {
      // do something here
      return null;
  });
```

## Handling events asynchronously

In Velocity 3.0.0, events can now be handled asynchronously. The event system allows a plugin to
pause sending an event to every listener, perform some unit of computation or I/O asynchronously,
and then resume processing the event. All Velocity events have the ability to be processed
asynchronously, however only some will explicitly wait for events to finish being fired before
continuing.

For an annotation-based listener, all that is needed to process an event asynchronously is to either
return an `EventTask` or add a second `Continuation` parameter:

```java
  @Subscribe(order = PostOrder.EARLY)
  public void onLogin(LoginEvent event, Continuation continuation) {
    doSomeAsyncProcessing().addListener(continuation::resume, continuation::resumeWithException);
  }

  @Subscribe(order = PostOrder.EARLY)
  public EventTask onPlayerChat(PlayerChatEvent event) {
    if (mustFurtherProcess(event)) {
      return EventTask.async(() => ...);
    }
    return null;
  }
```

A functional listener simply needs to implement `AwaitingEventExecutor` and return an `EventTask`:

```java
  server.getEventManager().register(this, PlayerChatEvent.class, (AwaitingEventExecutor) event -> {
    if (mustFurtherProcess(event)) {
      return EventTask.async(() => ...);
    }
    return null;
  });
```

There are two types of event tasks:

- **Async tasks** simply run a unit of execution asynchronously. To get a basic event task use
  `EventTask.async(Runnable)`. Basic event tasks are the closest equivalent for Velocity 1.x.x event
  listeners and asynchronous events in the Bukkit API.
- **Continuation tasks** provide the listener with a callback (known as a `Continuation`) to resume
  event processing when the (possibly asynchronous) work is completed. To get a continuation-based
  event task, use `EventTask.withContinuation(Consumer<Continuation>)`. Continuation-based tasks are
  the closest equivalent for listeners that use BungeeCord `AsyncEvent` intents, but have a slightly
  different programming model in that each listener still runs sequentially, just that an individual
  listener can defer passing control onto the next listener until it is done.

:::caution

To retain compatibility with older versions of Velocity, Velocity 3.0.0 runs all event listeners
asynchronously. This behavior will change in Polymer and will require you to explicitly provide an
event task (or to use continuations) if you need to perform some work asynchronously. All developers
are urged to make the transition now.

:::

## Creating Events

Creating events on Velocity is somewhat different than on other platforms. However, it is very
similar for the most part.

### Creating the Event Class

First we need to create a class for our event. In this tutorial we'll assume you're making a private
messaging plugin, and thus use a `PrivateMessageEvent`. Most of this part is boilerplate.

```java
public class PrivateMessageEvent implements Event {

  private final Player sender;
  private final Player recipient;
  private final String message;

  public PrivateMessageEvent(Player sender, Player recipient, String message) {
    this.sender = sender;
    this.recipient = recipient;
    this.message = message;
  }

  public Player sender() {
    return sender;
  }

  public Player recipient() {
    return recipient;
  }

  public String message() {
    return message;
  }

  // toString, equals, and hashCode may be added as needed

}
```

You'll notice that your events don't need to extend or implement anything. They just work.

### Firing the Event

To fire the event, you'll need to get the server's event manager and use the `fire` method. Note
that this returns a `CompletableFuture`, so if you want to continue logic after the event is handled
by all listeners, use a callback:

```java
server.getEventManager().fire(new PrivateMessageEvent(sender, recipient, message)).thenAccept((event) -> {
  // event has finished firing
  // do some logic dependent on the result
});
```

### Using ResultedEvent

Velocity uses the generalised `ResultedEvent` for events which have some sort of 'result'. The
result type of the event is defined by its generic type; for example.
`PrivateMessageEvent implements ResultedEvent<ResultType>`.

Some common result types are `GenericResult`, for simple allowed/denied results, and component
results, used for events where the result may be denied with an accompanying reason (such as in a
login event).

Using a general result is far more encompassing than `isCancelled/setCancelled` methods you may be
used to on other platforms, whose meaning is vague and limited to a simple boolean. In this example,
we'll use `GenericResult`, so listeners will be able to mark our `PrivateMessageEvent` as either
allowed or denied.

```java
public class PrivateMessageEvent implements ResultedEvent<GenericResult> {

  private final Player sender;
  private final Player recipient;
  private final String message;

  private GenericResult result = GenericResult.allowed(); // Allowed by default

  public PrivateMessageEvent(Player sender, Player recipient, String message) {
    this.sender = sender;
    this.recipient = recipient;
    this.message = message;
  }

  public Player sender() {
    return sender;
  }

  public Player recipient() {
    return recipient;
  }

  public String message() {
    return message;
  }

  @Override
  public GenericResult result() {
    return result;
  }

  @Override
  public void setResult(GenericResult result) {
    this.result = Objects.requireNonNull(result);
  }

}
```

Per convention, the result of a `ResultedEvent` should never be null. Here, we assure that using
`Objects.requireNonNull`.

Listeners may 'deny' the event by using `event.setResult(GenericResult.denied())`, and you may check
the result with `event.getResult()`.
