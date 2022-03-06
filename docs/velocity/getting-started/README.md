# Getting Started

This page covers how to install and set up a minimal configuration of Velocity.

## Installing Java

Velocity is written in Java, so if you do not already have Java installed, you will need to install
it before you continue. Velocity requires Java 11 or newer. See our
[java installation guide](../../common/java-install.md) for detailed instructions.

## Downloading Velocity

Head over to the [downloads](https://papermc.io/downloads#Velocity) page to get the latest version
of Velocity. We recommend getting the latest stable version. After downloading Velocity, move the
JAR file to a dedicated folder for just the proxy or upload it to your server.

## Launching Velocity for the first time

Once you have downloaded Velocity, we will launch it for the first time to generate the
configuration file, `velocity.toml`. You can use the start script created to launch Velocity once
you're done configuring Velocity.

### Launching Velocity under Windows

Create a `start.bat` with the following contents in the same directory where you intend to place the
proxy files.

```batch title="start.bat"
@echo off
java -Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar velocity.jar
pause
```

:::tip

Make sure to change the `velocity.jar` to the name of the Velocity JAR that you downloaded, or
rename the Velocity JAR to `velocity.jar`.

:::

Once saved, double-click the `start.bat` file. If it worked, you should now receive a console
similar to the output in the next section.

### Launching Velocity under macOS or Linux

Create a `start.sh` with the following contents in the same directory where you intend to place the
proxy files. You may do this using a file transfer client, or using a text editor running on the
host.

```bash title="start.sh"
#!/bin/sh

java -Xms1G -Xmx1G -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15 -jar velocity*.jar
```

Once saved, open a terminal (or log into the machine) if you haven't already, navigate to the
directory where you have placed the Velocity JAR file and the `start.sh` file. Then run
`chmod +x start.sh` and then `./start.sh`. If it worked, you should now receive a console similar to
the output in the next section.

## After launch

Here's a sample of what you'll see once we've started the proxy:

```log
[05:41:13 INFO]: Booting up Velocity 3.1.2-SNAPSHOT (git-b2800087-b112)...
[05:41:13 INFO]: Loading localizations...
[05:41:13 INFO]: Connections will use epoll channels, libdeflate (Linux aarch64) compression, OpenSSL (Linux aarch64) ciphers
[05:41:13 INFO]: Loading plugins...
[05:41:13 INFO]: Loaded 0 plugins
[05:41:13 INFO]: Listening on /[0:0:0:0:0:0:0:0%0]:25577
[05:41:13 INFO]: Done (0.36s)!
```

Velocity has launched, and you are now ready to configure the proxy completely. Go ahead and type
`end` at the console and press enter. The proxy will shut down:

```log
> end
[05:42:10 INFO]: Shutting down the proxy...
[05:42:10 INFO]: Closing endpoint /0.0.0.0:25577
```

If you used the Windows batch script from earlier, the window will ask you to press a key. You can
either press a key or close the command window.

### Configuring your servers

We now need to configure each server to accept connections from the proxy.

Velocity is a highly configurable proxy. While most users will not need to change everything in the
config, there are tons of options covered
[on the configuration wiki page](../reference/configuration.md) along with an explanation on how
each option works. However, in this section we will do the bare minimum to get the proxy up and
running.

Open the `velocity.toml` file in a text editor and search for the `[servers]` section. This section
specifies the servers that Velocity can connect to. Here's what the `[servers]` section will look
like initially:

```toml title="velocity.toml"
[servers]
# Configure your servers here. Each key represents the server's name, and the value
# represents the IP address of the server to connect to.
lobby = "127.0.0.1:30066"
factions = "127.0.0.1:30067"
minigames = "127.0.0.1:30068"

# In what order we should try servers when a player logs in or is kicked from a server.
try = [
  "lobby"
]
```

On the left side, you will specify a name for the server (for example, `lobby`) and on right is a
string indicating the IP address and port for the server. You will now need to add your servers to
the list. You can change the list of servers as needed.

The `try` setting is special. It is a list of servers Velocity should try to connect the player to
when the player first logs onto the proxy or gets kicked from a server. If you decided to change the
name of the `lobby` server, then you should replace `lobby` in this list with the name you chose for
the first server the player should log into first.

:::caution

The following setup is generic and is intended to apply to any Minecraft server. This setup is not
only not ergonomic (players will lack skins, proper UUIDs, and all connections will appear to come
from the proxy) but also **dangerously insecure**. After you place your servers in offline mode, you
**must** follow the "Player Information Forwarding" and "Securing Your Servers" topics to complete
your setup.

:::

Open the `server.properties` file for each of your servers and set the `online-mode` setting to
`false`. This allows Velocity to connect to your server. Once you're done, restart your server.
While Velocity is now ready for use, you will almost certainly want to
[secure your servers](../how-to/security.md) and
[configure player information forwarding](forwarding.md).
