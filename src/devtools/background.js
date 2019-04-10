// App ID borrowed from "Chrome Dev Editor" to get access to developerPrivate,
// and open programmatically another extension background devtools.
// https://stackoverflow.com/questions/35932942

chrome.management.getAll((extensions) => {
	const myExtensionPredicate = (ext) =>
		ext.type === 'extension' &&
		ext.installType === 'development' &&
		ext.name !== 'webpack-chrome-extension-launcher-devtools' &&
		ext.name !== 'webpack-chrome-extension-launcher-startpage'

	const { id } = extensions.find(myExtensionPredicate)

	// Delay a little so the background page devtools opens above the main window.
	setTimeout(() => {
		if (id && chrome.hasOwnProperty('developerPrivate')) {
			// @ts-ignore https://developer.chrome.com/apps/developerPrivate#method-openDevTools
			chrome.developerPrivate.openDevTools({ renderViewId: -1, renderProcessId: -1, extensionId: id })
		}
		chrome.management.uninstallSelf()
	}, 500)
})
