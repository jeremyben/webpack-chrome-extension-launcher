# Chrome Extension Launcher

Jumptstart your Chrome extension development.

## Why

Usually when developing a Chrome extension, you must first go to the `chrome://extensions/` page, enable developer mode, load the unpacked extension, select its path, and finally open background page devtools.

This webpack plugin spares you all of those clicks. 💅

## Get Started

Install Chrome Extension Launcher :

```bash
npm i -D webpack-chrome-extension-launcher
# or
yarn add -D webpack-chrome-extension-launcher
```

Add to your Webpack config :

```js
const ChromeExtensionLauncher = require('webpack-chrome-extension-launcher')

module.exports = {
  // your webpack config
  mode: 'development'
  //...
  
  plugins: [new ChromeExtensionLauncher()],
}
```

🚀 A _dedicated_ Chrome instance loaded _exclusively_ with your unpacked extension will launch _once_ after initial compilation (no need to worry about watch mode), with the following perks :

- Developer mode enabled.
- `chrome://extensions/` as homepage.
- Background page devtools opened on startup.
- Webpack process killed on Chrome instance exit.

#### Options

- You can have Chrome devtools automatically opened in new tabs.
- You can start Chrome with a custom URL.

```js
new ChromeExtensionLauncher({ autoDevtools: true, launchURL: 'https://github.com' })
```

- Chrome Extension Launcher looks for an unpacked extension in the [`output.path`](https://webpack.js.org/configuration/output/#outputpath) property of your webpack config, but you can specify your own path.

```js
new ChromeExtensionLauncher({
  autoDevtools: true,
  launchURL: 'https://github.com',
  path: '/path/to/extension'
})
```

#### Production build

Chrome Extension Launcher is automatically disabled in [`mode: 'production'`](https://webpack.js.org/configuration/mode/).

## How about

#### Hot reloading

If you don't want to click on the reload button every time you make a change, <br>
use together with **[Chrome Extension Reloader](https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader)** from Rubens Pinheiro.

#### Better logging

If you want to centralize all your logs in the background page, <br>
use together with **[Web Extension Background Logger](https://github.com/jeremyben/webpack-webextension-background-logger)** from me. 🙂
