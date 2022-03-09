---
slug: /velocity/security
---

# Securing Your Servers

It is vital that you secure your backend servers. As part of setting up Velocity, you will put your
server into offline mode, which means in theory, someone could impersonate any player on your
server. This is extremely dangerous, so it is important to make sure only the proxy can connect to
your servers.

This guide will explore the various options for securing your backend servers so only your proxy can
connect to them. Note that this is an _exploration_ of options, aiming to review the various options
and give you advantages and disadvantages to them so you can make an informed decision.

This list is not in any particular order, and almost all of these methods can be combined as needed.

## Operating System Firewalls

When properly configured, using the firewall facilities provided by your server's operating system
is a highly effective way to protect your servers. The Velocity project **strongly recommends the
use of a firewall**.

Instructions for your operating system may vary. Solutions for major server OSes include:

- Windows: Windows Firewall
- Linux: iptables, nftables

**Advantages**:

- Fool-proof if you do not give untrusted servers access to your servers
- Does not require any extra Minecraft server configuration
- Part of good system hardening advice for any operating system

**Disadvantages**:

- Tricky first-time setup
- May be difficult to use with multiple proxies
- Firewall configuration must be kept in sync with new servers and proxies
- Not viable on a shared host

## Velocity Modern Forwarding

If your server only supports Minecraft 1.13 and above, Velocity's modern forwarding can forward
player information to your servers and provide a second layer of protection against someone trying
to impersonate as your proxy.

:::caution

Velocity modern forwarding is not a replacement for a firewall. We strongly recommend using a
firewall with any Minecraft proxy setup.

:::

**Advantages**:

- Get player info forwarding for free
- Secure on a shared host, provided the host has implemented proper protections
- Works if you host your server on multiple physical servers

**Disadvantages**:

- Only works for Minecraft 1.13 and above
- Requires Paper 1.13 or above, or FabricProxy-Lite if you use Fabric
- Relies on the forwarding secret being kept secret

## Binding To `localhost`

If you are hosting your proxy on the same physical computer as your other servers (and nobody else
is hosting servers on them), binding your servers to `localhost` is a very simple way of protecting
them from getting connected to by anything other than the proxy.

For each server, open the `server.properties` file. Find the line that starts with `server-ip` and
change the line to `server-ip=127.0.0.1`. Save the file and restart the server.

Afterwards, open your `velocity.toml` file and ensure all the servers are pointing to
`127.0.0.1:<port>`.

**Advantages**:

- Trivial setup compared to other methods discussed
- Fool-proof if you do not give untrusted users access to your server

**Disadvantages**:

- Setup must be reversed (and an alternate method used) if you move any of the servers to a
  different physical server ( such that the proxy and the server are not on the same physical
  server)
- Not viable on a shared host

## Using an Encrypted Tunnel

This is a variation on "Binding To `localhost`", but instead of hosting all your servers on a single
physical server, you will set up an encrypted tunnel between each of your servers, and make sure the
server only listens for incoming connections from the tunnel. There are many different solutions,
ranging from VPN solutions such as [WireGuard](https://www.wireguard.com),
[OpenVPN](https://openvpn.net/), and [tinc](https://www.tinc-vpn.org/) to encrypted tunnels such as
[spiped](https://www.tarsnap.com/spiped.html). This guide will not go into details of how to set up
each of these solutions.

**Advantages**:

- Encrypts traffic between your proxy and your servers while ensuring only authorized clients can
  connect to your servers

**Disadvantages**:

- Very complex setup
- Impossible to use on a shared host

## IP Whitelisting Plugins

As a last line of defense, you can choose to restrict logins to users on an IP whitelist using a
plugin like [IPWhitelist](https://www.spigotmc.org/resources/ipwhitelist.61/).

**Advantages**:

- May be your only solution if none of the other solutions will work (especially on a shared host)

**Disadvantages**:

- Vulnerable to attack if the attacker can get a server on the same node as your proxy is on

## Other Important Security Advice

This common-sense general advice goes without saying:

- Keep frequent backups of your server
- Set up a firewall on your server
- Run your servers as an unprivileged user (this means no `sudo` access or running as `root` for
  Linux users!)
- Update Velocity, your Minecraft server and server plugins, and your server's operating system
  frequently
- Use strong passwords
- Carefully think about the potential impacts of installing any plugins or software before actually
  doing so
- Secure any and all other services you may be running on your server
- Follow all system hardening advice for your operating system

We will not provide a full treatment to the advice given above, so please do some research of your
own. Your setup will vary - there is no "one size fits all" advice we can give other than these
general guidelines.
