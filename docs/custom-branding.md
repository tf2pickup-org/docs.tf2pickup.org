---
title: Custom branding
---

tf2pickup.org supports custom branding so that each instance can have its own logo and favicon. Customization is done through a combination of image files and environment variables — no code changes are needed.

## How it works

The application serves static assets from the `public/` directory. When the `WEBSITE_BRANDING` environment variable is set, the application looks for assets in `public/branding/<name>/` first, falling back to the defaults in `public/` if a file is not found there.

## Adding your branding

1. Create a new directory under `public/branding/` named after your instance (e.g. `tf2pickup.fr`).

2. Add the following files to it:

   | File | Description |
   |------|-------------|
   | `logo.png` | Site logo displayed in the navigation bar |
   | `favicon.png` | Favicon in PNG format |
   | `favicon.ico` | Favicon in ICO format |

3. Submit a pull request to the [tf2pickup repository](https://github.com/tf2pickup-org/tf2pickup) with your new branding directory.

For an example, see [this commit](https://github.com/tf2pickup-org/tf2pickup/commit/c29ac2e) that adds branding for a new instance.

## Enabling your branding

Set the following environment variables in your `.env` file:

```env
# The display name of your instance
WEBSITE_NAME=tf2pickup.fr

# The name of the branding directory under public/branding/
WEBSITE_BRANDING=tf2pickup.fr
```

`WEBSITE_NAME` controls the site name shown in page titles, logs.tf uploads, Discord notifications, and other text references. `WEBSITE_BRANDING` controls which logo and favicon files are served.

If `WEBSITE_BRANDING` is not set, the default tf2pickup.org branding is used.
