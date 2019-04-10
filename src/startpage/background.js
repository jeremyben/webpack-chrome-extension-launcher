// chrome.tabs is not available in Chrome apps API,
// so we must create an extension just to do this.
// (we can't open chrome protocol urls any other programmatic way)
chrome.tabs.update({ url: 'chrome://extensions/' })

// Seems that we must delay for the url update to work before self uninstalling.
setTimeout(() => chrome.management.uninstallSelf())
