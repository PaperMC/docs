---
title: Propiedades del sistema
description: Documentación de las propiedades del sistema y las variables de entorno que Paper puede comprobar.
slug: es/paper/reference/system-properties
---

Puedes definir estas propiedades del sistema y variables de entorno al iniciar el servidor para configurar
distintos ajustes.

:::danger[Advertencia]

Los indicadores de JVM pueden alterar su funcionamiento, y lo mismo ocurre con el servidor Paper.
Si no sabes qué hace un indicador, se recomienda **no usarlo**.

:::

## Cómo funcionan

Las propiedades del sistema se establecen al iniciar el servidor. Por ejemplo, si usas un archivo `.bat` o `.sh` para iniciarlo,
puedes añadir las propiedades del sistema a ese archivo. Por ejemplo:

```bash
java -Dcom.mojang.eula.agree=true -jar paper.jar
```

:::note

Algunas propiedades del sistema de Paper incluyen un carácter `.` en el nombre. Si usas PowerShell, tendrás que
escribirlas entre comillas.
Por ejemplo: `"-Dcom.mojang.eula.agree=true"`

:::

En este ejemplo, `-D` establece una propiedad del sistema: `com.mojang.eula.agree` tiene el valor
`true`. En los demás casos, basta con añadirlas al comando de inicio.

:::note

Si una propiedad del sistema aparece como `unset`, puedes habilitarla estableciéndola en `true`.

:::

Las [variables de entorno](https://en.wikipedia.org/wiki/Environment_variable) son otra forma de pasar valores a Paper.
Se pueden definir de distintas maneras, según el sistema operativo y cómo inicies Paper.

En la mayoría de los casos, no tendrás que usarlas, salvo que ejecutes Paper en un contenedor (Docker) o similar.

## Lista de propiedades del sistema

#### paper.playerconnection.keepalive

- **default**: `30`
- **description**: Controla cuánto tiempo esperará la conexión del jugador antes de cerrarse si no recibe señales keepalive,
  en segundos.

#### timings.bypassMax

:::danger[Obsolescencia]

Timings está obsoleto. Por este motivo, este indicador no tiene ningún efecto.

:::

- **default**: `unset`
- **description**: Permite eludir el límite máximo de datos que se envían a la API de Timings de Aikar. Activar esta opción no
  permite superar el límite a menos que la API esté configurada para permitirlo.

#### LetMeReload

- **default**: `unset`
- **description**: Desactiva el mensaje de confirmación de recarga al usar el comando `/reload`.

#### paper.disableChannelLimit

- **default**: `unset`
- **description**: Desactiva el límite de canales de plugins del servidor. De este modo, se elimina el límite de 128 canales de plugins
  por jugador.

#### net.kyori.adventure.text.warnWhenLegacyFormattingDetected

- **default**: `false`
- **description**: Activa o desactiva el aviso cuando se detecta formato heredado en un componente de chat.

#### Paper.DisableClassPrioritization

- **default**: `unset`
- **description**: Desactiva el sistema de priorización de clases. Suele ser útil cuando falla la reubicación o el sombreado
  de clases.

#### Paper.disableFlushConsolidate

- **default**: `unset`
- **description**: Desactiva el sistema de consolidación de vaciado de Netty.

#### Paper.debugDynamicMissingKeys

- **default**: `unset`
- **description**: Habilita el registro de depuración para las claves faltantes en objetos NBT.

#### disable.watchdog

- **default**: `unset`
- **description**: Desactiva el sistema de avisos del watchdog.

#### paper.explicit-flush

- **default**: `unset`
- **description**: Habilita el vaciado explícito del canal de red.

#### Paper.enable-sync-chunk-writes

- **default**: `unset`
- **description**: Sincroniza las escrituras en cada llamada de escritura. Esto afecta al rendimiento, especialmente en discos duros.

#### paper.debug-sync-loads

- **default**: `unset`
- **description**: Habilita el registro de depuración para la carga síncrona de chunks.

#### Paper.ignoreWorldDataVersion

- **default**: `unset`
- **description**: Ignora la versión de los datos del mundo al cargarlo. No se recomienda y es probable que cause
  problemas.

#### Paper.bypassHostCheck

- **default**: `unset`
- **description**: Omite la comprobación de coincidencia del patrón del host del cliente al conectarse al servidor.

#### paper.maxCustomChannelName

- **default**: `32767`
- **description**: Establece el tamaño máximo del nombre de un canal de plugin.

#### Paper.maxSignLength

- **default**: `80`
- **description**: Establece la longitud máxima de línea de los carteles.

#### Paper.minPrecachedDatafixVersion

- **default**: `Versión del mundo de Minecraft + 1`
- **description**: Si esperas convertir muchos chunks, quizá te convenga establecerlo para que solo
  convierta a partir de cierto punto.

#### Paper.WorkerThreadCount

- **default**: la mitad de los núcleos físicos disponibles (**no lógicos**) o `1` si hay 3 núcleos o menos
- **description**: Establece el número de hilos de trabajo que se usarán para cargar chunks.
  Consulta [esta página](/es/paper/reference/global-configuration#chunk_system_worker_threads) para obtener más información.

#### Paper.MaxViewDistance

- **default**: `32`
- **description**: Anula la distancia de visión máxima del servidor. No establece la distancia de visión actual,
  sino que modifica su límite.

#### Paper.excessiveTELimit

- **default**: `750`
- **description**: Divide las entidades de bloque en varios paquetes si su número supera este valor.

#### io.papermc.paper.suppress.sout.nags

- **default**: `unset`
- **description**: Suprime el aviso sobre el uso de `System.out`/`System.err` en un plugin.
-

#### io.papermc.paper.sout.nags.timeout

- **default**: `5000`
- **description**: Tiempo en milisegundos entre avisos sobre el uso de `System.out`/`System.err` en un plugin.
  Un valor igual o inferior a 0 desactiva por completo los avisos basados en tiempo.

#### io.papermc.paper.sout.nags.interval

- **default**: `200`
- **description**: Número de usos repetidos de `System.out`/`System.err` que se esperan antes de volver a mostrar el aviso. Se restablece si
  el tiempo de espera se agota primero. Un valor igual o inferior a 0 desactiva por completo los avisos basados en mensajes.

#### Paper.skipServerPropertiesComments

- **default**: `unset`
- **description**: Omite los comentarios del archivo `server.properties`.

#### paper.alwaysPrintWarningState

- **default**: `unset`
- **description**: Siempre muestra el estado de advertencia del nivel correspondiente.

#### Paper.parseYamlCommentsByDefault

- **default**: `true`
- **description**: Determina si los comentarios de los archivos YAML se analizan de forma predeterminada.

#### paperclip.patchonly

- **default**: `false`
- **description**: Si el servidor se inicia mediante la utilidad de parches Paperclip (la distribución predeterminada de la página de descargas),
  determina si solo se debe aplicar el parche al servidor Vanilla y descargar bibliotecas, sin iniciar el
  servidor.

#### Paper.IgnoreJavaVersion

- **default**: `false`
- **description**: Permite omitir la comprobación de la versión de Java.
  Consulta [esta página](/es/paper/faq#unsupported-java-detected-what-do-i-do) para obtener más información.

#### paper.disableStartupVersionCheck

- **default**: `unset`
- **description**: Si se establece, desactiva la búsqueda automática de actualizaciones al iniciar. Consulta [esta página](/es/paper/misc/update-checker) para
  obtener más información.

#### paper.useLegacyPluginLoading

- **default**: `false`
- **description**: Permite la carga cíclica de plugins. Consulta [esta página](/es/paper/reference/paper-plugins#cyclic-plugin-loading) para
  obtener más información.

#### paper.disableOldApiSupport

- **default**: `false`
- **description**: Desactiva las medidas de compatibilidad de plugins que, de otro modo, pueden provocar un retraso considerable al cargar
  clases (también conocido como reescritura «Commodore» de plugins). Por lo general, esto requiere que todos tus plugins se compilen
  con una versión reciente de la API.

#### paper.preferSparkPlugin

- **default**: `false`
- **description**: Determina si se debe desactivar el perfilador spark incluido para dar prioridad a un plugin independiente. Si no se encuentra el plugin
  spark, se cargará la versión incluida, independientemente de este ajuste, a menos que se
  [desactive explícitamente](/es/paper/reference/global-configuration#spark_enabled).

#### paper.disableWorldSymlinkValidation

- **default**: `false`
- **description**: Desactiva el recorrido de carpetas y la validación de enlaces simbólicos al cargar un mundo. Mejora considerablemente la velocidad de carga
  de mundos enormes (>1 TB). Esto no desactiva la verificación de enlaces simbólicos de los paquetes de datos.

#### paper.disableMigrationDelay

:::caution

No se recomienda usar este indicador en servidores de producción. Asegúrate siempre de hacer una copia de seguridad de los datos importantes
y de saber lo que estás haciendo.

:::

- **default**: `unset`
- **description**: Desactiva la espera de 30 segundos antes de iniciar la migración de un mundo.

#### minecraft.api.session.host

- **default**: `https://sessionserver.mojang.com`
- **description**: Permite especificar una URL personalizada para el servidor de sesiones, por ejemplo, para usar una caché. [
  `minecraft.api.services.host`](#minecraftapiserviceshost) y [
  `minecraft.api.profiles.host`](#minecraftapiprofileshost) también deben estar definidas para que surta efecto.

#### minecraft.api.services.host

- **default**: `https://api.minecraftservices.com`
- **description**: Permite especificar una URL personalizada para la API de servicios, por ejemplo, para usar una caché. [
  `minecraft.api.session.host`](#minecraftapisessionhost) y [
  `minecraft.api.profiles.host`](#minecraftapiprofileshost) también deben estar definidas para que surta efecto.

#### minecraft.api.profiles.host

- **default**: `https://api.mojang.com`
- **description**: Permite especificar una URL personalizada para la API de perfiles, por ejemplo, para usar una caché. [
  `minecraft.api.session.host`](#minecraftapisessionhost) y [
  `minecraft.api.services.host`](#minecraftapiserviceshost) también deben estar definidas para que surta efecto.

#### com.mojang.eula.agree

- **default**: `false`
- **description**: Al establecer esta opción en true, indicas que has aceptado
  el [EULA de Mojang](https://aka.ms/MinecraftEULA) y se omiten las comprobaciones de `eula.txt`.

#### org.bukkit.plugin.java.LibraryLoader.centralURL

- **default**: `https://maven-central.storage-download.googleapis.com/maven2`
- **description**: Establece la URL del repositorio central predeterminado, desde el que se resuelven las dependencias de los plugins declaradas mediante el campo [
  `libraries`](/es/paper/dev/plugin-yml#libraries) de plugin.yml. Esta URL queda anulada por la variable de entorno [
  `PAPER_DEFAULT_CENTRAL_REPOSITORY`](#paper_default_central_repository), si está establecida.

:::caution

Si quieres configurarlo con Maven Central, usa un mirror, ya que usar Maven Central directamente como CDN infringe las
condiciones del servicio de Maven Central y podrías alcanzar los límites de solicitudes.

De forma predeterminada, se usa el mirror de Maven Central de Google para Norteamérica. También puedes usar los mirrors específicos de cada región
que aparecen [aquí](https://storage-download.googleapis.com/maven-central/index.html).

:::

#### paper.debugEntitiesWithInvalidIds

- **default**: `false`
- **description**: Habilita el registro del NBT completo de una entidad cuando se intenta cargar una entidad cuyo ID falta o no es válido.
  (Cada vez que se registra «Skipping Entity with id» en la consola).

#### paper.maxChatCommandInputSize

- **default**: `256`
- **description**: Longitud máxima de un comando de chat. Un cliente Vanilla no puede enviar más de 256 caracteres.

#### management.tls.keystore.password

- **default**: `unset`
- **description**: Anula el valor establecido para `management-server-tls-keystore-password` en `server.properties`.

## Lista de variables de entorno

#### PAPER_VELOCITY_SECRET

- **default**: `unset`
- **description**: Anula la opción de configuración global [
  `proxies.velocity.secret`](/es/paper/reference/global-configuration#proxies_velocity_secret).

#### PAPER_DEFAULT_CENTRAL_REPOSITORY

- **default**: `https://maven-central.storage-download.googleapis.com/maven2`
- **description**: Establece la URL del repositorio central predeterminado, desde el que se resuelven las dependencias de los plugins declaradas mediante el campo [
  `libraries`](/es/paper/dev/plugin-yml#libraries) de plugin.yml. Esta variable anula la propiedad del sistema [
  `org.bukkit.plugin.java.LibraryLoader.centralURL`](#orgbukkitpluginjavalibraryloadercentralurl), si
  está establecida.

#### MINECRAFT_MANAGEMENT_TLS_KEYSTORE_PASSWORD

- **default**: `unset`
- **description**: Anula el valor establecido para `management-server-tls-keystore-password` en `server.properties`. Tiene
  prioridad sobre la propiedad del sistema `management.tls.keystore.password`.

:::caution

Si quieres configurarlo con Maven Central, usa un mirror, ya que usar Maven Central directamente como CDN infringe las
condiciones del servicio de Maven Central y podrías alcanzar los límites de solicitudes.

De forma predeterminada, se usa el mirror de Maven Central de Google para Norteamérica. También puedes usar los mirrors específicos de cada región
que aparecen [aquí](https://storage-download.googleapis.com/maven-central/index.html).

:::
