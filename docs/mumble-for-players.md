---
title: Joining Mumble game channels
---

On sites with [automatic player verification](/docs/mumble-verification) turned on, each game's Mumble channels are open only to that game's players, and each team channel only to its team. The bot recognizes you by your Mumble certificate, so you link it to your tf2pickup.org account once and you're set.

## Getting verified automatically

Most players never have to do anything. Join the game server and Mumble as usual, from the same computer: when the bot sees you on both from the same IP address, it links your certificate and sends you a Mumble message saying so. If you're already on Mumble, it moves you into your team's channel.

This doesn't work when several people share your connection and play or sit on Mumble at the same time, for example housemates or a LAN. Use a code instead.

## Verifying with a code

If you joined Mumble with the game page's **join voice** button and aren't verified automatically within a few seconds, the bot sends you a Mumble message with a link to the verification page. You can also open it yourself: it's **Mumble** under **Linked accounts** in your [player settings](/docs/player-settings), or `/mumble` on the site.

1. Connect to the site's Mumble server. The **Open Mumble** button on the verification page does it for you.
2. Find the bot in Mumble's channel list, right-click it, choose **Send Message** and send it the code shown on the page.
3. Wait for the bot's reply. It tells you as soon as your certificate is linked.

Codes work once and expire after 10 minutes. Once a code expires, reload the page for a new one. Send the code only in a private message to the bot: a code posted in a channel could be used by anyone who reads it.

On the game page, players who aren't verified yet see a **Mumble not verified, set up** link under **join voice**.

## Lost your certificate?

Mumble keeps your certificate on your computer. If you reinstalled Mumble or switched computers, or Mumble says you have no certificate, create a new one:

1. In Mumble, open **Configure → Certificate Wizard**.
2. Choose **Create a new certificate** and follow the steps.
3. Reconnect to the server and verify with a new code.

Your new certificate replaces the old one on your account. Automatic verification never replaces a certificate that's already linked, so this always takes a code.

You can also export your certificate from the Certificate Wizard and import it on your new computer, so you don't have to verify again.

## "This Mumble certificate is linked to another account"

Each certificate can be linked to only one tf2pickup.org account. If the bot replies with this, the certificate you're using is already linked to someone else, most often because you share a computer or a Mumble profile with them.

Either [create a new certificate](#lost-your-certificate) and verify with it, or contact the site's admins, who can unlink the certificate from the other account. If the site is connected to Discord, its admins are notified when this happens.

## For site admins

A player's Mumble certificate is shown in the **Mumble** tab of their **Edit player** page while verification is on: the certificate, when it was linked and how (IP match or verification code). **Unlink certificate** removes it, and with it the player's access to game channels. They can link a certificate again on their own.

Every link and unlink shows up in the player action logs.
