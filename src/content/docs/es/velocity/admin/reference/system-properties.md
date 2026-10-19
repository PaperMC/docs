---
title: Propiedades del sistema
description: Documentación sobre las propiedades del sistema y las variables de entorno que Velocity puede consultar.
slug: es/velocity/reference/system-properties
---

Puedes definir estas propiedades del sistema y variables de entorno al iniciar el servidor para configurar varios ajustes.

:::danger[Peligro]

Las opciones de la JVM pueden alterar su funcionamiento, y lo mismo ocurre con el servidor Velocity.
Si no sabes qué hace una opción, te recomendamos **no usarla**.

:::

## Cómo funcionan

Las propiedades del sistema se establecen al iniciar el servidor. Por ejemplo, si usas un archivo `.bat` o `.sh` para iniciarlo, puedes añadir las propiedades del sistema
al archivo. Por ejemplo:

```bash
java -Dvelocity.packet-decode-logging=true -jar velocity.jar
```

:::note

Algunas propiedades del sistema de Velocity contienen el carácter `.` en el nombre. Si usas PowerShell, tendrás que escribirlas entre comillas.
Por ejemplo: `"-Dvelocity.packet-decode-logging=true"`

:::

En este ejemplo, `-D` se usa para establecer una propiedad del sistema, y la propiedad es `velocity.packet-decode-logging` con el valor `true`.
En los demás casos, simplemente añádelas al comando de inicio.

:::note

Es posible que el valor predeterminado mostrado no esté establecido en la propiedad; Velocity solo lo utilizará si no se define explícitamente.

:::

## Lista de propiedades del sistema

#### auth.forceSecureProfiles

- **valor predeterminado**: `true`
- **descripción**: Reemplaza `force-key-authentication` de la configuración. Si no se establece, tomará automáticamente el valor actual de la configuración.

#### mojang.sessionserver

- **valor predeterminado**: `https://sessionserver.mojang.com/session/minecraft/hasJoined`
- **descripción**: URL completa del punto de acceso `hasJoined` del servidor de sesión utilizado para la autenticación.

#### velocity.natives-tmpdir

- **valor predeterminado**: `unset`
- **descripción**: Directorio temporal para los archivos nativos de Velocity. (Si se establece, también definirá `io.netty.native.workdir`.)

#### velocity.max-known-packs

- **valor predeterminado**: `64`
- **descripción**: Limita los paquetes conocidos al valor predeterminado de Vanilla para evitar que Velocity se bloquee.

#### velocity.max-clientside-plugin-channels

- **valor predeterminado**: `1024`
- **descripción**: Limita los canales de mensajería de plugins registrados por el cliente, ya que Velocity y los servidores backend deben llevar un registro de ellos.

#### velocity.max-packets-per-flush

- **valor predeterminado**: `8192`
- **descripción**: Cantidad máxima de paquetes antes de vaciar automáticamente la cola.

#### velocity.log-server-backpressure

- **valor predeterminado**: `false`
- **descripción**: Indica si Velocity debe registrar si la conexión con el servidor permite escribir y, por tanto, si se leerán automáticamente los datos de la conexión del cliente.

#### velocity.packet-decode-logging

- **valor predeterminado**: `false`
- **descripción**: Indica si se deben registrar con detalle los errores al decodificar paquetes.

#### velocity.skip-uncompressed-packet-size-validation

- **valor predeterminado**: `false`
- **descripción**: Indica si se debe omitir la validación del tamaño de los paquetes sin comprimir. Esto resulta útil para permitir que las configuraciones con mods envíen paquetes sin comprimir que superen el límite.

#### velocity.increased-compression-cap

- **valor predeterminado**: `false`
- **descripción**: Indica si el tamaño máximo de los paquetes sin comprimir debe establecerse en el límite admitido (128 MiB) en lugar del límite de Vanilla (8 MiB).

#### velocity.disable-native-transport

- **valor predeterminado**: `false`
- **descripción**: Indica si se deben desactivar los transportes nativos de Netty, como io_uring y Epoll. Si se establece en `true`, Velocity utilizará el transporte NIO de Java.

#### velocity.enable-iouring-transport

- **valor predeterminado**: `false`
- **descripción**: Habilita el transporte io_uring de Netty si se establece en `true`. De forma predeterminada, Velocity solo utiliza los transportes nativos Epoll (en Linux) y kqueue (en macOS). Esta propiedad no reemplaza `velocity.disable-native-transport`.

#### velocity.natives-disabled

- **valor predeterminado**: `false`
- **descripción**: Indica si se deben desactivar las funciones nativas en determinados sistemas operativos.

#### velocity.legacyChatMaxServerboundLength

- **valor predeterminado**: `100`
- **descripción**: Reemplaza la longitud máxima de los mensajes de chat en versiones anteriores a la 1.11. Resulta útil para mods que incorporan en versiones anteriores el límite moderno de `256` caracteres.

#### velocity.strictErrorHandling

- **valor predeterminado**: `true`
- **descripción**: Indica si se debe desconectar al cliente cuando se producen errores en los paquetes. Esta opción se añadió temporalmente en Minecraft 1.20.5 y se eliminó en 1.21.2 para facilitar la transición de los servidores con mods.

#### velocity.maximum-play-queue-size

- **valor predeterminado**: `134217728` (128 MiB)
- **descripción**: Tamaño máximo de la cola (en bytes) que contiene los paquetes pendientes del estado PLAY que se enviarán al cliente mientras esté en el estado CONFIG.

#### velocity.max-plugin-message-payload-size
- **valor predeterminado**: `32767`
- **descripción**: Tamaño máximo permitido, en bytes, de los paquetes de mensajes de plugins.

## Lista de variables de entorno

#### VELOCITY_FORWARDING_SECRET

- **valor predeterminado**: `unset`
- **descripción**: Reemplaza el secreto de reenvío del archivo [`forwarding-secret-file`](/es/velocity/configuration#sección-raíz).
