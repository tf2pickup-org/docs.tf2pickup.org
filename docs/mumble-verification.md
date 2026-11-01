---
title: Mumble player verification
---

By default the tf2pickup.org bot only creates the Mumble channels for every game. Who can join them is up to your Mumble server's own permissions, which usually means admins registering every new player by hand.

Automatic player verification lets the bot take care of that. It recognizes players by their Mumble certificate and only lets a game's players into its channels, and each team into its own team channel.

:::caution
Automatic player verification is being rolled out in stages. You can already turn it on and check the bot's permissions, but verifying players and restricting channels will arrive in upcoming releases. This page will be updated as they land.
:::

## Turning it on

Go to the **Voice server** page in the admin panel and turn on **Verify players automatically** in the Mumble section, then save. The setting is off by default.

## Granting the bot permissions

Under the Mumble connection status, the **What the bot is allowed to do** list shows every permission the bot needs, and whether it has it. The first two are needed in any case; the rest show up once **Verify players automatically** is on, so turn it on first to see the full list.

| What the bot does                    | Mumble permission | Where                 | Needed for          |
| ------------------------------------ | ----------------- | --------------------- | ------------------- |
| Join the games channel               | Enter             | games channel         | always              |
| Create channels                      | Make channel      | games channel         | always              |
| Change who can join a channel        | Write ACL         | games channel         | player verification |
| Move players between channels        | Move              | games channel         | player verification |
| Message players                      | Text message      | games channel         | player verification |
| Register admins                      | Register User     | root channel          | player verification |
| See players' IP addresses            | Ban               | root channel          | player verification |

The _games channel_ is the one set in the **Channel name** field on the Voice server page. The _root channel_ is the top-level channel of your Mumble server.

:::info
The bot needs _Ban_ only because Mumble shows users' IP addresses only to users who are allowed to ban. The bot compares them with the IP addresses players connect to the game server from, to verify them automatically. It never bans anyone.
:::

### Games channel

If you followed the [Mumble server setup](/docs/site-components-deployment#mumble-server-setup), the bot already has _Write ACL_ on the games channel. _Write ACL_ includes every other permission on that channel, so there's nothing more to do here.

### Root channel

1. Make sure the bot is registered on the Mumble server.
2. Right-click the root channel, choose _Edit..._ and open the _ACL_ tab.
3. Click _Add_ and type the bot's username in the lower field.
4. Tick _Applies to this channel_. _Applies to sub-channels_ is not needed.
5. On the right-hand side, tick _Allow_ next to _Ban_ and _Register User_.
6. Press _OK_ to save.

Do not give the bot _Write ACL_ on the root channel. It doesn't need it, and it would let the bot change permissions on your whole server.

Reload the Voice server page afterwards. Every row in the list should show a green tick.

## Raising message rate limits

By default Mumble ignores a client's messages after a burst of 5, then allows 1 per second. The bot sends a message for every permission change, so with the defaults its updates time out when several games start or end at once. Raise the limits in your Mumble server configuration, for example:

```ini title="mumble-server.ini"
messageburst=50
messagelimit=10
```

If you run Mumble from the Docker image used in the [site components deployment](/docs/site-components-deployment#env), set these variables in your `.env` file instead:

```bash title=".env"
MUMBLE_CONFIG_MESSAGEBURST=50
MUMBLE_CONFIG_MESSAGELIMIT=10
```

Restart the Mumble server after changing them. The bot can't read these settings, so the admin panel can't tell you whether they're set; check them yourself.
