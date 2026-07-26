// --- CORE LOGIC (Memorable Chunk Algorithm) ---
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractRandomStart(word) {
    word = word.trim();
    const length = getRandomInt(3, 5);
    if (word.length < length) return word.charAt(0).toUpperCase() + word.slice(1);
    const sliced = word.substring(0, length);
    return sliced.charAt(0).toUpperCase() + sliced.slice(1);
}

function extractDateAsNumbers(dob) {
    let processedDob = dob.toLowerCase();
    const months = {
        'january': '01', 'jan': '01', 'february': '02', 'feb': '02',
        'march': '03', 'mar': '03', 'april': '04', 'apr': '04',
        'may': '05', 'june': '06', 'jun': '06', 'july': '07', 'jul': '07',
        'august': '08', 'aug': '08', 'september': '09', 'sep': '09', 'sept': '09',
        'october': '10', 'oct': '10', 'november': '11', 'nov': '11',
        'december': '12', 'dec': '12'
    };
    for (const [month, num] of Object.entries(months)) {
        processedDob = processedDob.replace(new RegExp(`\\b${month}\\b`, 'g'), num);
    }
    return processedDob.replace(/\D/g, ''); 
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePasswords(name, city, dob, targetLength, numOptions = 4) {
    const passwords = [];
    const dPartRaw = extractDateAsNumbers(dob);
    const symbols = ['@', '#', '$', '-', '!', '*', '?'];

    for (let i = 0; i < numOptions; i++) {
        let nPart = extractRandomStart(name);
        let cPart = extractRandomStart(city);

        if (Math.random() > 0.5) nPart = nPart.toLowerCase();
        else cPart = cPart.toLowerCase();

        const symbol = symbols[getRandomInt(0, symbols.length - 1)];
        let chunks = shuffleArray([nPart, cPart, dPartRaw]);
        let pwd = chunks.join('') + symbol;
        
        if (pwd.length < targetLength) {
            pwd += symbol.repeat(targetLength - pwd.length); 
        } else if (pwd.length > targetLength) {
            pwd = pwd.substring(0, targetLength - 1) + symbol;
        }
        passwords.push(pwd);
    }
    return passwords;
}

// --- EXTENSION UI & VAULT LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('length');
    const lengthDisplay = document.getElementById('lengthDisplay');
    lengthSlider.addEventListener('input', (e) => {
        lengthDisplay.textContent = e.target.value;
    });

    chrome.storage.local.get(['savedName', 'savedCity', 'savedDob', 'savedLength'], (result) => {
        if (result.savedName) document.getElementById('name').value = result.savedName;
        if (result.savedCity) document.getElementById('city').value = result.savedCity;
        if (result.savedDob) document.getElementById('dob').value = result.savedDob;
        if (result.savedLength) {
            lengthSlider.value = result.savedLength;
            lengthDisplay.textContent = result.savedLength;
        }
        if (result.savedName && result.savedCity && result.savedDob) {
            renderPasswords();
        }
    });

    document.getElementById('saveBtn').addEventListener('click', saveUserInfo);
    document.getElementById('generateBtn').addEventListener('click', renderPasswords);
    document.getElementById('refreshBtn').addEventListener('click', renderPasswords);
    
    document.getElementById('toggleVaultBtn').addEventListener('click', toggleVault);
    document.getElementById('clearVaultBtn').addEventListener('click', clearVault);
});

function saveUserInfo() {
    chrome.storage.local.set({
        savedName: document.getElementById('name').value,
        savedCity: document.getElementById('city').value,
        savedDob: document.getElementById('dob').value,
        savedLength: document.getElementById('length').value
    }, () => renderPasswords());
}

function renderPasswords() {
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const dob = document.getElementById('dob').value;
    const length = parseInt(document.getElementById('length').value, 10);
    
    const outputContainer = document.getElementById('outputContainer');
    const outputDiv = document.getElementById('output');
    
    if (!name || !city || !dob) {
        outputDiv.innerHTML = '<span style="color:#d93025; font-size: 13px;">Please fill all fields.</span>';
        outputContainer.style.display = 'block';
        return;
    }

    const passwords = generatePasswords(name, city, dob, length);
    outputContainer.style.display = 'block';
    outputDiv.innerHTML = ''; 
    
    passwords.forEach(pwd => {
        const btn = document.createElement('button');
        btn.textContent = pwd;
        btn.className = "pwd-btn";
        btn.addEventListener('click', () => injectPasswordIntoPage(pwd));
        outputDiv.appendChild(btn);
    });
}

// Vault System: Save domain, username/email, and password
function saveToVault(url, username, password) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        if (!domain) return;

        chrome.storage.local.get(['passwordVault'], (result) => {
            const vault = result.passwordVault || {};
            vault[domain] = {
                username: username || "Unknown User / Email",
                password: password
            }; 
            chrome.storage.local.set({ passwordVault: vault });
        });
    } catch (e) {
        console.log("Could not save to vault.", e);
    }
}

function injectPasswordIntoPage(selectedPassword) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
            target: {tabId: activeTab.id},
            func: (pwd) => {
                const passField = document.querySelector('input[type="password"]');
                
                // Search for an email/username input on the page
                const userField = document.querySelector('input[type="email"], input[name*="user"], input[name*="email"], input[id*="user"], input[id*="email"], input[type="text"]');
                const detectedUser = userField ? userField.value : "";

                if (passField) {
                    passField.value = pwd;
                    passField.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    navigator.clipboard.writeText(pwd);
                    alert("No password field found. Password copied to clipboard!");
                }

                return detectedUser; // Return detected username to Chrome extension
            },
            args: [selectedPassword]
        }, (results) => {
            if (results && results[0] && activeTab.url) {
                const detectedUsername = results[0].result;
                saveToVault(activeTab.url, detectedUsername, selectedPassword);
            }
        });
    });
}

function toggleVault() {
    const genView = document.getElementById('generatorView');
    const vaultView = document.getElementById('vaultView');
    const btn = document.getElementById('toggleVaultBtn');

    if (vaultView.style.display === 'none') {
        genView.style.display = 'none';
        vaultView.style.display = 'block';
        btn.textContent = '🔙 Back';
        renderVaultList();
    } else {
        vaultView.style.display = 'none';
        genView.style.display = 'block';
        btn.textContent = '🗃️';
    }
}

function renderVaultList() {
    const list = document.getElementById('vaultList');
    list.innerHTML = '';

    chrome.storage.local.get(['passwordVault'], (result) => {
        const vault = result.passwordVault || {};
        const domains = Object.keys(vault);

        if (domains.length === 0) {
            list.innerHTML = '<p class="tip">No passwords saved yet. Fill out details on a site & click a password to save!</p>';
            return;
        }

        domains.forEach(domain => {
            const entry = vault[domain];
            
            const item = document.createElement('div');
            item.className = 'vault-item';
            
            const title = document.createElement('div');
            title.className = 'vault-domain';
            title.textContent = domain;

            const user = document.createElement('div');
            user.className = 'vault-username';
            user.textContent = `👤 ${entry.username || 'No email detected'}`;

            const pwd = document.createElement('div');
            pwd.className = 'vault-pwd';
            pwd.textContent = entry.password;

            item.appendChild(title);
            item.appendChild(user);
            item.appendChild(pwd);
            list.appendChild(item);
        });
    });
}

function clearVault() {
    if (confirm("Are you sure you want to delete all saved accounts?")) {
        chrome.storage.local.remove('passwordVault', () => {
            renderVaultList();
        });
    }
}