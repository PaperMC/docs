---
title: Trabajar con eventos
description: Cómo escuchar eventos en Velocity.
slug: es/velocity/dev/event-api
---

Escuchar eventos con la anotación `@Subscribe` de Velocity es sencillo. Ya has visto un suscriptor de este tipo, que usa
[](jd:velocity:com.velocitypowered.api.event.proxy.ProxyInitializeEvent)
en tu clase principal. Puedes encontrar otros eventos en el [Javadoc](jd:velocity).

## Crear un método suscriptor

Para escuchar un evento, marca el método con [`@Subscribe`](jd:velocity:com.velocitypowered.api.event.Subscribe),
como se muestra. Funciona de forma similar a la escucha de eventos basada en anotaciones de otras API conocidas;
equivale a `@EventHandler` de Bukkit/Bungee y a `@Listener` de Sponge.

```java
@Subscribe
public void onPlayerChat(PlayerChatEvent event) {
  // Escribe aquí el código que quieras ejecutar.
}
```

:::tip

Ten en cuenta que la importación correcta es [`com.velocitypowered.api.event.Subscribe`](jd:velocity:com.velocitypowered.api.event.Subscribe)
y _no_ pertenece a `com.google.common.eventbus`.

:::

## Orden

Cada suscriptor tiene una [`priority`](jd:velocity:com.velocitypowered.api.event.Subscribe#priority()).
Cuando se dispara un evento, su prioridad determina el orden en que se invoca a los suscriptores.
Cuanto mayor sea la prioridad, antes se llamará al manejador del evento.

Indica el orden deseado en la anotación `@Subscribe`:

```java
@Subscribe(priority = 10)
public void onPlayerChatFirst(PlayerChatEvent event) {
  // Este método se ejecuta primero.
}

@Subscribe(priority = 5)
public void onPlayerChat(PlayerChatEvent event) {
  // Este método se ejecuta después del anterior.
}
```

Si no especificas un orden, el valor predeterminado es `0`.

## Registrar suscriptores

Velocity registra automáticamente la clase principal del plugin como suscriptor de eventos. Esto resulta práctico para
la inicialización y para plugins sencillos, pero en los más complejos querrás separar los
manejadores de eventos de la clase principal. Para ello, debes registrar los demás suscriptores con
[](jd:velocity:com.velocitypowered.api.event.EventManager):

El sistema de eventos permite registrar un objeto como suscriptor (para marcar los métodos con `@Subscribe`)
o registrar manejadores funcionales.

### Registrar un objeto como suscriptor

```java
server.getEventManager().register(plugin, listener);
```

Ambos parámetros son [](jd:java:java.lang.Object).
El primer argumento es el objeto de tu plugin y el segundo, el suscriptor que quieres registrar. Por ejemplo:

```java
@Plugin(id = "myfirstplugin", name = "Mi plugin", version = "0.1.0", dependencies = {@Dependency(id = "wonderplugin")})
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

  @Subscribe
  public void onPlayerChat(PlayerChatEvent event) {
    // Escribe aquí el código que quieras ejecutar.
  }

}
```

### Registrar un manejador funcional

Como alternativa a `@Subscribe`, también puedes usar la interfaz funcional `EventHandler` y registrarla mediante
[`register(Object plugin, Class<E> eventClass, EventHandler<E> handler)`](jd:velocity:com.velocitypowered.api.event.EventManager#register(java.lang.Object,java.lang.Class,com.velocitypowered.api.event.EventHandler)):

```java
server.getEventManager().register(this, PlayerChatEvent.class, event -> {
  // Escribe aquí el código que quieras ejecutar.
});
```

## Gestionar eventos de forma asíncrona

En Velocity 3.0.0, los eventos se pueden gestionar de forma asíncrona. El sistema permite que un plugin
pause la propagación de un evento a todos los suscriptores, realice una operación de cálculo o de entrada y salida de forma asíncrona
y luego reanude el procesamiento del evento. Todos los eventos de Velocity se pueden procesar
de forma asíncrona, aunque solo algunos esperan explícitamente a que termine la propagación del evento antes de
continuar.

Para procesar un evento de forma asíncrona con un método basado en anotaciones, basta con
devolver un [](jd:velocity:com.velocitypowered.api.event.EventTask)
o añadir un parámetro [](jd:velocity:com.velocitypowered.api.event.Continuation):

```java
@Subscribe(priority = 100)
public void onLogin(LoginEvent event, Continuation continuation) {
  doSomeAsyncProcessing().whenComplete((_, throwable) -> {
    if (throwable != null) {
      continuation.resumeWithException(throwable);
    } else {
      continuation.resume();
    }
  });
}

private CompletableFuture<Void> doSomeAsyncProcessing() {
  // ...
}

@Subscribe(priority = 100)
public EventTask onPlayerChat(PlayerChatEvent event) {
  if (mustFurtherProcess(event)) {
    return EventTask.async(() => ...);
  }
  return null;
}
```

Un manejador funcional solo necesita implementar
[](jd:velocity:com.velocitypowered.api.event.AwaitingEventExecutor)
y devolver un [](jd:velocity:com.velocitypowered.api.event.EventTask):

```java
server.getEventManager().register(this, PlayerChatEvent.class, (AwaitingEventExecutor) event -> {
  if (mustFurtherProcess(event)) {
    return EventTask.async(() => ...);
  }
  return null;
});
```

Hay dos tipos de tareas de eventos:

- **Tareas asíncronas** ejecutan una operación de forma asíncrona. Para crear una tarea de evento básica, usa
  [](jd:velocity:com.velocitypowered.api.event.EventTask#async(java.lang.Runnable)).
  Son el equivalente más cercano a los suscriptores de Velocity 1.x.x y a los eventos asíncronos
  de la API de Bukkit.
- **Tareas de continuación** proporcionan al suscriptor una función de retorno (llamada `Continuation`) para reanudar
  el procesamiento del evento cuando termine el trabajo (posiblemente asíncrono). Para obtener una tarea basada en continuaciones,
  Para obtener una tarea de evento basada en continuaciones, usa [`EventTask.withContinuation(Consumer<Continuation>)`](jd:velocity:com.velocitypowered.api.event.EventTask#withContinuation(java.util.function.Consumer)).
  Son el equivalente más cercano a los suscriptores que usan las intenciones de `AsyncEvent` de BungeeCord,
  aunque el modelo de programación difiere ligeramente: los suscriptores siguen ejecutándose de forma secuencial,
  pero cada uno puede aplazar el paso al siguiente hasta terminar.

:::caution

Para mantener la compatibilidad con versiones antiguas de Velocity, Velocity 3.0.0 ejecuta todos los suscriptores
de eventos de forma asíncrona. Este comportamiento cambiará en Polymer y tendrás que proporcionar explícitamente una
tarea de evento (o usar continuaciones) si necesitas realizar trabajo de forma asíncrona. Se recomienda a todos los desarrolladores
hacer la transición desde ahora.

:::

## Crear eventos

Crear eventos en Velocity es algo distinto a hacerlo en otras plataformas, aunque en general es muy
parecido.

### Crear la clase del evento

Primero debemos crear una clase para el evento. En este tutorial supondremos que estás creando un plugin de mensajería
privada y, por tanto, usaremos `PrivateMessageEvent`. La mayor parte de esta sección es código repetitivo.

```java title="PrivateMessageEvent.java"
public class PrivateMessageEvent {

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

  // Añade toString, equals y hashCode si los necesitas.

}
```

Como ves, tus eventos no necesitan extender ninguna clase ni implementar ninguna interfaz. Funcionan directamente.

### Disparar el evento

Para disparar el evento, obtén el administrador de eventos del servidor y usa el método
[`fire`](jd:velocity:com.velocitypowered.api.event.EventManager#fire(E)).
Ten en cuenta que devuelve un [](jd:java:java.util.concurrent.CompletableFuture);
si quieres continuar la lógica después de que todos los suscriptores gestionen el evento, usa una función de retorno:

```java
server.getEventManager().fire(new PrivateMessageEvent(sender, recipient, message)).thenAccept((event) -> {
  // El evento ya se ha propagado.
  // Añade aquí la lógica que dependa del resultado.
});
```

### Usar `ResultedEvent`

Velocity usa [](jd:velocity:com.velocitypowered.api.event.ResultedEvent)
para los eventos que tienen algún tipo de «resultado». El tipo de resultado se define mediante su tipo genérico; por ejemplo,
`PrivateMessageEvent implements ResultedEvent<ResultType>`.

Algunos tipos habituales de resultado son [`GenericResult`](jd:velocity:com.velocitypowered.api.event.ResultedEvent$GenericResult),
para resultados sencillos de permitido/denegado, y los resultados de componentes, usados en eventos que pueden denegarse con un motivo
(como en un evento de inicio de sesión).

Un resultado general ofrece muchas más posibilidades que los métodos `isCancelled/setCancelled` habituales
en otras plataformas, cuyo significado es impreciso y se limita a un valor booleano. En este ejemplo,
usaremos `GenericResult` para que los suscriptores puedan marcar `PrivateMessageEvent` como
permitido o denegado.

```java title="PrivateMessageEvent.java"
public class PrivateMessageEvent implements ResultedEvent<GenericResult> {

  private final Player sender;
  private final Player recipient;
  private final String message;

  private GenericResult result = GenericResult.allowed(); // Permitido de forma predeterminada.

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

Por convención, el resultado de un `ResultedEvent` nunca debería ser null. Aquí lo garantizamos mediante
[](jd:java:java.util.Objects#requireNonNull(T)).

Los suscriptores pueden «denegar» el evento mediante `event.setResult(GenericResult.denied())`, y puedes consultar
el resultado con `event.getResult()`.
