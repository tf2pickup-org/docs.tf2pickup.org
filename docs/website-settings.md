---
title: Website settings
---

## Settings overview

The admin panel's sidebar groups the settings by topic:

- **Queues**: add, enable, reorder and configure queues, including each queue's map pool and timers.
- **Players**:
  - **Registration**: who can register.
  - **Skill**: default skill and skill tools.
  - **Penalties**: cooldown bans and the join-queue cooldown.
- **Games**:
  - **Match rules**: connect timeouts and auto force-end.
  - **Game servers**: static servers, serveme.tf and TF2 QuickServer.
  - **Server configuration**: the global whitelist, extra commands and logs.tf.
  - **Voice server**.
- **Community**: Discord, announcements, streams, rules and privacy policy.
- **Logs**: the activity log and the player action logs (super-users only).
- **Advanced**: view for nerds and deleting players (super-users only).

Every settings page has a save bar at the bottom. Edit as many settings as you want, then click **Save** once; **Discard** throws your edits away. A setting that differs from its default is marked **Modified**, and its **Reset** button sets it back to the default.

![admin-panel](/img/content/overview/admin-panel.png)

## Managing queues

Since version 5, one instance can run several queues. A queue is a gamemode (6v6, 9v9, bball or ultiduo) plus its own settings, so two queues can share a gamemode, for example a 6v6 queue open to everyone and a restricted 6v6 queue. Each queue has its own page at `/q/<slug>`, and the front page shows the default queue.

Go to **Admin panel → Queues** to:

- **add a queue.** Start from a template (for example `6v6` or `9v9 (restricted)`) or from a blank queue, then pick a slug and a name. The slug is the queue's address (`/q/<slug>`) and can't be changed later. The gamemode can't be changed later either.
- **enable or disable a queue.** At least one queue must stay enabled. Only disabled queues can be deleted.
- **reorder queues.** The first enabled queue is the default one, shown on the front page and served by `GET /api/v1/queue`.
- **set the pre-ready-up duration**, which applies to every queue: how long a player's pre-ready lasts.

Click a queue's name to open its settings. They are split into three tabs.

### General

- **Name**: shown in the queue switcher and on Discord.
- **Require player verification**: admins must verify each player before they can join this queue. See [Player verification](#player-verification).
- **Player skill threshold**: players can join this queue only on classes where their skill meets the threshold. Only for skill-balanced gamemodes (6v6 and 9v9).
- **Whitelist ID**: the TF2 server whitelist for this queue's games. Leave it empty to use the global one (see [Server whitelist](#server-whitelist)).

### Maps

The queue's map pool. You can configure as many maps as you want. Make sure each map is in the game servers' `maps` folder, so they can start it. The left column is the map name without the `.bsp` extension; the right column is the name of a config in the `cfg` folder (at the moment only ETF2L configs are available).

![set-map-pool](/img/content/website-settings/set-map-pool.png)

Below the map pool, auto queues show the maps players can currently vote for. Click **Scramble** to draw a new set from the map pool.

### Timers

- **Ready-up timeout**: how long players have to ready up before they are kicked out of the queue.
- **Ready state timeout**: how long the queue stays in the ready-up state before going back to waiting, unless all players ready up.
- **Pick timeout** (captain queues only): how long a captain has for one turn of the draft.

The map cooldown (how many games have to be played before a map can be voted for again) is in [View for nerds](#view-for-nerds).

## Registration

**Admin panel → Registration** decides who can register on the website. Since not all regions of the world participate in ETF2L or have a profile there, both requirements are optional:

- **Require ETF2L account**: players without an [ETF2L](https://etf2l.org) profile can't register. With it, the website also assigns the ETF2L profile and nickname to the player (without it, the player's current Steam nickname is used), and blocks players blacklisted or banned on ETF2L.
- **Minimum TF2 in-game hours**: use 0 to turn the check off.

The in-game time is based on the Team Fortress 2 Stats [(example)](https://steamcommunity.com/id/cosiepatrzysz/stats/TF2), not the general in-game time on the Steam profile [(example)](https://steamcommunity.com/id/cosiepatrzysz). The example of hours being checked can be also seen below:

![player-restrictions](/img/content/website-settings/tf2-stats-being-checked.png)

![player-restrictions](/img/content/website-settings/player-restrictions.png)

To let a player register even though they don't meet these requirements, add them to the **Exceptions** list. See [Bypass registration restrictions](#bypass-registration-restrictions).

### Player verification

Player verification is set per queue (see [General](#general)). If **Require player verification** is enabled on a queue, admins must manually verify each player before they can join that queue. Unverified players will see the queue join buttons disabled. Admins can verify a player directly from their profile page using the **Player verified** checkbox in the admin toolbox.

When a player's verification status changes, a notification is sent to the Discord admin channel (green embed for verified, orange for revoked).

## Skill

**Admin panel → Skill** holds:

- **Default skill for new players**, per gamemode. See [Defining default skill values](/docs/the-most-common-tasks#defining-default-skill-values).
- **Skill step**: how much the +/− buttons change a skill on a player's admin toolbox.
- **Skill suggestions (experimental)**, on by default: the admin toolbox on player profile pages shows arrows next to class skill inputs when a player's in-game performance consistently suggests their skill may be miscalibrated. See [Skill suggestions](/docs/the-most-common-tasks#skill-suggestions-experimental).
- A link to **skill import and export**. See [Reviewing skill values](/docs/the-most-common-tasks#reviewing-skill-values).

## Penalties

### Cooldown bans

When a player is subbed out of a game because they didn't join the game server in time, or didn't come back after leaving it, they get a cooldown ban. Each new offence moves the player one level up, and each level bans for longer. The default levels are:

| Level | Ban length |
|:-:|:-:|
| 0 | 30 minutes |
| 1 | 6 hours |
| 2 | 1 day |
| 3 | 7 days |
| 4 | 30 days |
| 5 | about 6 months |
| 6 | about 1 year |

You can change the ban lengths and add or remove levels. A player past the last level always gets the last ban length.

**Cooldown level decay**: every period without a new offence, a player's cooldown level drops by one, so old offences stop counting. Use 0 to disable decay; then cooldown levels never drop.

### Join-queue cooldown

How long a player has to wait after a game ends before they can join the queue again, set per class. Useful for giving others a turn on popular classes. Use 0 for no wait.

## Match rules

**Admin panel → Match rules**:

- **Join gameserver timeout**: how long a player has to join the game server after the game starts. If they don't, they are subbed automatically and get a [cooldown ban](#cooldown-bans). Use 0 to disable.
- **Rejoin gameserver timeout**: how long a player has to come back after they leave the game server during the match. When it passes, a substitute is requested, and once the substitute joins, the missing player gets a cooldown ban. Use 0 to disable.
- **Auto force-end threshold**: once this many substitute requests are open at the same time, the game is force-ended automatically. Use 0 to disable.

## Configuring game servers

See [here](/docs/final-touches#adding-game-servers-to-the-website).

## Server configuration

**Admin panel → Server configuration** applies to the game servers of every queue.

![game-configuration](/img/content/website-settings/game-configuration.png)

### Server whitelist

Set a whitelist name or its ID from [whitelist.tf](https://whitelist.tf). If not defined, all items will be available on the pickup games.

This is the global whitelist. A queue can have a whitelist of its own (see [General](#general)); a game uses its queue's whitelist, or the global one if the queue has none.

### Execute extra commands

Extra commands run over RCON on the game server before the match starts, one per line. Leave it empty to run none.

### logs.tf upload method

- **Off**: logs aren't uploaded to logs.tf.
- **Backend**: the tf2pickup.org application uploads the logs.
- **Gameserver**: the logs.tf SourceMod plugin on the game server uploads the logs.

## Configuring voice server settings

See [here](/docs/final-touches#set-up-voice-chat-settings).

## Community

- **Discord**: the Discord invite link shown to players across the site, and the channels the Discord bot posts to (the bot needs `DISCORD_BOT_TOKEN` set in the environment).
- **Announcements**: messages shown to players on the site.
- **Streams**: twitch.tv channels that are always listed when they are live, whether or not they belong to a player. One channel name per line.
- **Rules & privacy policy**: see [Adding site rules](/docs/final-touches#adding-site-rules) and [Reviewing the privacy policy](/docs/final-touches#reviewing-the-privacy-policy).

## View for nerds

:::warning
Changing values through this interface is not supported. Change these settings only if you know what you're doing and if you change anything here, make sure you have made a database backup first.
:::

![advanced-server-configuration](/img/content/website-settings/advanced-server-configuration.png)

This page lists every raw application setting, including each queue's settings. Settings that have a page of their own link to it; change them there. A few settings live only here, for example a queue's **map cooldown**: how many games have to be played before a map can be voted for again.

## Bypass registration restrictions

Players who do not meet the registration requirements (such as having a public Steam profile, an ETF2L profile, or a minimum number of TF2 hours) will see an error when they try to log in. To allow such a player to register anyway, you can add their Steam ID to the bypass list.

Go to **Admin panel → Registration** and scroll down to **Exceptions**. Enter the player's **SteamID64** (a 17-digit number, for instance `76561198011558250`) and click `Add user Steam ID`. The entry is removed once the player has registered.

:::important
You must use the SteamID64 format. You can find a player's SteamID64 on their Steam profile URL or via tools like [steamid.io](https://steamid.io).
:::

![bypass-registration-restrictions](/img/content/website-settings/bypass-registration-restrictions.png)

Once their Steam ID is on the bypass list, the player can log in normally through Steam — the registration restrictions will be skipped for them. Their profile will be created automatically when they log in for the first time.

:::tip
If a player had a failed login attempt due to registration restrictions, let them know to wait a moment before trying again, because the error may persist briefly.
:::

## Setting up player skills

See [here](/docs/the-most-common-tasks#setting-up-player-skills).

## Activity log

The admin panel includes an **Activity log** — a paginated, filterable table that records significant administrative and game events on the site. Open it from the admin panel or directly at `/admin/activity-log`.

The log tracks events such as:

- player name changes (with the actor, when changed by an admin),
- player skill changes (showing the before/after values),
- configuration changes (only when a value actually changes — saving without a change records nothing),
- bans added and revoked (with reason and expiry/revoke details),
- map pool changes and map scrambles,
- games reconfigured, game servers reassigned, and games force-ended,
- substitute requests,
- queue clears (showing how many players were removed).

You can filter entries by **type**, **player**, and **actor**. The player and actor filters accept either a name search or a direct SteamID64. The current filter and sort state is kept in the page's query string, so you can share a link to a filtered view with other admins. Click the date column header to toggle the sort order.

:::tip
Each player's admin toolbox includes an **Activity log** link that opens the log pre-filtered to that player (`/admin/activity-log?player=<steamId>`).
:::

:::note
Consecutive map scrambles by the same admin are merged into a single entry with a ×N counter to keep the log readable. Historical entries are backfilled from existing name history, skill history and game events the first time the feature runs, so the log is not empty on upgrade.
:::

## Deleting a player profile

:::warning
This action is **irreversible**. There is no undo and no recycle bin — once a profile is deleted it cannot be restored.
:::

Super-users can permanently delete a player profile. Open it from the admin panel or directly at `/admin/delete-player`.

Search for a player by name or SteamID64, then use the per-player card to delete them. To prevent mistakes, deletion requires typing the player's exact nickname or SteamID64 (validated on the server) and confirming a browser dialog.

When a profile is deleted:

- The player document is **hard-deleted**, so the profile page returns a 404 and the player disappears from the player list and the hall of fame.
- Historical references in games, chat and the activity log are **anonymized** — the player's Steam ID is replaced with a `[deleted]` sentinel, and they render as a greyed-out "deleted user" with no profile link. Chat mentions (both the rendered link and the `@<id>` token) are scrubbed too.
- **Player action logs keep the real Steam ID** for auditing. The profile link there becomes a dead link, but the Steam ID remains visible in its own column.
- Live presence (online players, queue slots, friendships) is cleared so no live views break.

:::note
Super-users cannot be deleted. Their card shows "cannot be deleted", and the server re-enforces this even if the request is crafted manually.
:::

## Set up website rules

See [here](/docs/final-touches#adding-site-rules).

## Set up privacy policy

See [here](/docs/final-touches#reviewing-the-privacy-policy).
