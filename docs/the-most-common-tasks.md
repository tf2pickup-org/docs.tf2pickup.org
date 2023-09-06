---
title: The most common tasks
---

Here you can find a list of the tasks admins perform on the site:

## Scramble maps

You may want to scramble the maps if one of the maps is played too often. You can do so by clicking this button in the Admin panel:

![scramble-maps](/img/content/common-tasks/scramble-maps.png)

## Reassigning game servers to games

Sometimes player may experience technical problems with game servers such as unability to connect or high latencies. In cases like this, you may want to switch game server used for the game. Click `reassign...` to do it.

![pickup-start](/img/content/common-tasks/pickup-start.png)

A list with all available servers will show up. Click on one of them to change.

:::info
In case no static servers are available, game servers from serveme.tf will show up (when serveme.tf API is set correctly).
:::

![reassign-server](/img/content/common-tasks/reassign-server.png)

After that, a new server will reconfigure and people will be able to connect to it.

![reassign-server](/img/content/common-tasks/after-server-reassignment.png)

## Reinitializing games

Sometimes the game server may be stuck during the pickup initialization. In case the pickup starts up for over two minutes, you may want to reinitialize the game. This means that the pickup server will try to reinitialize the game on the same pickup server.

In cases like this just click the `reinitialize server` button.

![reinitializing-the-game](/img/content/common-tasks/reinitializing-the-game.png)

## Force closing games

In some cases the game may fail - sometimes because of an excessive amount of substitutes, sometimes because the game was not started and people still wait for a substitute or for some reason the pickup server does not end the pickup (change pickup state from `started` to `ended`). This is when the game should be force-closed. Click `force end` in order to force-close the game.

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

In order to define skill for a certain player, go to a player page and click `edit`:

![player-profile](/img/content/overview/player-profile.png)

This is how skill definition looks like for a certain player on 6v6:

![set-skills-for-a-player](/img/content/common-tasks/set-skills-for-a-player.png)

There you can see a skill definition view for Highlander (9v9):

![set-skills-for-a-player-in-highlander](/img/content/common-tasks/set-skills-for-a-player-in-highlander.png)

### Defining default skill values

In order to define player skills, go to the admin panel and choose `Default player skill`.

![define-default-player-skill-values](/img/content/common-tasks/define-default-player-skill-values.png)

Then, define values for classes available and save it.

![set-default-player-skill](/img/content/common-tasks/set-default-player-skill.png)

Here is how it looks like for Highlander site:

![set-default-player-skill-for-highlander](/img/content/common-tasks/set-default-player-skill-for-highlander.png)

### Reviewing skill values

If you want to review skill values for all users on the website, go to the admin panel and choose `Player skill table`.

![open-player-skill-table](/img/content/common-tasks/open-player-skill-table.png)

You can sort all columns (containing nicknames and skill values) ascending/descending, just by clicking on the column names.

![skill-table](/img/content/common-tasks/skill-table.png)

## Edit nicknames

Editing nicknames is pretty easy. All you need do is to open a player profile, click `edit`, edit their nickname in the nickname field and click `save`.

## Handing out bans

In some cases you have to ban someone from playing pickups, mostly due to breaking site rules. In order to ban someone, open up their profile and click `bans` and `add ban` in the next menu.

![find-profile-to-ban](/img/content/common-tasks/find-profile-to-ban.png)

Then, define a ban reason and the ban length. You can define a ban length by the duration, end date or without due date, meaning someone is getting banned forever. Click `add ban` after that.

![ban-player-duration](/img/content/common-tasks/ban-player-duration.png)

![ban-player-enddate](/img/content/common-tasks/ban-player-enddate.png)

![ban-player-forever](/img/content/common-tasks/ban-player-forever.png)

In that way the player is banned. You can see the ban history of a certain user in that menu.

![player-bans-menu](/img/content/common-tasks/player-bans-menu.png)

This is what the banned user sees when banned:

![ban-from-player-perspective](/img/content/common-tasks/ban-from-player-perspective.png)

### Revoke player ban

Revoking a ban on a player is pretty easy. All you have to do is to click `revoke` on an active ban from the ban history list of a certain user.

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
