---
title: Troubleshooting
---

Here you can find how to resolve potential technical problems when setting up your own tf2pickup.org instance.

## Mumble bot is not connecting to the server

That is mostly because of two reasons:

### Firewall blocks connections between the application and mumble

Check firewall rules if they let your application container make a connection in the same way as clients are supposed to. In general for mumble you should create rule in the INPUT chain letting services connect to it (both TCP/UDP traffic), as well as a rule letting your firewall forward traffic to it (TCP/UDP as well).

### Mumble server uses old version of the TLS and/or self-signed certificates

Indication of this problem should look like this in the logs:

```logs
[Nest] 1  - 07/20/2022, 10:36:29 PM     LOG [ServemeTfService] serveme.tf integration enabled
(node:1) [MONGODB DRIVER] DeprecationWarning: Db.collection option [strict] is deprecated and will be removed in a later version.
(Use `node --trace-deprecation ...` to show where the warning was created)
[Nest] 1  - 07/20/2022, 10:36:29 PM   ERROR [MumbleBotService] cannot connect to mumble-de.cleanvoice.com:38716: Error: 139897964370768:error:1425F102:SSL routines:ssl_choose_client_version:unsupported protocol:../deps/openssl/openssl/ssl/statem/statem_lib.c:1993:
```

This problem is a bit more tricky, because it may happen even if you have your firewall set and all data set properly in the Voice chat configuration. It happens when you use free servers from `mumble-de.cleanvoice.com` or `mumble-de.cleanvoice.ru` and it's because these servers use TLS 1.0/1.1 encryption instead of TLS 1.2/1.3 (safest ones at the time of writing, TLS 1.0 is unsafe and TLS 1.1 is deprecated).
In that case you should add the following command to the `tf2pickup` service in your website's `docker-compose.yml`:

```docker-compose
services:
  tf2pickup:
    depends_on:
      - mongodb
    image: ghcr.io/tf2pickup-org/tf2pickup:latest
    restart: always
    ports:
     - '3000:3000'
     - '9871:9871/udp'
    env_file:
    - ./.env
    command: ["node", "--tls-min-v1.0", "dist/src/main"]
```

The last line enables usage for older versions of the TLS protocol like 1.0 and 1.1.

## Logs are not being sent to logs.tf

This problem can happen for reasons beyond our control like logs.tf service failure or it having a very high load at the moment, however from the setup side problems can be the following:

- invalid firewall configuration not letting the application connect to logs.tf
- API key is invalid, outdated or not present

The second option is more likely a problem. If there is no logs.tf API key set in the .env configuration, it will throw an error in the container log like this one:

```dockerlog
[Nest] 1  - 01/07/2023, 8:46:19 PM     LOG [GameEventHandlerService] game #71 ended
[Nest] 1  - 01/07/2023, 8:46:19 PM     LOG [LogCollectorService] uploading logs for game #71...
[Nest] 1  - 01/07/2023, 8:46:20 PM   ERROR [LogCollectorService] uploading logs for game #71 failed: Error: logs.tf upload error: Invalid API key
```

Add lines the following lines to your `.env` file with proper values:

```env
WEBSITE_NAME=tf2pickup.eu
LOGS_TF_API_KEY=your_logs_tf_api_key
```

Afterwards, restart your application container.

## Website works, nobody (even the first existing user) can log in

This means your Steam API key used in the application configuration is invalid, invalidated or expired. It can be indicated by the following entries in the log:

```dockerlog
[Nest] 1  - 12/17/2022, 11:14:37 AM    WARN [AuthController] Login error: 403 Error: Check your API key is correct
[Nest] 1  - 12/17/2022, 6:56:01 PM    WARN [AuthController] Login error: 403 Error: Check your API key is correct
```

To fix this, update `STEAM_API_KEY` property in `.env` file and restart your application container.

## No scheme found in URI

This problem can be seen in the logs as:

```logs
[Nest] 1  - 10/14/2021, 8:45:36 AM   ERROR [ExceptionHandler] No scheme found in URI tf2pickup:yourepicmongodbpassword@tf2pickup-eu-mongo:27017/admin
Error: No scheme found in URI tf2pickup:yourepicmongodbpassword@tf2pickup-eu-mongo:27017/admin
    at MongodbUriParser.parse (/tf2pickup.pl/node_modules/mongodb-uri/mongodb-uri.js:46:15)
    at MongodbUriParser.formatMongoose (/tf2pickup.pl/node_modules/mongodb-uri/mongodb-uri.js:199:22)
    at InstanceWrapper.useFactory [as metatype] (/tf2pickup.pl/dist/src/app.module.js:52:40)
    at Injector.instantiateClass (/tf2pickup.pl/node_modules/@nestjs/core/injector/injector.js:294:55)
    at callback (/tf2pickup.pl/node_modules/@nestjs/core/injector/injector.js:43:41)
    at async Injector.resolveConstructorParams (/tf2pickup.pl/node_modules/@nestjs/core/injector/injector.js:119:24)
    at async Injector.loadInstance (/tf2pickup.pl/node_modules/@nestjs/core/injector/injector.js:47:9)
    at async Injector.loadProvider (/tf2pickup.pl/node_modules/@nestjs/core/injector/injector.js:69:9)
    at async Promise.all (index 3)
    at async InstanceLoader.createInstancesOfProviders (/tf2pickup.pl/node_modules/@nestjs/core/injector/instance-loader.js:44:9)
    at async /tf2pickup.pl/node_modules/@nestjs/core/injector/instance-loader.js:29:13
    at async Promise.all (index 5)
    at async InstanceLoader.createInstances (/tf2pickup.pl/node_modules/@nestjs/core/injector/instance-loader.js:28:9)
    at async InstanceLoader.createInstancesOfDependencies (/tf2pickup.pl/node_modules/@nestjs/core/injector/instance-loader.js:18:9)
    at async /tf2pickup.pl/node_modules/@nestjs/core/nest-factory.js:93:17
    at async Function.asyncRun (/tf2pickup.pl/node_modules/@nestjs/core/errors/exceptions-zone.js:22:13)
```

This one is quite simple - your `MONGODB_URI` entry does not have a protocol prefix (a.k.a `mongodb://`). Add it in `.env`, so it does not look like this:

```.env
MONGODB_URI=tf2pickup:yourepicmongodbpassword@tf2pickup-eu-mongo:27017/admin
```

but this:

```env
MONGODB_URI=mongodb://tf2pickup:yourepicmongodbpassword@tf2pickup-eu-mongo:27017/admin
```

## User cannot register

This could be because of multiple reasons:

- player's profile and stats are set to private on their Steam profile
- Steam API does not respond to the website properly

```logs
[Nest] 1  - 01/23/2023, 10:40:46 PM    WARN [AuthController] Login error: Error: cannot verify in-game hours for TF2 (steamId: 76561198011558250, error: AxiosError: Request failed with status code 403)
```

- player's profile on ETF2L is banned or blacklisted (if ETF2L profile requirement is enabled)

```logs
[Nest] 1  - 01/22/2023, 12:34:17 AM    WARN [AuthController] Login error: Error: account is banned on ETF2L (steamId: 76561198011558250)
```

- the player has insufficient TF2 in-game hours (time is taken from TF2 stats, not Steam profile stats)

```logs
[Nest] 1  - 01/23/2023, 10:55:23 PM    WARN [AuthController] Login error: Error: insufficient TF2 in-game hours (steamId: 76561198011558250, reported: 294, required: 500)
```

- Steam API does not work (very unusual situation)

```logs
[Nest] 1  - 01/19/2023, 10:16:06 PM    WARN [AuthController] Login error: Failed to verify assertion (message: Invalid signature)
```

or

```logs
[Nest] 1  - 03/03/2023, 1:17:19 AM    WARN [AuthController] Login error: Failed to verify assertion (message: Invalid assertion response from provider)
```

- duplicate player name

```logs
[Nest] 1  - 03/09/2023, 11:32:36 PM    WARN [AuthController] Login error: MongoServerError: E11000 duplicate key error collection: admin.players index: name_1 dup key: { : "supra" }
```

## Database queries

:::warning
Not supported, if you mess up your database and you do not backup your databases, we will not help you.
:::

### Removing a player

:::warning
At the moment of writing, there is no player removal feature within the website. You cannot remove users having any games played.
:::

You can refer to players through `ObjectId` or `steamId` (SteamID64). You can find `ObjectId` easily in the player's profile address, where in `https://tf2pickup.eu/player/64f12b3274b096bba070acb8` `64f12b3274b096bba070acb8` is the value you are looking for. For this profile `76561198011558250` is the right `steamId`.

```query
db.players.deleteOne({ _id: ObjectId("6139fc04d086910013755593") })
db.players.deleteOne({ steamId: "76561198011558250" })
```

In case of dealing with a player having games played, you can edit their data so it does not point to their profile. However, you will not be able to deal with the fact that if you open games of this player, you will be able to find him in the game logs.

```query
db.players.updateOne({ _id: ObjectId("6139fc04d086910013755593") }, { $set: { steamId: '0', name: '_' }})
db.players.updateOne({ steamId: '76561198011558250' }, { $set: { steamId: '0', name: '_' }})
```

### Adding or updating game details

In some unusual cases you might want to update a log/demo link, change map name for a specific game.

#### Updating map name

```query
db.games.updateOne({ number: 231 }, { $set: { map: 'koth_product_final' } })
```

#### Updating logs.tf log link

```query
db.games.updateOne({ number: 237 }, { $set: { logsUrl: 'https://logs.tf/3305099' } })
```

#### Updating demos.tf demo link

```query
db.games.updateOne({ number: 237 }, { $set: { demoUrl: 'https://demos.tf/903543' } })
```

## Switching database name from `admin` to `tf2pickup`

Initially we were suggesting to connect to the `admin` database in MongoDB in order to store site data [which is considered a bad practice](https://stackoverflow.com/questions/76106029/is-using-admin-database-in-mongodb-a-bad-practice-if-i-use-only-one-database-ins). In order to move out the data from the container you must:

- change `MONGODB_URI` at the end of the string from `/admin` to `/tf2pickup` in your `.env` file:

```env
MONGODB_URI=mongodb://tf2pickup:yoursuperfunnypassword@tf2pickup-eu-mongo/tf2pickup
```

- ensure you have a database backup with current data,
- shut down the website by running `docker compose down`,
- remove your data volume if it was not done in the previous step by running `docker volume rm tf2pickup-eu_mongodb_1_database-data` (you can find your volume name by running `docker volume ls`),
- start your stack only with `mongodb` service in order to restore the data from backup by running `docker compose up -d mongodb`,
- assuming your backup name is called `tf2pickup-2023-05-01.dump.gz` and it's in your compose folder, run the following command:

```sh
docker exec -i tf2pickup-eu_mongodb_1 bash -c "mongorestore --drop -vvvvv --nsFrom "admin.*" --nsTo "tf2pickup.*" --archive -u tf2pickup -p yoursuperfunnypassword --authenticationDatabase tf2pickup --nsExclude admin.system.version --nsExclude admin.system.users --gzip" < tf2pickup-2023-05-01.dump.gz
```

After that, you can start the remaining applications by running `docker compose up -d`.
