// chrome.tabs is not available in Chrome apps API,
// so we must create an extension just to do this.
// (we can't open chrome protocol urls any other programmatic way)
const extensionTab = { url: 'chrome://extensions/' }
const uninstallSelf = () => chrome.management.uninstallSelf()

chrome.tabs.query({ active: true }, ([activeTab]) => {
	if (activeTab.url === 'chrome://newtab/') {
		chrome.tabs.update(extensionTab, uninstallSelf)
	} else {
		// If we launch with a custom url, we still create the extension tab and move it left.
		chrome.tabs.create(extensionTab, ({ id }) => {
			chrome.tabs.move(id, { index: 0 }, () => {
				// We then reactivate the custom url tab
				chrome.tabs.update(activeTab.id, { active: true }, uninstallSelf)
			})
		})
	}
})
