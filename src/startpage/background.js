// chrome.tabs is not available in Chrome apps API,
// so we must create an extension just to do this.
// (we can't open chrome protocol urls any other programmatic way)

chrome.tabs.query({ active: true }, ([initialTab]) => {
	// No custom launch URL
	if (initialTab.url === 'chrome://newtab/') {
		chrome.tabs.update({ url: 'chrome://extensions/' }, () => chrome.management.uninstallSelf())
	}

	// Custom launch URL
	else {
		// Create the extension tab and move it left
		chrome.tabs.create({ url: 'chrome://extensions/', active: false }, (extensionsTab) => {
			chrome.tabs.move(extensionsTab.id, { index: 0 }, () => {
				// We then reactivate the custom url tab
				// Seems like we still have to wait before activate the launch tab...
				setTimeout(() => {
					chrome.tabs.update(initialTab.id, { active: true }, () => chrome.management.uninstallSelf())
				}, 500)
			})
		})
	}
})
