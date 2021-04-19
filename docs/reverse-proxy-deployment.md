---
title: Reverse proxy deployment
---

## Introduction

Currently all tf2pickup.org instances use reverse proxy server configuration based on [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) with [Certbot](https://certbot.eff.org/instructions) for obtaining free certificates from [Let's Encrypt](https://letsencrypt.org/). They are hosted on Debian-based distributions (Ubuntu 20.04, Debian 10), but it does not exclude an option for a deployment on any other Linux distribution, or with usage of different reverse proxy like [Apache](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html) or [Caddy](https://caddyserver.com/docs/quick-starts/reverse-proxy) or different tools for obtaining certificates such us [acme.sh](https://github.com/acmesh-official/acme.sh) or even [win-acme](https://www.win-acme.com/). We have confirmed the website to be working on Windows 10 with Docker containers using [Linux Subsystem for Windows (version 2)](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

The following guide should be taken as an example, which is based on:

- Ubuntu 20.04 Linux distribution,
- Cloudflare as a domain API provider for DNS zone dynamic updates,
- Certbot as certificate obtaining tool,
- Nginx as a reverse proxy,
- tf2pickup.org client and server hosted as containers on ports TCP 3000 for the server and TCP 4000 for the client.

Following these instructions should lead to configuration assessed as [A+ in Qualsys SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=tf2pickup.de) and [A+ in Mozilla Observatory](https://observatory.mozilla.org/analyze/tf2pickup.de) tests. Most of the configuration examples given are based on configuration from the [tf2pickup.de](https://tf2pickup.de) website.

## Domain name setup

We encourage you to purchase domains in [OVH](https://www.ovh.com/world/domains/dotdomains.xml) since they provide an API allowing for dynamic DNS zone updates (also, since we have experience with it, we can provide help with it at some point). If a pickup domain was not purchased on OVH nor any [domain registrar for which certbot DNS API plugin was made](https://certbot.eff.org/docs/using.html?highlight=dns#dns-plugins), we encourage you for parking the DNS domain zone in Cloudflare, since they provide their domain zone management services for free and their API is pretty easy to use.

In order to move a domain zone from the current site to Cloudflare, you are supposed to create an account on Cloudflare and add a domain you own. After that, you will be asked to change the nameserver (NS) entries for servers given by the Cloudflare. There are always two entries given and they should replace current entries in the domain zone.

In this specific case there were 4 NS entries and the domain owner had to change them to 2 NS entries, which are `annabel.ns.cloudflare.com` and `bradley.ns.cloudflare.com`:
![DNS nameservers list in OVH settings](/img/content/change-dns-nameservers.png).
Those changes are applied immediately **only on current NS servers** meaning the change is going to be propagated in a time between a few minutes to even 48 hours. After propagation site owner should get an email about it and the change should look like that:
![DNS nameservers list in OVH settings with change applied](/img/content/change-dns-nameservers-with-change-applied.png)
In that way all zone settings should be applicable from Cloudflare like on an image below:
![DNS nameservers list in OVH settings with change applied](/img/content/dns-zone-cloudflare.png)

A pickup domain should contain at least two `A` entries, but this configuration is the most recommended:

| Entry type |        Name        |            Content            | Priority |
|:----------:|:------------------:|:-----------------------------:|:--------:|
|     `A`    |   `tf2pickup.fi`   |       host IPv4 address       |    n/d   |
|   `AAAA`   |   `tf2pickup.fi`   |       host IPv6 address       |    n/d   |
|     `A`    | `api.tf2pickup.fi` |       host IPv4 address       |    n/d   |
|   `AAAA`   | `api.tf2pickup.fi` |       host IPv6 address       |    n/d   |
|    `CAA`   | `api.tf2pickup.fi` | `0 issuewild letsencrypt.org` |    n/d   |

Usage of AAAA entries is optional. If you do not want to handle IPv6 on Docker, feel free to actually not use these. We encourage to use [CAA entry](https://support.dnsimple.com/articles/caa-record/) alongside Let's Encrypt certificates. Since most of the sites host the tf2pickup.org client, server with Mumble and the TF2 gameserver, we suggest not to use DNS proxying since at some point it is meaningless, since it is for hiding the real host IP where we cannot do it for the gameservers as most likely proxying gameserver traffic would notably increase latency between players and the gameserver.

We suggest to change the following settings in Cloudflare:

### SSL/TLS -> Edge Certificates

![always use https](/img/content/cloudflare-always-use-https.png)

Note, we recommend to apply HSTS settings changes **after** the site deployment in order to avoid accessibility issues when certificates are not used on the website yet.

![hsts settings](/img/content/cloudflare-hsts-settings.png)
![hsts settings details](/img/content/cloudflare-hsts-settings-details.png)
![tls and https](/img/content/cloudflare-tls-and-https.png)
![certificate transparency](/img/content/cloudflare-certificate-transparency.png)

### Network

![cloudflare https settings](/img/content/cloudflare-https-settings.png)
![cloudflare network misc 1](/img/content/cloudflare-network-misc-1.png)
![cloudflare network misc 2](/img/content/cloudflare-network-misc-2.png)

## SSL setup with Certbot

We discourage using certbot version from the repository, since their versions are very old. EFF encourages to download a binary manually or to use a certbot snap package, in which we seem the snap package as a better option due to automatic package updates made by the `snapd` service. At the moment of writing this guide the certbot version in the official Ubuntu repository is:

```sh
# certbot --version
certbot 0.40.0
```

while the snap version is:

```sh
# certbot --version
certbot 1.14.0
```

The certificate obtaining process is going to be based on the DNS-01 method with Cloudflare API use.

In order to install the Cerbot with Cloudflare DNS API plugin, you should execute the following commands:

```sh
# apt install snapd
# systemctl enable snapd.service
# snap install core
# snap install certbot --classic
# snap set certbot trust-plugin-with-root=ok
# snap install certbot-dns-cloudflare
```

Before getting certificates, a Cloudflare API token must be prepared for that based on the instructions given in a [certbot-dns-cloudflare guide](https://certbot-dns-cloudflare.readthedocs.io/en/stable/), with usage of the *restricted API token*. The next commands expect the token to be saved in the `/root/.secrets/cloudflare` file with file permissions of `600`.

After that, certificate should be able to be created by using the command (the `--agree-tos` and `-email` parameters must be given on a first certificate):

```sh
certbot certonly --non-interactive -d 'tf2pickup.de' -d '*.tf2pickup.de' --dns-cloudflare --dns-cloudflare-credentials /root/.secrets/cloudflare --rsa-key-size 4096 --must-staple --agree-tos --email your-mailbox@you-are-really-using.com
```

In case of failure most likely you:

- have invalid restricted API key,
- have Global API key with a user account email instead of the restricted API key,
- invalid file syntax,
- invalid token file permissions (not 600),
- do not have a DNS server connection working.

When certificate is obtained, we suggest you to leave these two commands in the root crontab file (opened by a command `crontab -e` as root):

```crontab
0  1   20 * *   certbot certonly --non-interactive -d 'tf2pickup.de' -d '*.tf2pickup.de' --dns-cloudflare --dns-cloudflare-credentials /root/.secrets/cloudflare --rsa-key-size 4096 --must-staple
5  1   20 * *   systemctl restart nginx
```

## Nginx setup

Nginx should be installed by the following command:

```sh
# apt install nginx
```

After the installation, delete all files existing in `/etc/nginx/sites-available` and `/etc/nginx/sites-enabled` and execute the command below in order to generate Diffie-Hellman service file.

```sh
# openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 4096
```

After that, (re)place the following files in their respective locations. Make sure you will change the domain names/SSL certificate folder names in the configuration files:

`/etc/nginx/nginx.conf`:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
events {
        worker_connections 768;
        # multi_accept on;
}

http {

        ##
        # Basic Settings
        ##
        ssl_session_cache shared:ssl_session_cache:10m;
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        server_tokens off;
        server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1.3 TLSv1.2;
        ssl_prefer_server_ciphers off;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_ecdh_curve secp521r1:secp384r1;
        # Logging Settings
        ##
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip off;
        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
        # Security Settings

        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
}
```

``/etc/nginx/nginx/sites-available/tf2pickup.de``:

```nginx
map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
}
server {
        listen 80;
        #listen [::]:80; #IPv6 specific entry
        server_name yu.tf2pickup.de;
        return 302 https://tf2pickup.de$request_uri;
}
server {
        access_log /var/log/nginx/tf2pickup.de-access.log;
        error_log /var/log/nginx/tf2pickup.de-error.log;
        listen 443 ssl http2;
        #listen [::]:443 ssl http2; #IPv6 specific entry
        server_name tf2pickup.de;
        ssl_certificate /etc/letsencrypt/live/tf2pickup.de/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tf2pickup.de/privkey.pem;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_session_cache shared:ssl_session_cache:10m;
        ssl_trusted_certificate /etc/letsencrypt/live/tf2pickup.de/chain.pem;
        location / {
                proxy_pass http://127.0.0.1:4000;
                add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade; # allow websockets
                proxy_set_header Connection $connection_upgrade;
                proxy_set_header X-Forwarded-For $remote_addr; # preserve client IP
                }
}
```

``/etc/nginx/nginx/sites-available/api.tf2pickup.de``:

```nginx
map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
}
server {
        listen 80;
        #listen [::]:80; #IPv6 specific entry
        server_name api.tf2pickup.de;
        return 302 https://api.tf2pickup.de$request_uri;
}
server {
        access_log /var/log/nginx/api.tf2pickup.de-access.log;
        error_log /var/log/nginx/api.tf2pickup.de-error.log;
        listen 443 ssl http2;
        #listen [::]:443 ssl http2; #IPv6 specific entry
        server_name api.tf2pickup.de;
        ssl_certificate /etc/letsencrypt/live/tf2pickup.de/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tf2pickup.de/privkey.pem;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_session_cache shared:ssl_session_cache:10m;
        ssl_trusted_certificate /etc/letsencrypt/live/tf2pickup.pl/chain.pem;
        location / {
                proxy_pass http://127.0.0.1:3000;
                add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade; # allow websockets
                proxy_set_header Connection $connection_upgrade;
                proxy_set_header X-Forwarded-For $remote_addr; # preserve client IP
                }
}
```

After placing those files, make sure to create symlinks to them in the `/etc/nginx/sites-enabled`:

```sh
# ln -s /etc/nginx/sites-available/api.tf2pickup.de /etc/nginx/sites-enabled/api.tf2pickup.de
# ln -s /etc/nginx/sites-available/tf2pickup.de /etc/nginx/sites-enabled/tf2pickup.de
```

When that is done, nginx should use these configs. Execute `nginx -t` in order to check if all configuration files are valid. You should expect the following output:

```sh
# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Otherwise, you should get a list of errors listed with file names and line numbers of the files containing the errors. Fix them and when you manage to get the test to be successful, restart the service by executing `systemctl restart nginx.service` and make sure the Nginx is started after every boot by executing `systemctl enable nginx.service`.

## HSTS Preload

In order to get the highest score in the site configuration tests, HSTS Preload should be configured for the domain. The Nginx configuration files meet the requirements for it and most of the browsers add the domains to their preload list automatically, but this is not the case for Chromium-based browsers, such as Google Chrome. For them, you are supposed to [register the site](https://hstspreload.org). The process is straightforward - you just have to enter the domain name, check boxes approving your domain ownership and accepting the service terms. After doing so, the website will check if your domain is eligible for the submission on the list and if yes, your domain will be added in a matter of a few days.
![hsts preload example](/img/content/hsts-preload.png)
