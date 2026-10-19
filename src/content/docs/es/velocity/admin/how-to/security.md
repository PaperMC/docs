---
title: Proteger tus servidores
description: Explicación de cómo proteger tus servidores.
slug: es/velocity/security
---

Es fundamental que protejas tus servidores backend. Como parte de la configuración de Velocity, pondrás el
servidor en modo offline, lo que significa que, en teoría, alguien podría suplantar la identidad de cualquier jugador.
Esto es extremadamente peligroso, por lo que es importante asegurarse de que solo el proxy pueda conectarse a
tus servidores.

Esta guía examina las distintas opciones para proteger tus servidores backend y permitir que solo tu proxy se
conecte a ellos. Ten en cuenta que se trata de una _exploración_ de alternativas: repasaremos las opciones disponibles
y sus ventajas y desventajas para que puedas tomar una decisión informada.

Esta lista no sigue ningún orden en particular y casi todos los métodos pueden combinarse según sea necesario.

## Cortafuegos del sistema operativo

Si se configura correctamente, usar las funciones de cortafuegos del sistema operativo del servidor
es una forma muy eficaz de proteger los servidores. El proyecto Velocity **recomienda encarecidamente
usar un cortafuegos**.

Las instrucciones dependen del sistema operativo. Algunas soluciones para los principales sistemas operativos de servidor son:

- Windows: Windows Firewall
- Linux: iptables, nftables

**Ventajas**:

- Es infalible si no das acceso a tus servidores a servidores no confiables.
- No requiere configuración adicional del servidor de Minecraft.
- Forma parte de las buenas prácticas de refuerzo de seguridad para cualquier sistema operativo.

**Desventajas**:

- La configuración inicial puede ser complicada.
- Puede resultar difícil de usar con varios proxies.
- La configuración del cortafuegos debe mantenerse sincronizada con los nuevos servidores y proxies.
- No es viable en un servicio de alojamiento compartido.

## Reenvío moderno de Velocity

Si tu servidor solo admite Minecraft 1.13 o posterior, el reenvío moderno de Velocity puede enviar
información de jugadores a tus servidores y ofrecer una segunda capa de protección contra los intentos
de suplantar tu proxy.

:::caution

El reenvío moderno de Velocity no sustituye a un cortafuegos. Recomendamos encarecidamente usar uno
con cualquier configuración de proxy de Minecraft.

:::

**Ventajas**:

- Reenvío de información de jugadores integrado.
- Es seguro en un servicio de alojamiento compartido, siempre que el proveedor haya implementado las protecciones adecuadas.
- Funciona si alojas el servidor en varias máquinas físicas.

**Desventajas**:

- Solo funciona con Minecraft 1.13 o posterior.
- Requiere Paper 1.13 o posterior, o FabricProxy-Lite si usas Fabric.
- Depende de que el secreto de reenvío se mantenga en secreto.

## Vincular a `localhost`

Si alojas el proxy en el mismo equipo físico que los demás servidores (y nadie más
aloja servidores en él), vincularlos a `localhost` es una forma muy sencilla de impedir
que se conecte cualquier cosa que no sea el proxy.

En cada servidor, abre el archivo `server.properties`. Busca la línea que empieza por `server-ip` y
cámbiala a `server-ip=127.0.0.1`. Guarda el archivo y reinicia el servidor.

Después, abre el archivo `velocity.toml` y asegúrate de que todos los servidores apunten a
`127.0.0.1:<port>`.

**Ventajas**:

- Configuración muy sencilla en comparación con los demás métodos.
- Es infalible si no permites que usuarios no confiables accedan al servidor.

**Desventajas**:

- Si trasladas alguno de los servidores a otro equipo físico (de modo que el proxy y el servidor ya no estén en la misma máquina),
  tendrás que revertir esta configuración y usar otro método.
- No es viable en un servicio de alojamiento compartido.

## Usar un túnel cifrado

Esta es una variante de la vinculación a `localhost`. En lugar de alojar todos los servidores en una sola
máquina física, configurarás un túnel cifrado entre cada servidor y te asegurarás de que el
servidor solo escuche las conexiones entrantes del túnel. Hay muchas soluciones,
desde VPN como [WireGuard](https://www.wireguard.com),
[OpenVPN](https://openvpn.net/) y [tinc](https://www.tinc-vpn.org/) hasta túneles cifrados como
[spiped](https://www.tarsnap.com/spiped.html). Esta guía no explica en detalle cómo configurar
cada una de estas soluciones.

**Ventajas**:

- Cifra el tráfico entre el proxy y los servidores y garantiza que solo los clientes autorizados puedan
  conectarse a ellos.

**Desventajas**:

- Configuración muy compleja.
- No se puede usar en un servicio de alojamiento compartido.

## Plugins de lista de permitidos de IP

Como última línea de defensa, puedes restringir los inicios de sesión a los usuarios incluidos en una lista de IP permitidas mediante un
plugin como [IPWhitelist](https://www.spigotmc.org/resources/ipwhitelist.61/).

**Ventajas**:

- Puede ser tu única solución si ninguna de las otras alternativas funciona (especialmente en un servicio de alojamiento compartido).

**Desventajas**:

- Es vulnerable a ataques si el atacante logra alojar un servidor en el mismo nodo que tu proxy.

## Otros consejos de seguridad importantes

Estos consejos generales de sentido común no necesitan explicación:

- Haz copias de seguridad frecuentes del servidor.
- Configura un cortafuegos en el servidor.
- Ejecuta los servidores como un usuario sin privilegios (esto significa no usar `sudo` ni ejecutar como `root`
  en Linux).
- Actualiza con frecuencia Velocity, el servidor de Minecraft, los plugins y el sistema operativo.
- Usa contraseñas seguras.
- Antes de instalar plugins o software, piensa detenidamente en sus posibles consecuencias.
- Protege todos los demás servicios que ejecutes en el servidor.
- Sigue todas las recomendaciones para reforzar la seguridad de tu sistema operativo.

No explicaremos en detalle los consejos anteriores, así que investiga por tu cuenta. Cada configuración es distinta:
no hay una recomendación universal, aparte de estas pautas generales.
