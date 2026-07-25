# Memorable Password Generator

A minimal, secure Chrome Extension that generates highly memorable passwords based on your personal details and auto-fills them directly into websites with a single click.

## ✨ Features

* **Memorable Algorithms:** Shuffles parts of your name, city, and date of birth with symbols to create passwords that are easy for you to remember but hard for others to guess.
* **One-Click Autofill:** Click any generated password to instantly inject it into the active webpage's password field.
* **Persistent Storage:** Saves your details securely in Chrome's local storage so you only have to type them once.
* **Customizable Length:** Use the built-in slider to generate passwords anywhere from 8 to 32 characters to meet any website's security requirements.
* **Modern UI:** Clean, minimalist, and soft-edge interface.

## 🚀 Installation

To use this extension in your own browser before it is published to the Chrome Web Store:

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing these project files.
6. The extension will now appear in your browser toolbar!

## 🛠️ Usage

1. Click the extension icon in your Chrome toolbar.
2. Enter a memorable Name, City, and Date of Birth.
3. Adjust the slider to your desired password length.
4. Click **Save Info** (you only need to do this once).
5. Click any of the generated password buttons to instantly autofill it into the website you are currently logging into.
6. Not satisfied with the options? Click the **↻** refresh icon to generate a new batch.

## 💻 Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Chrome Extension Manifest V3 API (`chrome.storage`, `chrome.scripting`, `chrome.tabs`)
