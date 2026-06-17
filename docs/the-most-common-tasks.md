---
title: The most common tasks
---

Here you can find a list of the tasks admins perform on the site:

## Clearing the queue

If you need to reset the queue instantly — for example during a test, or when players are unresponsive — use the **Clear queue** button in the queue header. This button is only visible to admins.

Clicking it will ask for confirmation before proceeding. Once confirmed, all players are removed from their queue slots. A notification is sent to the admin Discord channel with your name and the number of players removed. The map vote and queue state are preserved.

![clear-queue](/img/content/common-tasks/clear-queue.png)

## Scramble maps

You may want to scramble the maps if one of the maps is played too often. You can do so by clicking this button in the Admin panel:

![scramble-maps](/img/content/common-tasks/scramble-maps.png)

## Reassigning game servers to games

Sometimes player may experience technical problems with game servers such as inability to connect or high latencies. In cases like this, you may want to switch the game server used for the game. Click `Reassign game server` to do it.

![pickup-start](/img/content/common-tasks/pickup-start.png)

A list with all available servers will show up. Select one and click `Select` to change.

:::info
When the serveme.tf API key is configured, serveme.tf servers will always appear in the list alongside any static servers.
:::

![reassign-server](/img/content/common-tasks/reassign-server.png)

After that, a new server will reconfigure and people will be able to connect to it.

## Reinitializing games

Sometimes the game server may be stuck during the pickup initialization. In case the pickup starts up for over two minutes, you may want to reinitialize the game. This means that the application will try to reinitialize the game on the same game server.

In cases like this just click the `Reinitialize game server` button.

![reinitializing-the-game](/img/content/common-tasks/reinitializing-the-game.png)

## Force closing games

In some cases the game may fail - sometimes because of an excessive amount of substitutes, sometimes because the game was not started and people still wait for a substitute or for some reason the game server does not end the game (change game state from `started` to `ended`). This is when the game should be force-closed. Click `Force-end` to force-close the game.

:::caution
Force ended games do not count in the player statistics.
:::

## Setting up player skills

This is probably the most important task of every single pickup admin. Pickup games on tf2pickup.org are based on skills - values assigned to players in order to define their skill on certain classes, depending on a gamemode used on a website. These are integer values between [-9007199254740991 and 9007199254740991](https://www.tektutorialshub.com/typescript/typescript-number-min-max-safe-values/). Any range of values can be used in order to define skills for players. These skill values are used by the pickup site in order to balance out teams for the pickup games, so after all people add and ready up in the queue, the pickup server will calculate the most balanced teams based on skill values of players who added up on certain classes.

### Balancing target

In short, the pickup admin team is to define skill range for classes, set them on every single player and observe game results after setting those skills up. If the games were unbalanced, admins should review the game, see who made an inpact in the game result and adjust skill values, so the next game will be more balanced. The best results are achieved when the games are close or even if they end up in a draw.

[This](https://tf2pickup.eu/game/64f6404b9aaf0e6e4bf41322) is an example of a balanced game (it ended up with a score 1:2 for the RED team):

![game-skill-values](/img/content/common-tasks/game-skill-values.gif)

:::important
Skills are hidden by default in order to prevent admins from leaking values accidentally when sharing their screens.
:::

If you add up individual player values per team, you will end up with this:

|  | BLU | RED |
|:-:|:-:|:-:|
|  | 12 | 6 |
|  | 14,5 | 16 |
|  | 2 | 10 |
|  | 5 | 10 |
|  | 10 | 11 |
|  | 9 | 1,5 |
| Result | 52,5 | 54,5 |

This is pretty much the expected result.

If you won't assign skill for a player - they will get skill values defined in a default skill table, where it's 0 by default. Default skills are assigned to a player right after their registration on site - regardless if they joined the site themselves or the registration was forced by an admin.

### Assigning skills to a player

When an admin views a player's profile, a skill editing toolbox is displayed directly on the page. It shows input fields for each game class, a win-loss chart, and a save button.

If [player verification](/docs/website-settings#configuring-player-restrictions) is enabled, the toolbox also shows a **Player verified** checkbox. Checking it allows the player to join the queue; unchecking it revokes that permission immediately.

![set-skills-for-a-player](/img/content/common-tasks/set-skills-for-a-player.png)

Adjust the values for each class and click `Save`. You can also click `Reset` to revert the player's skills to the default values defined in the [default skill table](#defining-default-skill-values).

### Skill suggestions (experimental)

When the **Skill suggestions** option is enabled in [Player Restrictions](/docs/website-settings#configuring-player-restrictions), the admin toolbox shows small arrows next to class skill inputs where a player's in-game performance consistently suggests a miscalibration:

- **↑ arrow** — the player's performance on that class consistently suggests the skill value may be set too low.
- **↓ arrow** — the player's performance on that class consistently suggests the skill value may be set too high.

Suggestions require at least 10 games on the class to appear. After you manually adjust a player's skill, suggestions for that class are silenced for 3 games to give the change time to take effect.

:::note
This feature is experimental. It can be toggled from the Player Restrictions page in the admin panel.
:::

### Reviewing skills in the queue

When you hover over a player's name in a queue slot, a tooltip shows their skill values for each class that has one assigned. Players with no skill assigned at all are marked with a clover icon to help you spot fresh players at a glance.

### Defining default skill values

Default player skill values are configured in the admin panel under `Player restrictions`. Scroll down to the default skill section, set the values for each class, and save.

![player-restrictions](/img/content/website-settings/player-restrictions.png)

### Reviewing skill values

You can export all player skills as a CSV file from the admin panel under `Skill import/export`. This lets you review and edit skill values in a spreadsheet application.

![skill-table](/img/content/common-tasks/skill-table.png)

## Edit nicknames

Editing nicknames is pretty easy. All you need do is to open a player profile, click `edit`, edit their nickname in the nickname field and click `save`.

## Handing out bans

In some cases you have to ban someone from playing pickups, mostly due to breaking site rules. In order to ban someone, open up their profile and click `Edit player`.

![find-profile-to-ban](/img/content/common-tasks/find-profile-to-ban.png)

Then navigate to the `Bans` tab and click `Add ban`.

![player-bans-menu](/img/content/common-tasks/player-bans-menu.png)

Define a ban reason and the ban length. You can define a ban length by the duration, end date or without due date, meaning someone is getting banned forever. Click `Save` after that.

### Anonymous bans

When adding a ban, you can tick the **Anonymous** checkbox. The banned player (and anyone else viewing the ban) will see it as issued by **&lt;your website name&gt; Staff** instead of your nickname. Admins still see who actually issued the ban — in the player's ban history, an anonymous ban is marked with an _(anonymous)_ label next to the real actor's name.

Use this when you want to hand out a ban without exposing which individual admin issued it.

![ban-player-duration](/img/content/common-tasks/ban-player-duration.png)

![ban-player-enddate](/img/content/common-tasks/ban-player-enddate.png)

![ban-player-forever](/img/content/common-tasks/ban-player-forever.png)

This is what the banned user sees when banned:

![ban-from-player-perspective](/img/content/common-tasks/ban-from-player-perspective.png)

### Revoke player ban

Revoking a ban on a player is pretty easy. All you have to do is to click the revoke button on an active ban from the ban history list.

![player-bans-menu](/img/content/common-tasks/player-bans-menu.png)

## Subbing out players

:::important
Subbing out players is currently possible **only** by the site admins.
:::

If a player for some reason cannot continue a game or they cannot join the game, you can request a player substitute, so somebody can join to a game in a place of the aformentioned player. You can do that from a game details page.

Click the `Request substitute` button next to a player nickname you want to request a sub for.

![request-substitute-button](/img/content/common-tasks/request-substitute-button.png)

Then, the notification the website will show up with a Discord notification on a specific channel.

![substitute-needed-notification](/img/content/common-tasks/substitute-needed-notification.png)

![sub-needed](/img/content/overview/sub-needed.png)

After opening up a link, you can see a free spot where you can join in and you can see who is in the team. Click on an empty spot to join it.

![request-substitute-free-spot](/img/content/common-tasks/request-substitute-free-spot.png)

Upon joining, the connect link to a server will show up. Moreover, the replacement player will not have a skill value shown up next to their nickname in order to mark that this player was a sub and his skill did not count to a team skill calculations.

![request-substitute-free-spot](/img/content/common-tasks/request-substitute-after-joining.png)

:::note
A player who substitutes themselves out of a game faces the same queue join cooldown as any other queue action — they cannot immediately re-join the queue.
:::
