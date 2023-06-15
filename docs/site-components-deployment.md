---
title: Site components deployment
---

In order to allow for a quick site setup, we make use of Docker containers. That lets us set up the website (client and server with its database), gameservers and optionally a Mumble server. In order to start looking into deploying your own tf2pickup.org instance, you have to have all files specified below. Examples are based on [tf2pickup.fi](https://tf2pickup.fi) website, domain and their Discord server.

## Prerequisites

- have everything mentioned in the [reverse proxy deployment](/docs/setup-prerequisites) set up,
- have modern Docker and docker-compose version installed in your system, for docker-compose [use this guide](https://docs.docker.com/compose/install/) and for Docker feel free to use guides for:
  - [Ubuntu 22.04](https://docs.docker.com/engine/install/ubuntu/),
  - [Debian 11](https://docs.docker.com/engine/install/debian/),
  - [Arch Linux](https://wiki.archlinux.org/title/docker#Installation),
- prepare the following files in a separate folder, name it `tf2pickup-fi`, then place inside:
  - `.env` - stores variables needed for setting client, server, database and mumble containers up
  - `gameserver_1.env` - stores settings for the first game server _(optional)_
  - `gameserver_2.env` - stores settings for the second game server _(optional)_
  - `gameserver_3.env` - stores settings for the second game server _(optional)_
  - `docker-compose.yml` - contains all container settings
  - `redis.conf` - contains Redis configuration
  - `maps/` folder - it should contain all maps available for the game servers, `.bsp` extension,
  - `sourcetv1`, `sourcetv2`, `sourcetv3` folders - they will contain SourceTV demos from the pickup game servers.

Files `gameserver_{1,2,3}.env` are useful if you want to host game servers on the same host as the website. There is no `gameserver_3.env` example, but in fact the file syntax is the same, so you can basically edit values and just uncomment the part of the configuration in the `docker-compose.yml` file. In the same way, if you want to host 1 game server, just comment parts of the second game server and if you want to run game servers separately, just comment all parts of it in the aforementioned file.

The same rule goes for the Mumble server - if you want to run it outside Docker, aka use a local system installation, just don't provide needed configs for it and comment the part of the `docker-compose.yml` file for it.

```sh
root@tf2pickup:~# ls /home/tf2pickup/tf2pickup-fi/maps/ -al
total 1259216
drwxr-xr-x 2 tf2pickup tf2pickup      4096 Jun  8 22:35 .
drwxrwxr-x 4 tf2pickup tf2pickup      4096 Jun  9 21:09 ..
-rw-r--r-- 1 tf2pickup tf2pickup  25981141 Nov 16  2017 cp_badlands.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  48651296 Mar 16  2017 cp_granary_pro_rc8.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  18710602 Mar 16  2017 cp_granary_pro_rc8.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  38912080 Feb  4 12:51 cp_gullywash_f3.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  17992573 Feb  4 12:51 cp_gullywash_f3.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  24500234 Jan 11  2019 cp_gullywash_final1.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  24061268 Jan 11  2019 cp_gullywash_final1.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  28731812 May 22  2020 cp_logjam_rc12f.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  12693814 May 22  2020 cp_logjam_rc12f.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  29100584 Jan 14  2019 cp_logjam_rc9.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  12987328 Jan 14  2019 cp_logjam_rc9.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  18970621 Dec  8  2019 cp_metalworks.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  18687571 Dec  8  2019 cp_metalworks.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  18312502 Nov 29  2020 cp_process_f7.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  18024376 Nov 29  2020 cp_process_f7.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  49282532 Apr 15  2017 cp_process_final.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  21364357 Apr 15  2017 cp_process_final.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  77921396 Jul 22  2018 cp_prolands_b6.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  23282904 Jul 22  2018 cp_prolands_b6.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  72041100 Jan  3  2019 cp_prolands_rc2p.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  31122834 Jan  3  2019 cp_prolands_rc2p.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  32477488 Apr 25  2020 cp_reckoner_rc6.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  32243941 Apr 25  2020 cp_reckoner_rc6.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  20378888 Jan 31  2019 cp_snakewater_final1.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  20126408 Jan 31  2019 cp_snakewater_final1.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  30319857 Dec  8  2019 cp_sunshine.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  29938052 Dec  8  2019 cp_sunshine.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  19277592 Feb  7 17:44 koth_clearcut_b15d.bsp
-rw-r--r-- 1 tf2pickup tf2pickup   9010068 Feb  7 17:44 koth_clearcut_b15d.bsp.bz2
-rw-r--r-- 1 tf2pickup tf2pickup  17218901 May 11  2019 koth_product_rcx.bsp
-rw-r--r-- 1 tf2pickup tf2pickup  17056131 May 11  2019 koth_product_rcx.bsp.bz2
```

Then, these are the templates for the aforementioned files:

## `.env`

```env
### Configuration for the Server

# Timezone of the server
# https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
TZ=Europe/Helsinki

# The name of the website
WEBSITE_NAME=tf2pickup.fi

# An URL to where this server instance will be accessed
API_URL=https://api.tf2pickup.fi

# An URL to where the client is hosted
CLIENT_URL=https://tf2pickup.fi

# The bot name
BOT_NAME=${WEBSITE_NAME}

# MongoDB
# The commented values below are used for creating a database user and establishing a connection with it
MONGODB_ROOT_USER=admin
MONGODB_ROOT_PASSWORD=yoursuperfunnyrootpassword
MONGODB_USERNAME=tf2pickup
MONGODB_DATABASE=tf2pickup
MONGODB_PASSWORD=yoursuperfunnypassword
# MONGODB_URI syntax:
# mongodb://username:password@hostname/database-name
MONGODB_URI=mongodb://tf2pickup:yoursuperfunnypassword@tf2pickup-fi-mongo/tf2pickup

# Redis URL
REDIS_PASSWORD=yoursuperfunnyredispassword
REDIS_URL=redis://:yoursuperfunnyredispassword@tf2pickup-fi-redis:6379

# logs.tf API key
# Obtain yours here: https://logs.tf/uploader
LOGS_TF_API_KEY=

# Used to authenticate and add servers to the serverlist.
GAME_SERVER_SECRET=yoursuperfunnygameserversecret

# Steam API key
# Get your key at https://steamcommunity.com/dev/apikey
STEAM_API_KEY=1234567890ABCDEF1234567890ABCDEF

# A passphrase that is used to encrypt the keystore file.
# NOTE: For production, get a random password (i.e. from https://passwordsgenerator.net/)
# and do not change it afterwards. If you change the passphare all JWT tokens will no longer
# be valid, so all clients will be logged out.
KEY_STORE_PASSPHRASE=XDXDXDXDXDXDXDXDXD

# SteamID of the super-user
# NOTE: Use the SteamID64 format.
SUPER_USER=76561198011558250

# Which gamemode to run; see src/configs/queue for different gamemodes, possible values: 6v6, 9v9, bball
QUEUE_CONFIG=6v6

# Log relay
# The log relay uses one UDP port to receive logs from the TF2 game servers. These are used
# to determine when the match starts, ends, when users connect, etc.
# It should be the same address as API_URL, but without the https schema.
LOG_RELAY_ADDRESS=api.tf2pickup.fi
LOG_RELAY_PORT=9871

# Discord (optional)
# You will find a bot token at https://discord.com/developers/applications
DISCORD_BOT_TOKEN=XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDX
DISCORD_GUILD=Suomi TF2
DISCORD_QUEUE_NOTIFICATIONS_CHANNEL=tf2pickupfi-yleinen
DISCORD_QUEUE_NOTIFICATIONS_MENTION_ROLE=Mixaajat
DISCORD_ADMIN_NOTIFICATIONS_CHANNEL=admin-ilmoitukset

# twitch.tv integration (optional)
# https://dev.twitch.tv/console, while setting up a new app,
# use OAuth Redirect URL: https://api.tf2pickup.fi/twitch/auth/return
TWITCH_CLIENT_ID=XDXDXDXDXDXDXDXDXDXDXDXDXDXDXD
TWITCH_CLIENT_SECRET=XDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

# serveme.tf integration (optional)
# valid endpoints are:
# serveme.tf
# na.serveme.tf
# sea.serveme.tf
SERVEME_TF_API_ENDPOINT=serveme.tf
# Grab your serveme.tf key here: https://serveme.tf/settings
SERVEME_TF_API_KEY=your_serveme_tf_api_key

### Mumble Server Configuration
# SuperUser account password
MUMBLE_SUPERUSER_PASSWORD=XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD
# Regular expression used to validate user names.
# (Note that you have to escape backslashes with \ )
MUMBLE_CONFIG_USERNAME=[-=\\w\\[\\]\\{\\}\\(\\)\\@\\|\\.]+
# Regular expression used to validate channel names.
# (Note that you have to escape backslashes with \ )
MUMBLE_CONFIG_CHANNELNAME=[ \\-=\\w\\#\\[\\]\\{\\}\\(\\)\\@\\|]+
# This setting is the DNS hostname where your server can be reached.
# It only needs to be set if you want your server to be addressed in the server list by its hostname instead of by IP,
# but if it's set it must resolve on the internet or registration will fail.
MUMBLE_CONFIG_REGISTER_HOSTNAME=tf2pickup.fi
# Specifies the "name" of your server in the public server list and specifies the name of the root channel.
MUMBLE_CONFIG_REGISTER_NAME=tf2pickup.fi
# Welcome message sent to clients when they connect.
#MUMBLE_CONFIG_WELCOMETEXT=Tervetuloa <A href=\"https://tf2pickup.fi/\">tf2pickup.fi</A> mumbleen.<br>Suomi TF2 discord: <A href=\"https://discord.gg/T6PfVC3bqQ\">linkki</A><br>
# Instead, you can put the welcome message in a file and format it properly and this variable defines it's location.
MUMBLE_CONFIG_WELCOMETEXTFILE=/welcome_text.txt
# Location for custom SSL certificate/key. If your certificate and key is in one file, specify MUMBLE_CONFIG_SSL_KEY only.
# If you use certbot for getting certificates, you might need to give your service user permissions to the folder with certificates:
# setfacl -R -m u:tf2pickup:rx,d:tf2pickup:rx /etc/letsencrypt/live
# setfacl -R -m u:tf2pickup:rx,d:tf2pickup:rx /etc/letsencrypt/archive
# IMPORTANT: this will give your service user access to ALL folders containing certificates, so if you have other certificates there you do not want to be access by the tf2pickup user
# consider using acme.sh for obtaining SSL certificates instead
MUMBLE_CONFIG_SSL_CERT=/etc/letsencrypt/live/tf2pickup.fi/fullchain.pem
MUMBLE_CONFIG_SSL_KEY=/etc/letsencrypt/live/tf2pickup.fi/privkey.pem
# allows you to specify a PEM-encoded file with Diffie-Hellman parameters, 
# which will be used as the default Diffie-Hellman parameters for all virtual servers.
# If a file is not specified, each Murmur virtual server will auto-generate its own unique set of 2048-bit Diffie-Hellman parameters on first launch.
MUMBLE_CONFIG_SSLDHPARAMS=@ffdhe4096
# Specifies a percentage of users on the server supporting the Opus codec before the entire server mandates Opus is used. 
# It defaults to 100, so that any non-Opus supporting client connecting will cause the entire server to fall back to CELT.
MUMBLE_CONFIG_OPUSTHRESHOLD=0
# Maximum bandwidth (in bits per second) clients are allowed
# to send speech at.
MUMBLE_CONFIG_BANDWIDTH=130000
# Maximum number of concurrent clients allowed.
MUMBLE_CONFIG_USERS=420
# Disable text message size limit
MUMBLE_CONFIG_TEXTMESSAGELENGTH=0
# Disable image size limit
MUMBLE_CONFIG_IMAGEMESSAGELENGTH=0
```

### Setting up Steam API key

This is probably the easiest API key to get from all tasks here - open [Steam Web API Key site](https://steamcommunity.com/dev/apikey), enter `tf2pickup.fi` in the **Domain Name** field, agree for _Steam Web API Terms of Use_ and click **Register**.

![steam-api-key-register](/img/content/steam-api-key-register.png)

Then, copy and pass **Key** value to a `STEAM_API_KEY` variable.

![steam-api-key-registered](/img/content/steam-api-key-registered.png)

### Setting up Discord bot with channels

:::tip

This step is optional. Follow these steps only if you own a Discord which is directed for the pickup community.

:::

Discord integration enables:

- pickup gather up notification on a public channel,
- substitute notifications when they are needed during a game,
- administration notifications, such as:
  - player bans,
  - player unbans,
  - skill changes,
  - player role changes,
  - player nickname changes,
  - new player registrations,
  - game force-ends,
  - tf2pickup server starts.

In order to create a bot, you have to enter the [Discord Developer Portal](https://discord.com/developers/applications) in the Applications section. Then, click **New Application**.
![discord-create-new-application](/img/content/discord-create-new-application.png)

Add a name for the bot and click **Create**.

![discord-name-new-application](/img/content/discord-name-new-application.png)

After that set the avatar for the application:

![discord-bot-add-flag](/img/content/discord-bot-add-flag.png)

Then go to the bot section, click **Add Bot** and then **Yes, do it!** button on the notification.

![discord-add-new-bot](/img/content/discord-add-new-bot.png)

In the menu you can find a token, which you have to pass in the `DISCORD_BOT_TOKEN` variable. Click **Copy** and note the token in your `.env` file.

You _should_ untick the Public Bot option, since you don't really want to let anybody invite this bot anywhere else than your Discord server(s) (even though it would be useless, as the bot sends connects to the specified discord server only).

![discord-disable-public-invite](/img/content/discord-disable-public-invite.png)

Now you should head over to the OAuth2 section and create a URL allowing you to invite the bot on a server. In the **OAuth2 URL Generator** section under _Scopes_ tick `bot` option. That should create a link below. Copy and open it.

![discord-bot-generate-invite-link](/img/content/discord-bot-generate-invite-link.png)

There you should choose the server on which your community is. You have to have `Manage Server` permissions in order to add the bot on it. Choose the server you want from the dropdown list and click **Authorize**.

![discord-invite-bot](/img/content/discord-invite-bot.png)

After adding the bot you should configure the channels for it. Administration notifications should be sent on a channel available only for the site staff. We suggest to set permissions in a way where the staff have `View Channel` and `Read Message History` permissions and the bot has the following ones:

- `View Channel`,
- `Send Messages`,
- `Embed Links`,
- `Attach Files`,
- `Read Message History`.

The bot should have the same permissions on a channel supposed to be a place for the pickup gather up and substitute notifications. After that, you should define the rest of the Discord Bot related variables. You should look at the following things:

The Discord server name is `Suomi TF2` and the pickup public notifications channel is `tf2pickupfi-yleinen`.

![tf2pickupfi-yleinen](/img/content/tf2pickupfi-yleinen.png)

You should also create a role for pinging players when the substitute is needed. In this example this role is called `Mixaajat`.

![sub-needed](/img/content/sub-needed.png)

The admin notifications channel is called `admin-ilmoitukset`.

![discord-admin-notifications-1](/img/content/discord-admin-notifications-1.png)

Therefore, you should define the rest of Discord Bot variables just like shown below:

```env
DISCORD_GUILD=Suomi TF2
DISCORD_QUEUE_NOTIFICATIONS_CHANNEL=tf2pickupfi-yleinen
DISCORD_QUEUE_NOTIFICATIONS_MENTION_ROLE=Mixaajat
DISCORD_ADMIN_NOTIFICATIONS_CHANNEL=admin-ilmoitukset
```

### Setting up Twitch stream integration

:::tip

This step is optional. Follow these steps only if you want to let people show up their streams on the main page of the pickup site.

:::

Setting it enables site users to integrate their tf2pickup accounts with Twitch, letting access their Twitch profiles through a Twitch link in an icon.

![player-profile](/img/content/player-profile.png)

Moreover, it will show up all Twitch streams on a left site of the main page.

![tf2pickup.fi](/img/content/tf2pickup.fi.png)

Go to the [Twitch Developers console](https://dev.twitch.tv/console) and register your new application by clicking **Register Your Application**:

![twitch-dev-console-register-your-application](/img/content/twitch-dev-console-register-your-application.png)

Define application name as `tf2pickup.fi` with OAuth Redirect URLs as `https://api.tf2pickup.fi/twitch/auth/return`. Choose any category - the best one for that purpose would be `Website Integration`. After defining that verify that you are not a bot and save.

Then, you will see the application list. Find `tf2pickup.fi` and select **Manage**. You will be able to see the **Client ID**, the value used in `TWITCH_CLIENT_ID` variable. The Client Secret will be hidden, press New Secret and confirm it in the popup. The Client Secret will show up like on the screenshot below:

![twitch-dev-console-tf2pickup.fi-api-settings](/img/content/twitch-dev-console-tf2pickup.fi-api-settings.png)

Pass this secret value to the `TWITCH_CLIENT_SECRET` variable.

### Mumble server setup

The _tf2pickup.org_ server comes with an integrated bot that manages channels on your Mumble server. It creates a dedicated channel for every game and cleans them up when they are left empty for some time.

In order for the bot to work, you need to give him proper rights to do create, edit and remove channels. The way to do that on Mumble servers is via so-called ACLs (Access Control Lists).

First, set up your Mumble server connection details [using the admin panel](final-touches#set-up-voice-chat-settings).
After you save the settings, the bot will login and join the selected channel.

![mumble-bot-joins-server](/img/content/mumble-bot-joins-server.png)

To grant him proper privileges, first you need to register the bot. Having done that, edit channel, then select tab named _ACL_, click _Add_ and type bot's username in the lower field.
Next make sure both _Applies to sub-channels_ and _Applies to this channel_ checkboxes are selected and on the right-hand side of the window click _Allow_ checkbox next to the _Write ACL_ label.
The channel edit window should look like this:

![mumble-edit-channel-window](/img/content/mumble-channel-edit-window.png)

Press _OK_ to save the changes. The bot is supposed to create channels automatically when a game starts on the website. It will create BLU/RED subchannels in it as well. At the end of the game it will link BLU and RED channels, so both teams can communicate. The bot removes leftover channels after a game ends, provided they are empty of users.

## `gameserver_1.env`

```env
# TF2 Game server Configuration

PORT=27015
CLIENT_PORT=27016
STEAM_PORT=27018
STV_PORT=27020

RCON_PASSWORD=funny_rcon_password
SERVER_HOSTNAME="tf2pickup.fi #1"
SERVER_PASSWORD=some_random_password
STV_NAME=tf2pickup.fi TV
STV_TITLE=tf2pickup.fi Source TV

# Website API address, must match API_URL from .env file
# Can be set in a server.cfg manually by a variable sm_tf2pickuporg_api_address
TF2PICKUPORG_API_ADDRESS=https://api.tf2pickup.fi

# Secret value used in order to connect to the API, must match GAME_SERVER_SECRET from .env file
# Can be set in a server.cfg manually by a variable sm_tf2pickuporg_secret
TF2PICKUPORG_SECRET=yoursuperfunnygameserversecret

# Optional variable, sets server priority for the server, the default value is 1
# higher value = higher priority
# Can be set in a server.cfg manually by a variable sm_tf2pickuporg_priority
TF2PICKUPORG_PRIORITY=1

# Optional variable, used when the tf2pickup.org server is behind a proxy
# the value is an IP address of the game server, for example 177.54.144.126
# Can be set in a server.cfg manually by a variable sm_tf2pickuporg_override_internal_address
TF2PICKUPORG_OVERRIDE_INTERNAL_ADDRESS=

# Optional variable, used when the tf2pickup.org server has more than one WAN connection which could
# potentially lead to showing a different public IP address of the server than the one all players connect to.
# Can be set in a server.cfg manually by a variable sm_tf2pickuporg_override_public_address
TF2PICKUPORG_OVERRIDE_PUBLIC_ADDRESS=

# Get your demos.tf API key from https://demos.tf/upload
DEMOS_TF_APIKEY=XDXDXDXDXDXDXDXDXDXDXD..XD.XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD
```

## `gameserver_2.env`

```env
# TF2 Gameserver Configuration

PORT=27025
CLIENT_PORT=27026
STEAM_PORT=27028
STV_PORT=27030

RCON_PASSWORD=funny_rcon_password
SERVER_HOSTNAME="tf2pickup.fi #2"
SERVER_PASSWORD=some_random_password
STV_NAME=tf2pickup.fi TV
STV_TITLE=tf2pickup.fi Source TV

# Website API address, must match API_URL from .env file
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_api_address
TF2PICKUPORG_API_ADDRESS=https://api.tf2pickup.fi

# Secret value used in order to connect to the API, must match GAME_SERVER_SECRET from .env file
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_secret
TF2PICKUPORG_SECRET=yoursuperfunnygameserversecret

# Optional variable, sets server priority for the server, the default value is 1
# higher value = higher priority
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_priority
TF2PICKUPORG_PRIORITY=1

# Optional variable, used when the tf2pickup.org server is behind a proxy
# the value is an IP address of the game server, for example 177.54.144.126
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_override_internal_address
TF2PICKUPORG_OVERRIDE_INTERNAL_ADDRESS=

# Get your demos.tf API key from https://demos.tf/upload
DEMOS_TF_APIKEY=XDXDXDXDXDXDXDXDXDXDXD..XD.XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD
```

## `gameserver_3.env`

```env
# TF2 Gameserver Configuration

PORT=27035
CLIENT_PORT=27036
STEAM_PORT=27038
STV_PORT=27040

RCON_PASSWORD=funny_rcon_password
SERVER_HOSTNAME="tf2pickup.fi #3"
SERVER_PASSWORD=some_random_password
STV_NAME=tf2pickup.fi TV
STV_TITLE=tf2pickup.fi Source TV

# Website API address, must match API_URL from .env file
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_api_address
TF2PICKUPORG_API_ADDRESS=https://api.tf2pickup.fi

# Secret value used in order to connect to the API, must match GAME_SERVER_SECRET from .env file
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_secret
TF2PICKUPORG_SECRET=yoursuperfunnygameserversecret

# Optional variable, sets server priority for the server, the default value is 1
# higher value = higher priority
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_priority
TF2PICKUPORG_PRIORITY=1

# Optional variable, used when the tf2pickup.org server is behind a proxy
# the value is an IP address of the game server, for example 177.54.144.126
# can be set in a server.cfg manually by a variable sm_tf2pickuporg_override_internal_address
TF2PICKUPORG_OVERRIDE_INTERNAL_ADDRESS=

# Get your demos.tf API key from https://demos.tf/upload
DEMOS_TF_APIKEY=XDXDXDXDXDXDXDXDXDXDXD..XD.XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD
```

## `docker-compose.yml` for all in one setup (website + gameservers + mumble)

If you don't want to use Mumble, feel free to remove the 'mumble-server' part of the file.

:::caution
Examples below use **[rapidfort/mongodb](https://hub.docker.com/r/rapidfort/mongodb)** and **[rapidfort/redis](https://hub.docker.com/r/rapidfort/redis)** images, which are hardened non-root images.  
Using them is optional - you are also fine with the official images for these containers, however environment variables are named differently.
:::

```docker
version: '3.8'

services:
  backend:
    depends_on:
      - mongodb
      - redis
    image: ghcr.io/tf2pickup-org/server:stable
    restart: always
    ports:
    - '3000:3000'
    - '9871:9871/udp'
    volumes:
    - './.env:/tf2pickup.pl/.env'

  frontend:
    image: ghcr.io/tf2pickup-org/tf2pickup.fi:stable
    restart: always
    ports:
     - '4000:80'

  mumble-server:
    image: mumblevoip/mumble-server:latest
    ports:
      - '64738:64738/tcp'
      - '64738:64738/udp'
    restart: always
    volumes:
      - mumble-data:/data
      - /etc/localtime:/etc/localtime:ro
      - /etc/letsencrypt/live/tf2pickup.fi:/cert/live/tf2pickup.fi:ro
      - /etc/letsencrypt/archive/tf2pickup.fi:/cert/archive/tf2pickup.fi:ro
      - ./welcome_text.txt:/welcome_text.txt:ro
    environment:
      - MUMBLE_SUPERUSER_PASSWORD=${MUMBLE_SUPERUSER_PASSWORD}
      - MUMBLE_CONFIG_USERNAME=${MUMBLE_CONFIG_USERNAME}
      - MUMBLE_CONFIG_CHANNELNAME=${MUMBLE_CONFIG_CHANNELNAME}
      - MUMBLE_CONFIG_REGISTER_HOSTNAME=${MUMBLE_CONFIG_REGISTER_HOSTNAME}
      - MUMBLE_CONFIG_REGISTER_NAME=${MUMBLE_CONFIG_REGISTER_NAME}
#      - MUMBLE_CONFIG_WELCOMETEXT=${MUMBLE_CONFIG_WELCOMETEXT}
      - MUMBLE_CONFIG_WELCOMETEXTFILE=${MUMBLE_CONFIG_WELCOMETEXTFILE}
      - MUMBLE_CONFIG_SSL_CERT=${MUMBLE_CONFIG_SSL_CERT}
      - MUMBLE_CONFIG_SSL_KEY=${MUMBLE_CONFIG_SSL_KEY}
      - MUMBLE_CONFIG_SSLDHPARAMS=${MUMBLE_CONFIG_SSLDHPARAMS}
      - MUMBLE_CONFIG_OPUSTHRESHOLD=${MUMBLE_CONFIG_OPUSTHRESHOLD}
      - MUMBLE_CONFIG_BANDWIDTH=${MUMBLE_CONFIG_BANDWIDTH}
      - MUMBLE_CONFIG_USERS=${MUMBLE_CONFIG_USERS}
      - MUMBLE_CONFIG_PORT=${MUMBLE_CONFIG_PORT}
      - MUMBLE_CONFIG_TEXTMESSAGELENGTH=${MUMBLE_CONFIG_TEXTMESSAGELENGTH}
      - MUMBLE_CONFIG_IMAGEMESSAGELENGTH=${MUMBLE_CONFIG_IMAGEMESSAGELENGTH}
    env_file:
      - ./.env

  mongodb:
    image: rapidfort/mongodb:4.4
    # you can set the tag to the 'latest', '5.0' or '6.0', however it requires your host CPU to have AVX instructions available
    # which is not a case for all hostings, for example Hetzner's VPS support it but Netcup.de's VPS not
    restart: always
    volumes:
    - database-data:/bitnami/mongodb
    environment:
      - MONGODB_ROOT_USER=${MONGODB_ROOT_USER}
      - MONGODB_ROOT_PASSWORD=${MONGODB_ROOT_PASSWORD}
      - MONGODB_DATABASE=${MONGODB_DATABASE}
      - MONGODB_USERNAME=${MONGODB_USERNAME}
      - MONGODB_PASSWORD=${MONGODB_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-mongo

  redis:
    image: rapidfort/redis:7.0
    restart: always
    volumes:
      - redis-data:/bitnami/redis/data
      - ./redis.conf:/opt/bitnami/redis/etc/redis.conf
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-redis

  gameserver1:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
     - ./maps:/home/tf2/server/tf/maps:rw
     - ./sourcetv1:/home/tf2/server/tf/demos
     - ./smlogs1:/home/tf2/server/tf/addons/sourcemod/logs
     - ./logs1:/home/tf2/server/tf2/logs
    env_file:
     - ./gameserver_1.env

  gameserver2:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
     - ./maps:/home/tf2/server/tf/maps:rw
     - ./sourcetv2:/home/tf2/server/tf/demos
     - ./smlogs2:/home/tf2/server/tf/addons/sourcemod/logs
     - ./logs2:/home/tf2/server/tf2/logs
    env_file:
     - ./gameserver_2.env

  gameserver3:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
     - ./maps:/home/tf2/server/tf/maps:rw
     - ./sourcetv3:/home/tf2/server/tf/demos
     - ./smlogs3:/home/tf2/server/tf/addons/sourcemod/logs
     - ./logs3:/home/tf2/server/tf2/logs
    env_file:
     - ./gameserver_3.env

volumes:
  database-data:
  redis-data:
  mumble-data:
```

## `docker-compose.yml` for the website only

```docker
version: '3.8'

services:
  backend:
    depends_on:
      - mongodb
      - redis
    image: ghcr.io/tf2pickup-org/server:stable
    restart: always
    ports:
    - '3000:3000'
    - '9871:9871/udp'
    volumes:
    - './.env:/tf2pickup.pl/.env'

  frontend:
    image: ghcr.io/tf2pickup-org/tf2pickup.fi:stable
    restart: always
    ports:
     - '4000:80'

  mongodb:
    image: rapidfort/mongodb:4.4
    # you can set the tag to the 'latest', '5.0' or '6.0', however it requires your host CPU to have AVX instructions available
    # which is not a case for all hostings, for example Hetzner's VPS support it but Netcup.de's VPS not
    restart: always
    volumes:
    - database-data:/bitnami/mongodb
    environment:
      - MONGODB_ROOT_USER=${MONGODB_ROOT_USER}
      - MONGODB_ROOT_PASSWORD=${MONGODB_ROOT_PASSWORD}
      - MONGODB_DATABASE=${MONGODB_DATABASE}
      - MONGODB_USERNAME=${MONGODB_USERNAME}
      - MONGODB_PASSWORD=${MONGODB_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-mongo

  redis:
    image: rapidfort/redis:7.0
    restart: always
    volumes:
      - redis-data:/bitnami/redis/data
      - ./redis.conf:/opt/bitnami/redis/etc/redis.conf
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-redis

volumes:
  database-data:
  redis-data:
```

## `docker-compose.yml` for gameservers only

Feel free to remove reduntant gameservers from the file if there are more than you actually need.

```docker
version: '3.8'

services:
  gameserver1:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
    - ./maps:/home/tf2/server/tf/maps:rw
    - ./sourcetv1:/home/tf2/server/tf/demos
    - ./smlogs1:/home/tf2/server/tf/addons/sourcemod/logs
    - ./logs1:/home/tf2/server/tf2/logs
    env_file:
    - ./gameserver_1.env

  gameserver2:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
    - ./maps:/home/tf2/server/tf/maps:rw
    - ./sourcetv2:/home/tf2/server/tf/demos
    - ./smlogs2:/home/tf2/server/tf/addons/sourcemod/logs
    - ./logs2:/home/tf2/server/tf2/logs
    env_file:
    - ./gameserver_2.env

  gameserver3:
    image: ghcr.io/tf2pickup-org/tf2-gameserver:latest
    network_mode: host
    restart: always
    volumes:
    - ./maps:/home/tf2/server/tf/maps:rw
    - ./sourcetv3:/home/tf2/server/tf/demos
    - ./smlogs3:/home/tf2/server/tf/addons/sourcemod/logs
    - ./logs3:/home/tf2/server/tf2/logs
    env_file:
    - ./gameserver_3.env
```

## Redis configuration file `redis.conf`

```conf
bind 0.0.0.0 ::
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/bitnami/redis/tmp/redis.pid
loglevel notice
logfile ""
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
save 1 60
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir /bitnami/redis/data
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync yes
repl-diskless-sync-delay 5
repl-diskless-sync-max-replicas 0
repl-diskless-load disabled
replica-priority 100
acllog-max-len 128
requirepass yoursuperfunnyredispassword
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly yes
appendfilename "appendonly.aof"
appenddirname "appendonlydir"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
aof-timestamp-enabled no
latency-monitor-threshold 0
hash-max-listpack-entries 512
hash-max-listpack-value 64
list-max-listpack-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-listpack-entries 128
zset-max-listpack-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
```

## Giving `tf2pickup` user access to Docker commands

:::caution
This step is optional. By default, the only user allowed to utilize Docker commands is `root`.
:::
This one is simple, all you have to do is to add `tf2pickup` user to the group called `docker`:

```sh
# gpasswd -a tf2pickup docker
```

## First site start

Since [RapidFort](https://hub.docker.com/u/rapidfort) images are based on [Bitnami](https://hub.docker.com/u/bitnami) images, they do not use root user (UID 0) in order to control the service within the container. These services are supposed to run as a user with UID 1001 (you can overwrite the ID in `docker-compose.yml`), so in order to let service work you must set a right permissions for their respective data folders and `redis.conf` configuration file.

When you have all the configuration files mentioned above ready to go, change `docker-compose.yml` in the following way:

```docker
  mongodb:
    command: sleep infinity
    image: rapidfort/mongodb:4.4
    restart: always
    volumes:
    - database-data:/bitnami/mongodb
    environment:
      - MONGODB_ROOT_USER=${MONGODB_ROOT_USER}
      - MONGODB_ROOT_PASSWORD=${MONGODB_ROOT_PASSWORD}
      - MONGODB_DATABASE=${MONGODB_DATABASE}
      - MONGODB_USERNAME=${MONGODB_USERNAME}
      - MONGODB_PASSWORD=${MONGODB_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-mongo

  redis:
    command: sleep infinity
    image: rapidfort/redis:7.0
    restart: always
    volumes:
      - redis-data:/bitnami/redis/data
      - ./redis.conf:/opt/bitnami/redis/etc/redis.conf
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    env_file:
      - ./.env
    hostname: tf2pickup-fi-redis
```

The difference is within a parameter `command`. After that, start them two with `docker compose up -d mongodb redis`. Then change the permissions:

```sh
docker exec -i -u 0 tf2pickup-fi_mongo_1 chown -R 1001:1001 /bitnami/mongodb
docker exec -i -u 0 tf2pickup-fi_client_1 chown -R 1001:1001 /bitnami/redis/data
```

Then, set 1001:1001 permissions for `redis.conf` file:

```sh
sudo chown 1001:1001 redis.conf
```

When permissions are set, remove the `command` parameter lines from `docker-compose.yml` and and run `docker compose up -d` in order to start the entire stack. Each time you would like to stop the application stack, you are supposed to execute command `docker compose stop` and `docker compose start -d` when you start the stack. Containers have a `restart always` policy meaning the containers will always restart on fail, so it will also always start on a system boot as long as `docker.service` service is also starting on system boot.
