---
title: Player registration issues
---

Below you can find more details for problems that may occur upon player registration. In all cases, site admins can skip verifications by [disabling player restrictions](/docs/website-settings#configuring-player-restrictions) or by [adding the player to the bypass list](/docs/website-settings#bypass-registration-restrictions).

## ETF2L account is banned or blacklisted

If tf2pickup.org site enforces having a registered ETF2L account, they cannot be banned or blacklisted, otherwise player registration will fail.

## ETF2L account does not exist

If tf2pickup.org site enforces having a registered ETF2L account, users without ETF2L accounts cannot register to the site. They must log in on [ETF2L](https://etf2l.org), create their own profile and then they will be able to log in.

## Private Steam profile and game statistics

If tf2pickup.org site enforces in-game hours spent requirement, player's Steam profile must be public with public game stats, so tf2pickup.org site can verify it through Steam API, otherwise the registration will fail. The following settings shown below should be set on the profile:

![public-game-details](/img/content/website-settings/public-game-details.png)

After changing these settings, player should wait a short while in order to be able to join, so the site can get updated data from Steam API.

## Insufficient TF2 in-game hours

If tf2pickup.org site enforces in-game hours spent requirement, player's in-game time spent must meet the requirement. There is a common misunderstanding within players as hours spent in the game are not checked by looking at general game time spent, but by the in-game statistics.

These hours are not checked:

![tf2-profile-hours](/img/content/registration-issues/tf2-profile-hours.png)

These hours are being checked:

![tf2-stats-being-checked](/img/content/website-settings/tf2-stats-being-checked.png)
