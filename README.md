# Memorable Password Generator & Mini-Vault

A minimal Chrome Extension that generates highly memorable passwords based on your personal details, auto-fills them with a single click, and securely saves your credentials in a built-in local vault.

## ✨ Features

* **Memorable Algorithms:** Shuffles parts of your name, city, and date of birth with symbols to create passwords that are easy for you to remember but hard for bots to guess.
* **One-Click Autofill:** Click any generated password to instantly inject it into the active webpage's password field.
* **Smart Auto-Save (New):** Automatically detects your email or username on the login page and saves it alongside your new password when you autofill.
* **Built-in Vault (New):** Toggle over to the Vault view (🗃️) to see a complete list of your saved domains, usernames, and passwords. 
* **Customizable Length:** Use the built-in slider to generate passwords anywhere from 8 to 32 characters to meet any website's security requirements.
* **Persistent Settings:** Saves your generator preferences locally so you only have to type your personal details once.

## 🚀 Installation

To use this extension in your browser before it is published to the Chrome Web Store:

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing these project files.
6. The extension will now appear in your browser toolbar!

## 🛠️ Usage

**To Generate & Save:**
1. Click the extension icon in your Chrome toolbar.
2. Enter your Name, City, and Date of Birth, and adjust the length slider.
3. Click **Save Info** to lock in your generator preferences.
4. Type your email/username into the webpage you are trying to log into.
5. Click a password in the extension. It will auto-fill the page and automatically save the URL, your Username, and the Password to your Vault.

**To View Saved Passwords:**
1. Click the **🗃️ Vault** icon in the top right of the extension.
2. View all your saved accounts. 
3. Use the **🗑️ Trash** icon to clear your vault at any time.

## 🔒 Security Note
This project was built for convenience and demonstration. Passwords and usernames are stored strictly locally on your machine using Chrome's `chrome.storage.local` API. Because this data is not heavily encrypted like an enterprise password manager (e.g., Bitwarden or 1Password), it is recommended for personal, low-risk use or as a developer portfolio piece.

## 💻 Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Chrome Extension Manifest V3 API (`chrome.storage`, `chrome.scripting`, `chrome.tabs`)
