---
title: Components introduction
---

In order to run a fully fledged tf2pickup.org instance, you are going to set up and configure a couple of components. These components can be served by a docker-compose container stack in Docker. That lets server administrators set up the project quickly, without any need of deep understanding of how certain elements of the site work, such as MongoDB configuration. Site deployment through Docker not only saves a lot of time for having a good understanding of how setup works, but also lets administrators run it in a separated environment, meaning there is no need for having anything very specific installed in your host system (besides Docker, docker-compose and the reverse proxy server).

## The reverse proxy server

This part of the setup is not currently delivered together with the tf2pickup.org container stack. It routes traffic to the application and terminates SSL. This should be delivered together with SSL certificates, regardless if they are paid or free. We described all setup steps [here](/docs/setup-prerequisites).

## The application

The tf2pickup.org application is a single service that handles both the web interface and all backend logic — accessing the database, configuring game servers and much more. Read how to deploy and configure it [here](/docs/site-components-deployment).

## The voice server

Currently, tf2pickup.org supports only [Mumble](https://www.mumble.info/), but there are plans to support Discord voice
channels as well.

## The game server

To launch a game, at least one game server is needed. In order to let the game server work properly with the server, it is expected to have specific extensions/plugins installed:

- [SourceMod 1.11](https://www.sourcemod.net/downloads.php) (the latest stable version)
- [Metamod:Source 1.11](https://www.sourcemm.net/downloads.php?branch=stable) (the latest stable version)
- [tf2pickup.org connector plugin](https://github.com/tf2pickup-org/connector/releases)
- [SteamWorks extension](https://github.com/KyleSanderson/SteamWorks/releases)
- [system2 Extension](https://github.com/dordnung/System2/releases) (tf2pickup.org connector dependency)
- [demos.tf plugin](https://github.com/demostf/plugin)
- [DHooks 2 Extension](https://github.com/peace-maker/DHooks2)
- [tf2-comp-fixes plugin](https://github.com/ldesgoui/tf2-comp-fixes)
- [SrcTV+ Extension](https://github.com/dalegaard/srctvplus) (optional)
- [TF2Stadium SourceMod Plugin](https://github.com/tf2pickup-org/stadium-sm-plugin)
- [Updated Pause Plugin](https://github.com/l-Aad-l/updated-pause-plugin/releases)
- [Supplemental Stats 2](https://github.com/F2/F2s-sourcemod-plugins#supplemental-stats-2-)
- [Medic Stats](https://github.com/F2/F2s-sourcemod-plugins#medic-stats-)
- [RestoreScore](https://github.com/F2/F2s-sourcemod-plugins#restorescore-)
- [LogsTF](https://github.com/F2/F2s-sourcemod-plugins#logstf-) (optional since v10, not recommended)
- [RecordSTV](https://github.com/F2/F2s-sourcemod-plugins#recordstv-)
- [WaitForSTV](https://github.com/F2/F2s-sourcemod-plugins#waitforstv-)
- [FixStvSlot](https://github.com/F2/F2s-sourcemod-plugins#fixstvslot-)
- [Improved Match Timer](https://github.com/dewbsku/Improved-Match-Timer)
- [RGL Server Resources Updater](https://github.com/RGLgg/server-resources-updater/releases)
- [tf2rue](https://github.com/sapphonie/tf2rue)
- [ETF2L.org configs](https://github.com/ETF2L/gameserver-configs)
- [RGL.gg configs](https://github.com/RGLgg/server-resources-updater/tree/master/cfg)
- [StAC-tf2](https://github.com/sapphonie/StAC-tf2)

We provide a [Docker image](https://github.com/tf2pickup-org/tf2-gameserver) that has all the plugins and configuration. [Here](/docs/site-components-deployment) you can find some information how to set them up fast. If you want to use a hosted gameserver, you must install all of these plugins above and disable the following default SourceMod plugins:

- `nextmap.smx`
- `funvotes.smx`
- `reservedslots.smx`

The site deployment can be done in one of two ways:

- Bundled - The application, game and voice server(s) on one host.
- Divided - The application is on one host, while game server(s) are on another. This does not exclude hosting game servers on multiple different hosts.
