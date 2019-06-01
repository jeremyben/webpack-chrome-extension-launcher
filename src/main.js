const { exec } = require('child_process')
const { tmpdir } = require('os')
const { resolve } = require('path')
const { mkdirSync, existsSync, readFileSync, writeFileSync } = require('fs')
const get = require('lodash.get')
const set = require('lodash.set')
const chrome = require('chrome-location')

class ChromeExtensionLauncher {
	/** @param {{path?: string, launchURL?: string, autoDevtools?: boolean}} options */
	constructor(options = {}) {
		this.path = options.path // output.path by default
		this.launchURL = options.launchURL || ''
		this.devtoolsFlag = options.autoDevtools ? '--auto-open-devtools-for-tabs' : ''
		this.launched = false
	}

	/** @param {import('webpack').Compiler} compiler */
	apply(compiler) {
		// Dont do anything in production mode
		if (compiler.options.mode === 'production') {
			return console.warn('[Chrome Extension Launcher] Production mode: disabled')
		}

		compiler.hooks.afterEmit.tapAsync('webpack-chrome-extension-launcher', (compilation, callback) => {
			// Launch only one instance
			if (this.launched) return callback()

			const path = this.path || compilation.outputOptions.path
			const userDataDir = this.createTempUserDataDir()
			this.launchChrome(path, userDataDir)
			this.enableDeveloperMode(userDataDir)
			this.launched = true
			callback()
		})
	}

	/**
	 * Create or reuse new chrome user folder
	 */
	createTempUserDataDir() {
		const userDataDir = resolve(tmpdir(), 'webpack-chrome-extension-launcher')

		try {
			mkdirSync(userDataDir)
		} catch (error) {
			if (error.code === 'EEXIST') {
				console.log('[Chrome Extension Launcher] Use existing temporary user profile')
			} else {
				throw error
			}
		}

		return userDataDir
	}

	/**
	 * Open a new Chrome instance (with an new user profile) loaded with the unpacked extension
	 * @param {string} extension
	 * @param {string} userDataDir
	 */
	launchChrome(extension, userDataDir) {
		console.log('[Chrome Extension Launcher] Launching Chrome instance')

		// Temporary extension to open extensions page on startup
		const startpage = resolve(__dirname, 'startpage')
		// Temporary app to open background page devtools on startup
		const backgroundDevtools = resolve(__dirname, 'devtools')

		return new Promise((resolve) => {
			// https://peter.sh/experiments/chromium-command-line-switches/
			const extensionFlag = `--load-extension="${extension}","${startpage}","${backgroundDevtools}"`
			const userDataDirFlag = `--user-data-dir="${userDataDir}"`

			const cmd = `"${chrome}" "${this.launchURL}" ${extensionFlag} ${userDataDirFlag} ${this.devtoolsFlag}`

			const child = exec(cmd, (error, stdout, stderr) => {
				if (error) throw error
				if (stderr.includes('Unable to move the cache')) {
					console.log(`[Chrome Extension Launcher] Chrome instance already running`)
				} else {
					console.log('[Chrome Extension Launcher] Chrome instance exited')
					process.exit()
				}
			})
			child.stdout.pipe(process.stdout)
			child.stderr.pipe(process.stderr)
		})
	}

	/**
	 * Enables developer mode for extensions
	 * @param {string} userDataDir
	 */
	enableDeveloperMode(userDataDir) {
		const prefsFile = resolve(userDataDir, 'Default', 'Preferences')

		return this.waitForFileEvery(prefsFile, 10).then(() => {
			const prefs = JSON.parse(readFileSync(prefsFile, 'utf8'))

			const developerMode = get(prefs, 'extensions.ui.developer_mode')
			if (developerMode === true) return

			console.log('[Chrome Extension Launcher] Enabling developer mode')
			set(prefs, 'extensions.ui.developer_mode', true)
			writeFileSync(prefsFile, JSON.stringify(prefs), 'utf8')
		})
	}

	/**
	 * Wait for created file
	 * @param {string} file
	 * @param {number} ms
	 */
	waitForFileEvery(file, ms) {
		return new Promise((resolve) => {
			const timer = setInterval(() => {
				if (existsSync(file)) {
					clearInterval(timer)
					resolve()
				}
			}, ms)
		})
	}
}

exports = module.exports = ChromeExtensionLauncher
