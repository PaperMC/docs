---
title: Projectiles
description: How to launch projectiles, find out who shot them, and react to them hitting something.
slug: paper/dev/projectiles
version: "26.3"
---

Projectiles are entities that are shot or thrown, such as arrows, snowballs, ender pearls, fireballs and tridents.
All of them implement the [](jd:paper:org.bukkit.entity.Projectile) interface, which extends
[](jd:paper:org.bukkit.entity.Entity), so everything you can do with an entity also works with a projectile.

Some common sub-interfaces are:

- [](jd:paper:org.bukkit.entity.AbstractArrow) for arrows, spectral arrows and tridents.
- [](jd:paper:org.bukkit.entity.ThrowableProjectile) for snowballs, eggs, ender pearls and bottles o' enchanting.
- [](jd:paper:org.bukkit.entity.ThrownPotion), a sub-interface of `ThrowableProjectile`, for splash and lingering potions.
- [](jd:paper:org.bukkit.entity.Fireball) for fireballs, wither skulls and wind charges.

## Launching a projectile

Any [](jd:paper:org.bukkit.projectiles.ProjectileSource) can launch a projectile with
[`launchProjectile`](jd:paper:org.bukkit.projectiles.ProjectileSource#launchProjectile(java.lang.Class)).
Every [](jd:paper:org.bukkit.entity.LivingEntity), including players, is a projectile source.

Most projectiles are launched from the entity in the direction it is looking, with the same velocity that Vanilla uses
for that projectile. Some projectiles, such as potions, are thrown at a slightly higher angle, just like in Vanilla.
You can pass a [](jd:paper:org.bukkit.util.Vector) to override the initial velocity.

```java
Player player = ...;

// Throws a snowball with the same velocity as when a player throws one
Snowball snowball = player.launchProjectile(Snowball.class);

// Shoots an arrow twice as fast as normal (an arrow is normally launched with a speed of 3)
Arrow arrow = player.launchProjectile(Arrow.class, player.getLocation().getDirection().multiply(6));
```

:::note

`launchProjectile` only guarantees support for projectiles that the source can fire in Vanilla.
Other projectile types may work, but they are not part of the method contract.

:::

### Configuring the projectile before it is launched

If you want to change the projectile before it is added to the world, pass a
[`Consumer`](jd:java:java.util.function.Consumer) as the third argument of
[`launchProjectile`](jd:paper:org.bukkit.projectiles.ProjectileSource#launchProjectile(java.lang.Class,org.bukkit.util.Vector,java.util.function.Consumer)).
Passing `null` as the velocity keeps the default velocity.

```java
player.launchProjectile(Arrow.class, null, arrow -> {
    arrow.setDamage(6.0);
    arrow.setPierceLevel(2);
    arrow.setPickupStatus(AbstractArrow.PickupStatus.DISALLOWED);
});
```

The consumer runs before the projectile is in the world, so the projectile is already configured when
[](jd:paper:org.bukkit.event.entity.ProjectileLaunchEvent) is called for it.
Do not teleport the projectile or perform similar operations inside the consumer, as their behavior is undefined
until the projectile has been added to the world.

## Getting the shooter

[`getShooter()`](jd:paper:org.bukkit.entity.Projectile#getShooter()) returns the
[](jd:paper:org.bukkit.projectiles.ProjectileSource) that shot the projectile. This is usually a
[](jd:paper:org.bukkit.entity.LivingEntity), but it can also be a
[](jd:paper:org.bukkit.projectiles.BlockProjectileSource), such as a dispenser, or `null` if the projectile has no shooter.
You can change the shooter with [`setShooter`](jd:paper:org.bukkit.entity.Projectile#setShooter(org.bukkit.projectiles.ProjectileSource)).

```java
Projectile projectile = ...;

if (projectile.getShooter() instanceof Player player) {
    // the projectile was shot by a player
} else if (projectile.getShooter() instanceof BlockProjectileSource blockSource) {
    Block block = blockSource.getBlock(); // the block that shot the projectile, such as a dispenser
}
```

If you only need the owner's UUID, use [`getOwnerUniqueId()`](jd:paper:org.bukkit.entity.Projectile#getOwnerUniqueId()),
which returns `null` if the projectile has no owner.

## Reacting to projectiles

### Launch

[](jd:paper:org.bukkit.event.entity.ProjectileLaunchEvent) is called when a projectile is added to the world,
including projectiles launched with `launchProjectile`. Cancelling it prevents the projectile from being spawned.

If you only care about projectiles that players throw by using an item, such as snowballs or ender pearls,
[](jd:paper:com.destroystokyo.paper.event.player.PlayerLaunchProjectileEvent) also gives you the item that was used and
lets you decide whether it is consumed. It is not called for `launchProjectile` or for arrows shot from a bow or crossbow;
use [](jd:paper:org.bukkit.event.entity.EntityShootBowEvent) for those.

```java
@EventHandler
public void onProjectileLaunch(ProjectileLaunchEvent event) {
    if (event.getEntity() instanceof EnderPearl && event.getEntity().getShooter() instanceof Player player) {
        player.sendRichMessage("<red>Ender pearls are disabled here!");
        event.setCancelled(true);
    }
}
```

### Hit

[](jd:paper:org.bukkit.event.entity.ProjectileHitEvent) is called when a projectile hits an entity or a block.
Use [`getHitEntity()`](jd:paper:org.bukkit.event.entity.ProjectileHitEvent#getHitEntity()) and
[`getHitBlock()`](jd:paper:org.bukkit.event.entity.ProjectileHitEvent#getHitBlock()) to find out what was hit.
Only one of them is non-null.

```java
@EventHandler
public void onProjectileHit(ProjectileHitEvent event) {
    Projectile projectile = event.getEntity();

    if (event.getHitEntity() != null) {
        // the projectile hit an entity
    } else if (event.getHitBlock() != null) {
        BlockFace face = event.getHitBlockFace(); // the face of the block that was hit, may be null
    }
}
```

Cancelling the event stops the projectile from colliding with the entity it hit, except for fireworks, for which you
should use [](jd:paper:org.bukkit.event.entity.FireworkExplodeEvent) instead. When it hits a block, the block's
action, such as ringing a bell or activating a target block, does not happen, but the projectile still collides with the block.
Explosions still happen unless their own events are cancelled.

### Damage

When a projectile damages an entity, use the [](jd:paper:org.bukkit.damage.DamageSource) of the
[](jd:paper:org.bukkit.event.entity.EntityDamageEvent) to find out who is responsible.
[`getDirectEntity()`](jd:paper:org.bukkit.damage.DamageSource#getDirectEntity()) returns the projectile, while
[`getCausingEntity()`](jd:paper:org.bukkit.damage.DamageSource#getCausingEntity()) returns its shooter.

```java
@EventHandler
public void onEntityDamage(EntityDamageEvent event) {
    DamageSource source = event.getDamageSource();

    if (source.getDirectEntity() instanceof Arrow && source.getCausingEntity() instanceof Player shooter) {
        // the entity was shot with an arrow by a player
    }
}
```

## Example: Explosive snowballs

Projectiles can store data in their [persistent data container](/paper/dev/pdc), which lets you recognize your own
projectiles in event listeners. The following example marks a snowball when it is thrown and creates an explosion
where it lands.

```java
public class ExplosiveSnowballs implements Listener {

    private final NamespacedKey explosiveKey;

    public ExplosiveSnowballs(JavaPlugin plugin) {
        this.explosiveKey = new NamespacedKey(plugin, "explosive");
    }

    public void throwExplosiveSnowball(Player player) {
        player.launchProjectile(Snowball.class, null, snowball ->
            snowball.getPersistentDataContainer().set(this.explosiveKey, PersistentDataType.BOOLEAN, true)
        );
    }

    @EventHandler(ignoreCancelled = true)
    public void onProjectileHit(ProjectileHitEvent event) {
        Projectile projectile = event.getEntity();
        if (!projectile.getPersistentDataContainer().has(this.explosiveKey)) {
            return;
        }

        // creates an explosion that does not set fire or break blocks
        projectile.getWorld().createExplosion(projectile.getLocation(), 2.0F, false, false, projectile);
    }
}
```

## Arrows

[](jd:paper:org.bukkit.entity.AbstractArrow) has methods to change how an arrow behaves:

- [`setDamage`](jd:paper:org.bukkit.entity.AbstractArrow#setDamage(double)) sets the base damage of the arrow.
  A normal arrow has a base damage of 2.0.
- [`setPierceLevel`](jd:paper:org.bukkit.entity.AbstractArrow#setPierceLevel(int)) sets how many entities the arrow can
  pierce through, between 0 and 127.
- [`setCritical`](jd:paper:org.bukkit.entity.AbstractArrow#setCritical(boolean)) makes the arrow critical, which
  increases its damage and shows particles.
- [`setPickupStatus`](jd:paper:org.bukkit.entity.AbstractArrow#setPickupStatus(org.bukkit.entity.AbstractArrow$PickupStatus))
  controls whether the arrow can be picked up: by anyone, only by players in creative mode, or not at all.
- [`setItemStack`](jd:paper:org.bukkit.entity.AbstractArrow#setItemStack(org.bukkit.inventory.ItemStack)) sets the item
  that is shown on the arrow and given to the player who picks it up.

## Thrown items

The appearance of a [](jd:paper:org.bukkit.entity.ThrowableProjectile), such as a snowball or an ender pearl, comes from an item.
You can change it with [`setItem`](jd:paper:org.bukkit.entity.ThrowableProjectile#setItem(org.bukkit.inventory.ItemStack)).

```java
player.launchProjectile(Snowball.class, null, snowball -> snowball.setItem(ItemStack.of(Material.SLIME_BALL)));
```
