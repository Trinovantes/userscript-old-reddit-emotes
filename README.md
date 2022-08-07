# Userscript Old Reddit Emotes

Embed custom subreddit emotes in old.reddit.com. You still need to use the new Reddit editor to post emotes because the old editor will automatically escape emote codes.

![](.github/img/preview.png)

## Installation Guide

1. Install a Userscript manager for your web browser
    * [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
    * [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)

2. [Download the latest build](https://github.com/Trinovantes/userscript-old-reddit-emotes/releases/download/latest/userscript-old-reddit-emotes.user.js). If you have Greasemonkey or Tampermonkey installed, then you should immediately be prompted with a confirmation window asking you if you wish to install this Userscript.

## Dev Guide

1. Install prereqs

    * `node`
    * `yarn`
    * Tampermonkey on Chrome

2. In Chrome:

    * Go to `chrome://extensions/`
    * Go into Tampermonkey's details
    * Enable `Allow access to file URLs`

3. Run dev server

    ```
    yarn install
    yarn dev
    ```

4. In Chrome:

    * Go to `http://localhost:8080/userscript-old-reddit-emotes.proxy.user.js` and install the script
