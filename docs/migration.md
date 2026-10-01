---
title: Migration
---

:::tip

Before doing any migration **back up your database** in case the whole process goes south.

:::

## Version 5

Version 5 lets one instance run several queues, e.g. 6v6 and 9v9 side by side. Each queue lives at `/q/<name>` and admins manage them in the **Admin panel → Queues** section.

### Queues

On the first start, version 5 migrates your database:

- `QUEUE_CONFIG` becomes your instance's only enabled queue, e.g. `auto-6v6`. It takes over your map pool and the queue settings from the admin panel.
- All your past games, player skills and stats are tagged with that gamemode.

The other queues are created too, but disabled. Double-check `QUEUE_CONFIG` before you upgrade: it defaults to `6v6`, so a 9v9 instance that never set it would be tagged as 6v6. After the first start it isn't used anymore.

### Merging two instances

With multiple queues, one instance can host several gamemodes. If you run two instances today (for example `tf2pickup.eu` for 6v6 and `hl.tf2pickup.eu` for 9v9), you can merge one into the other with a script that ships in the Docker image.

The instance you keep is the **primary** one. The one you fold into it is the **incoming** one.

#### What gets merged

- **Queues** are matched by name (`auto-9v9`, `auto-6v6`, …). The incoming instance's queue, with its settings and map pool, is enabled on the primary.
- **Games** keep the primary's numbering: the incoming games are renumbered to continue after the primary's last game. Old game links keep working (see [Keep old game links working](#keep-old-game-links-working)).
- **Players** are matched by their Steam ID. Their skill, ELO and game counts from both instances are kept per gamemode, and so are their bans, chat mutes and history.
- **Game logs, logs.tf links, player actions, chat and the activity log** come along too.
- **Admin panel settings**: only the incoming instance's default player skill and whitelist carry over, as its gamemode's settings. Everything else is the primary's.

What does **not** come over:

- **Roles.** A player known only to the incoming instance arrives without roles. A player on both keeps their primary roles. Re-grant admin roles to the incoming instance's staff after the merge.
- **Game servers**, Discord, Twitch, rules, privacy policy and other admin panel settings of the incoming instance. Set up anything you still need on the primary.

#### Before you start

- **Rehearse first.** Restore both backups into a spare MongoDB and run the whole procedure there, including `--dry-run`, before you touch production.
- Plan for **downtime** on both instances.
- **Back up both databases.**

#### 1. Upgrade both instances to the same version

The script refuses to run unless both databases are on the same version. Upgrade both instances to the same 5.x release, start each one once so it migrates its database, and then stop them:

```sh
docker compose pull tf2pickup
docker compose up -d tf2pickup
# wait until the site is up, then:
docker compose stop tf2pickup
```

:::caution

The first start on version 5 turns `QUEUE_CONFIG` into that instance's queue and tags all its past games with that gamemode. Make sure `QUEUE_CONFIG` is set correctly on **each** instance (e.g. `6v6` on the primary, `9v9` on the incoming one) before this step.

:::

Both instances must also have **no game in progress**. The script checks this and refuses to run otherwise.

#### 2. Copy the incoming database next to the primary

The script needs to reach both databases. The simplest way is to restore the incoming database into the primary's MongoDB under a different name:

```sh
# on the incoming instance's host
docker compose exec -T mongo mongodump --uri="$INCOMING_MONGODB_URI" --archive --gzip > incoming.dump.gz

# on the primary instance's host
docker compose exec -T mongo mongorestore --uri="$PRIMARY_MONGODB_SERVER_URI" --archive --gzip \
  --nsFrom='tf2pickup.*' --nsTo='tf2pickup-hl.*' < incoming.dump.gz
```

Replace `tf2pickup` with the database name from the incoming instance's `MONGODB_URI`. `$PRIMARY_MONGODB_SERVER_URI` is the primary's `MONGODB_URI` without the database name.

#### 3. Do a dry run

Run the script from the primary's image, pointing it at both databases and at the incoming instance's domain. `--dry-run` only reports what it would do:

```sh
docker compose run --rm \
  -e MERGE_PRIMARY_URI='mongodb://tf2pickup:password@mongo/tf2pickup' \
  -e MERGE_INCOMING_URI='mongodb://tf2pickup:password@mongo/tf2pickup-hl?authSource=tf2pickup' \
  -e MERGE_SOURCE_HOST=hl.tf2pickup.eu \
  tf2pickup node dist/src/merge-instances/run.js --dry-run
```

| Variable | Description |
|----------|-------------|
| `MERGE_PRIMARY_URI` | MongoDB URI of the primary instance's database (usually its `MONGODB_URI`). |
| `MERGE_INCOMING_URI` | MongoDB URI of the incoming instance's database. |
| `MERGE_SOURCE_HOST` | The incoming instance's domain, without `https://`. Old game links are redirected by it. |

The MongoDB user in these URIs needs access to both databases.

The output looks like this:

```
[merge] (dry run) queue auto-9v9: takes the incoming settings and maps, and gets enabled
[merge] (dry run) games: 5034 + 2815, the incoming ones renumbered from 5035
[merge] (dry run) games.roundprogress: 0 incoming
[merge] (dry run) games.substituterequests: 0 incoming
[merge] (dry run) games.deferredkicks: 0 incoming
[merge] (dry run) logstf.logs: 2660 incoming
[merge] (dry run) activitylog: 3005 incoming
[merge] (dry run) players: 529 merged, 710 added
[merge] (dry run) configuration: games.default_player_skill, games.gamemode_whitelist_ids
[merge] (dry run) no changes made
```

Check that the queues, game numbers and player counts are what you expect.

#### 4. Merge

Run the same command without `--dry-run`. It should end with `[merge] done`. On a real-world pair of instances (~7,800 games, ~2,200 players) it takes well under a minute.

The script can only merge a given domain once. Running it again with the same `MERGE_SOURCE_HOST` is refused, so if something goes wrong, restore the primary from its backup and start over.

#### 5. Start the primary

```sh
docker compose up -d tf2pickup
```

Both queues should now appear at the top of the queue page. Then:

- re-grant admin roles to the incoming instance's staff,
- add the incoming instance's game servers, if you still want to use them,
- once you're done, drop the `tf2pickup-hl` database from the primary's MongoDB and shut the incoming instance down.

#### Keep old game links working

Links to the incoming instance's games, like `https://hl.tf2pickup.eu/games/42`, keep working in two ways:

- **Keep the old domain.** Point it at the primary: add it to the primary's `server_name` in your [reverse proxy](#reverse-proxy) and keep its certificate. `https://hl.tf2pickup.eu/games/42` then redirects to the game's new number.
- **Retire the old domain.** `https://tf2pickup.eu/games/42?i=hl.tf2pickup.eu` redirects to the game's new number. Use it to rewrite old links, e.g. from your Discord.

## Version 4

Version 4 is a complete rewrite of tf2pickup.org. The previously separate [client](https://github.com/tf2pickup-org/client) and [server](https://github.com/tf2pickup-org/server) repositories have been merged into a single [monolith](https://github.com/tf2pickup-org/tf2pickup). This simplifies deployment significantly — there is now only one Docker image and one application port.

### New Docker image

The separate frontend and backend containers are replaced by a single image:

```
ghcr.io/tf2pickup-org/tf2pickup:latest
```

The application serves both the UI and the API on **port 3000**. Remove the old `frontend` and `backend` containers from your `docker-compose.yml` and replace them with a single service:

```yaml
services:
  tf2pickup:
    image: ghcr.io/tf2pickup-org/tf2pickup:latest
    restart: always
    env_file: .env
    ports:
      - '3000:3000'    # HTTP
      - '9871:9871/udp' # Log relay
    depends_on:
      - mongo
```

### Redis is no longer needed

Version 4 does not use Redis. You can remove the Redis container from your `docker-compose.yml` and delete `REDIS_PASSWORD` and `REDIS_URL` from your `.env` file.

### Environment variables

Several environment variables have changed:

#### Removed

| Variable | Notes |
|----------|-------|
| `API_URL` | Replaced by `WEBSITE_URL` |
| `CLIENT_URL` | Replaced by `WEBSITE_URL` |
| `BOT_NAME` | No longer needed |
| `REDIS_PASSWORD` | Redis is no longer used |
| `REDIS_URL` | Redis is no longer used |

#### New

| Variable | Description |
|----------|-------------|
| `WEBSITE_URL` | Full URL where the instance is accessed (e.g. `https://tf2pickup.eu`). Replaces both `API_URL` and `CLIENT_URL`. |
| `WEBSITE_BRANDING` | _(optional)_ Name of the branding profile to use for logos and favicons. See [custom branding](custom-branding) for details. |
| `NODE_ENV` | Set to `production` for production deployments. |
| `LOG_LEVEL` | Logging level. Possible values: `fatal`, `error`, `warn`, `info`, `debug`, `trace`. Defaults to `info`. |
| `THUMBNAIL_SERVICE_URL` | Map thumbnail service URL. Defaults to `https://mapthumbnails.tf2pickup.org`. |
| `UMAMI_SCRIPT_SRC` | _(optional)_ Umami analytics script URL. |
| `UMAMI_WEBSITE_ID` | _(optional)_ Umami analytics website ID. |

#### Changed

| Variable | What changed |
|----------|-------------|
| `LOG_RELAY_ADDRESS` | Was the API hostname (e.g. `api.tf2pickup.eu`). Now should be set to your public hostname and port (e.g. `tf2pickup.eu:3000`). |

#### Unchanged

These variables work the same as before: `TZ`, `WEBSITE_NAME`, `MONGODB_URI`, `STEAM_API_KEY`, `LOGS_TF_API_KEY`, `KEY_STORE_PASSPHRASE`, `SUPER_USER`, `GAME_SERVER_SECRET`, `LOG_RELAY_PORT`, `DISCORD_BOT_TOKEN`, `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `SERVEME_TF_API_ENDPOINT`, `SERVEME_TF_API_KEY`.

### Reverse proxy

Since the application now serves everything on a single port, you no longer need a separate `api.` subdomain. Update your Nginx configuration to proxy all traffic to port 3000:

```nginx
server {
    listen 443 ssl;
    server_name tf2pickup.eu;

    ssl_certificate /etc/letsencrypt/live/tf2pickup.eu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tf2pickup.eu/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

You can remove the old `api.tf2pickup.eu` server block and DNS record.

### Database migration

Version 4 runs database migrations automatically on startup using [umzug](https://github.com/sequelize/umzug). No manual migration steps are needed — just start the new container and it will migrate your data.

### Twitch OAuth redirect URL

If you use Twitch integration, update the OAuth redirect URL in the [Twitch Developer Console](https://dev.twitch.tv/console) from:

```
https://api.tf2pickup.eu/twitch/auth/return
```

to:

```
https://tf2pickup.eu/twitch/auth/return
```

### Game server connector

If your game servers use the [connector](https://github.com/tf2pickup-org/connector) plugin, update the `sm_tf2pickuporg_api_address` cvar to point to your new single-domain URL instead of the old `api.` subdomain. For example:

```
sm_tf2pickuporg_api_address "https://tf2pickup.eu"
```

### Discord invite link

The Discord invite link is no longer part of the website branding. After upgrading, go to the **Admin panel → Miscellaneous** section and fill in your Discord invite link there.

---

## Version 10

:::info
The sections below describe migrating from older v3 versions (v9 → v10). If you are already on version 4, you can skip this entire section.
:::

### Website name

We introduced a new environment variable, `WEBSITE_NAME`. It identifies your _tf2pickup.org_ instance uniquely; for now, it will be used by the new [logs.tf](https://logs.tf/) uploader, but more use-cases are surely coming.

```env
WEBSITE_NAME=tf2pickup.eu
```

We also added support for expansion of environment variables, so now you can re-use your `WEBSITE_NAME`, for example:

```env
BOT_NAME=${WEBSITE_NAME}
```

### Redis

The new version requires a [Redis](https://redis.io/) database; it is used to cache some data and store game logs. Follow [site components deployment](site-components-deployment#docker-composeyml-for-the-website-only) documentation to learn how to set it up.

```env
REDIS_URL=redis://tf2pickup-eu-redis:6379
```

### logs.tf

Version 10 comes with an integrated [logs.tf](https://logs.tf/) uploader that captures in-game logs and uploads them when a match ends. It also lets you
access game server logs directly via the webpage.

For the integration to work, you need to grab your API key [here](https://logs.tf/uploader) and put it in your .env file:

```env
LOGS_TF_API_KEY=your_logs_tf_api_key
```

Uploading logs via the backend means that you need to disable log upload on your gameservers; otherwise all the logs are going to be doubled.
To disable uploading logs to logs.tf on your gameservers empty the `LOGS_TF_APIKEY` env variable:

```env
# gameserver.env
LOGS_TF_APIKEY=
```

### KEY_STORE_PASSPHRASE typo

In older versions of the tf2pickup.org project there was a typo in the environment file that we have fixed in version 9. However, the typo was still allowed alongside the correct variable name. We got rid of the typo in version 10, so make sure you take care of it in your .env file.

```env
# Old variable name, wrong
# KEY_STORE_PASSPHARE=

# New variable name, typo fixed
KEY_STORE_PASSPHRASE=
```

### Review privacy policy

To be compliant with the [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) we added a new document - privacy policy. It is stored on the server and can be edited via your admin panel. It is short and contains only necessary information, so please take a look at it and **update the link to your website**, as it defaults to [tf2pickup.pl](https://tf2pickup.pl/).

![edit-privacy-policy](/img/content/final-touches/edit-privacy-policy.png)
