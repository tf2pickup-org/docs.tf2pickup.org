---
title: Server API
---

### Authentication

The authentication is implemented via cookies. In order to obtain a valid cookie, one must simply copy the `auth_token` one from the browser's console and use to for desired API calls.

![cookie](/img/content/server-api/cookie.png)

For example, in order to update a given player's skill, one can execute the following command:

```bash
$ curl -b "auth_token=<redacted>" -X PUT -H "Content-Type: application/json" -d '{"scout":4,"soldier":6,"demoman":3,"medic":2}' https://api.tf2pickup.eu/players/76561199195756652/skill
{"scout":4,"soldier":6,"demoman":3,"medic":2}
```
