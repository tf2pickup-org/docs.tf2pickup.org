---
title: Website settings
---

## Settings overview

Currently website settings lets you:

- configure game servers (including serveme.tf server preferences),
- configure map pool,
- configure game settings,
- configure default player skill,
- configure player restrictions,
- configure voice server,
- configure advanced site settings,
- force create player account,
- import player skill,
- show site player skill table,
- scramble maps available to vote at the moment,
- edit rules,
- edit privacy policy.

![admin-panel](/img/content/overview/admin-panel.png)

## Configuring game servers

See [here](/docs/final-touches#adding-game-servers-to-the-website).

## Map pool settings

You can configure as much maps as you want to. You have to make sure the map is placed in the `maps` folder in the game servers, so they will be able to start the map. Values on left are map names without `.bsp` extension file and values on right are config names placed in the `cfg` folder (at the moment only ETF2L configs are available).

![set-map-pool](/img/content/website-settings/set-map-pool.png)

## Defining game settings

Here you can set up:

- server whitelist
- join gameserver timeout
- rejoin gameserver timeout
- execution of extra commands
- logs.tf upload method

![game-configuration](/img/content/website-settings/game-configuration.png)

### Server whitelist

You can set up a whitelist by defining a whitelist name or its ID from [whitelist.tf](https://whitelist.tf). If not defined, all items will be available on the pickup games.

### Join gameserver timeout

This option defines time (in seconds) after which the site will check if player is connected to the gameserver. If not, the player will be subbed automatically and banned with a cooldown. Default levels set are:

- Level 0: 1800000 ms (30 minutes)
- Level 1: 21600000 ms (6 hours)
- Level 2: 86400000 ms (1 day)
- Level 3: 604800000 ms (7 days)
- Level 4: 2592000000 ms (30 days)
- Level 5: 15778476000 ms (approximately 6 months)
- Level 6: 31556952000 ms (approximately 1 year)

The first cooldown ban given is with a time defined in Level 0. Every next ban level is incrased by 1. Currently cooldown bans do not expire, meaning if your last cooldown ban was 4, you will get a Level 5 ban even after months from the last one.

When the value is set for 0, no join gameserver timeout time is being checked.

### Rejoin gameserver timeout

This option defines time (in seconds) after which the site will request a substitute after player left the server during the game. When it passes and a substitute joins, the missing player gets a cooldown ban.

When the value is set for 0, no rejoin gameserver timeout time is being checked.

### Execution of extra commands

Lets server administrator set extra CVars which are executed upon configuration file execution given for a map being run on the gameserver, one CVar per line. Leaving it empty means no extra configuration for the gameserver.

### Logs.tf upload method

Defines a logs.tf upload method, where available options are:

- Off - no logs will be uploaded by logs.tf
- Backend - logs will be uploaded by the tf2pickup.org application only
- Gameserver - logs will be uploaded by the logs.tf sourcemod plugin

## Configuring default player skill

See [here](/docs/the-most-common-tasks#defining-default-skill-values).

## Configuring player restrictions

Since not all regions of the world participate in ETF2L or have a profile created there, this option allows you to:

- enable/disable user validation against the [ETF2L API](https://api-v2.etf2l.org),
- define minimum TF2 in-game time spent in order to register to the website,
- allow/deny players with no skill assigned.

The ETF2L user validation lets website:

- Assign an ETF2L profile to the tf2pickup.org profile.
- Block player registration if the player is blacklisted/banned from the ETF2L.
- Assign the nickname to a player (without it, the current nickname on steam is assigned to a tf2pickup.org profile).

This switch lets you toggle the ETF2L profile validation check, according to your needs.

The in-game time spent restriction is based on the Team Fortress 2 Stats [(example)](https://steamcommunity.com/id/cosiepatrzysz/stats/TF2), not the general in-game spent time on the Steam profile [(example)](https://steamcommunity.com/id/cosiepatrzysz). The example of hours being checked can be also seen below:

![player-restrictions](/img/content/website-settings/tf2-stats-being-checked.png)

In order to change the requirement, simply click on it, define a new amount of hours and click **OK**.

![player-restrictions](/img/content/website-settings/player-restrictions.png)

If the last setting is enabled, any used with skill not defined manually by an admin will not be able to join pickup queue and they will be notified about it:

![your-account-needs-review](/img/content/website-settings/your-account-needs-review.png)

## Configuring voice server settings

See [here](/docs/final-touches#set-up-voice-chat-settings).

## Configuring advanced site settings

:::warning
Changing values through this interface is not supported. Change these settings only if you know what you're doing and if you change anything here, make sure you have made a database backup first.
:::

![advanced-server-configuration](/img/content/website-settings/advanced-server-configuration.png)

This menu lets super-users change settings, which are not yet implemented as sub-menu options as well as options available in other views. We will focus here on settings which are unavailable in other views:

- ban cooldown levels
- map cooldown
- ready state timeout
- ready up timeout
- excluding specific serveme.tf gameservers
- change promoted streams

### Changing ban cooldown levels

Lets specify the amount of cooldown levels as well as the ban length in miliseconds. Should be provided in JSON format in one line. Default settings are:

```json
[
   {
      "level":0,
      "banLengthMs":1800000
   },
   {
      "level":1,
      "banLengthMs":21600000
   },
   {
      "level":2,
      "banLengthMs":86400000
   },
   {
      "level":3,
      "banLengthMs":604800000
   },
   {
      "level":4,
      "banLengthMs":2592000000
   },
   {
      "level":5,
      "banLengthMs":15778476000
   },
   {
      "level":6,
      "banLengthMs":31556952000
   }
]
```

### Setting map cooldown

By default, after map is being picked to a next pickup game, it is excluded for the next two games from being available as a vote option. Changing this settings overrides the cooldown given for the map choice. Should be provided as an integer.

### Setting up ready state timeout

:::warning
Changing this variable is unsupported. Restart your application in order to apply the change.
:::

Defines time in miliseconds (default: `60000``) default value: given for all players to click the button as an indication to be ready to play a game. Should be provided as an integer.

### Setting up ready up timeout

:::warning
Changing this variable is unsupported. Restart your application in order to apply the change.
:::

Defines time in miliseconds (default: `40000`). After the ready up mode is canceled due to insufficient amount of people in the queue, this value defines a time during which all players who have been in the queue during last ready-up mode will be readied up automatically. Should be provided as an integer.

### Excluding specific serveme.tf gameservers

If defined, when the application reserves a serveme.tf server, it will not pick any servers with a name which contains values given in an array. Empty by default. Example: `[  "NewBrigade",  "MonikaBrigade"]`

### Changing promoted streams

This setting lets the super-user modify a promoted stream list apart from streams of all players who have integrated their accounts with Twitch. Options should be provided as an array. Default value: `[  "teamfortresstv",  "teamfortresstv2",  "teamfortresstv3",  "kritzkast",  "kritzkast2",  "rglgg",  "essentialstf",  "cappingtv",  "cappingtv2",  "cappingtv3",  "tflivetv"]`

## Bypass registration restrictions

Players who do not meet the registration requirements (such as having a public Steam profile, an ETF2L profile, or a minimum number of TF2 hours) will see an error when they try to log in. To allow such a player to register anyway, you can add their Steam ID to the bypass list.

Go to the admin panel and choose `Bypass restrictions`. Enter the player's SteamID64 (for instance `76561198011558250`) and click `Add user Steam ID`.

![bypass-registration-restrictions](/img/content/website-settings/bypass-registration-restrictions.png)

Once their Steam ID is on the bypass list, the player can log in normally through Steam — the registration restrictions will be skipped for them. Their profile will be created automatically when they log in for the first time.

:::tip
If a player had a failed login attempt due to registration restrictions, let them know to wait a moment before trying again, because the error may persist briefly.
:::

## Setting up player skills

See [here](/docs/the-most-common-tasks#setting-up-player-skills).

## Set up website rules

See [here](/docs/final-touches#adding-site-rules).

## Set up privacy policy

See [here](/docs/final-touches#reviewing-the-privacy-policy).
