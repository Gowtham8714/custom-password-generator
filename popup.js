// --- CORE LOGIC (Memorable Chunk Algorithm) ---
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractRandomStart(word) {
    word = word.trim();
    const length = getRandomInt(3, 5);
    if (word.length < length) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
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
        const regex = new RegExp(`\\b${month}\\b`, 'g');
        processedDob = processedDob.replace(regex, num);
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

        // Randomly make one of the parts lowercase for variety
        if (Math.random() > 0.5) nPart = nPart.toLowerCase();
        else cPart = cPart.toLowerCase();

        const symbol = symbols[getRandomInt(0, symbols.length - 1)];
        
        // 1. Shuffle the WORDS (chunks), not the individual letters
        let chunks = [nPart, cPart, dPartRaw];
        chunks = shuffleArray(chunks);
        
        // 2. Put them together and add the symbol at the end
        let pwd = chunks.join('') + symbol;
        
        // 3. Adjust to meet the exact length slider requirement safely
        if (pwd.length < targetLength) {
            // If it's too short, pad it by repeating the symbol (e.g., "GowthVisha02@@@")
            const diff = targetLength - pwd.length;
            pwd += symbol.repeat(diff); 
        } else if (pwd.length > targetLength) {
            // If it's too long, trim the end but KEEP the symbol at the end
            pwd = pwd.substring(0, targetLength - 1) + symbol;
        }
        
        passwords.push(pwd);
    }
    return passwords;
}


// --- EXTENSION UI LOGIC ---

// Wait for the DOM to be fully loaded before trying to find elements
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Live update the length slider display as you drag it
    const lengthSlider = document.getElementById('length');
    const lengthDisplay = document.getElementById('lengthDisplay');

    lengthSlider.addEventListener('input', (e) => {
        lengthDisplay.textContent = e.target.value;
    });

    // 2. Load saved data from Chrome local storage
    chrome.storage.local.get(['savedName', 'savedCity', 'savedDob', 'savedLength'], (result) => {
        if (result.savedName) document.getElementById('name').value = result.savedName;
        if (result.savedCity) document.getElementById('city').value = result.savedCity;
        if (result.savedDob) document.getElementById('dob').value = result.savedDob;
        if (result.savedLength) {
            lengthSlider.value = result.savedLength;
            lengthDisplay.textContent = result.savedLength;
        }
        
        // If data is filled, instantly generate and show passwords
        if (result.savedName && result.savedCity && result.savedDob) {
            renderPasswords();
        }
    });

    // 3. Connect all buttons to their specific functions
    document.getElementById('saveBtn').addEventListener('click', saveUserInfo);
    document.getElementById('generateBtn').addEventListener('click', renderPasswords);
    document.getElementById('refreshBtn').addEventListener('click', renderPasswords);
});


// Function to save user inputs to Chrome storage
function saveUserInfo() {
    chrome.storage.local.set({
        savedName: document.getElementById('name').value,
        savedCity: document.getElementById('city').value,
        savedDob: document.getElementById('dob').value,
        savedLength: document.getElementById('length').value
    }, () => {
        // Automatically generate passwords after saving
        renderPasswords();
    });
}


// Function to create and render password buttons in the interface
function renderPasswords() {
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const dob = document.getElementById('dob').value;
    const length = parseInt(document.getElementById('length').value, 10);
    
    const outputContainer = document.getElementById('outputContainer');
    const outputDiv = document.getElementById('output');
    
    // If fields are empty, show a red error message
    if (!name || !city || !dob) {
        outputDiv.innerHTML = '<span style="color:#d93025; font-size: 13px;">Please fill all fields.</span>';
        outputContainer.style.display = 'block';
        return;
    }

    const passwords = generatePasswords(name, city, dob, length);
    outputContainer.style.display = 'block'; // Show the output container
    outputDiv.innerHTML = ''; // Clear old results
    
    passwords.forEach(pwd => {
        const btn = document.createElement('button');
        btn.textContent = pwd;
        btn.className = "pwd-btn"; // Apply the special button styling
        
        // Clicking a password button injects it directly into the active webpage
        btn.addEventListener('click', () => injectPasswordIntoPage(pwd));
        outputDiv.appendChild(btn);
    });
}


// Function to find a password field on the webpage and fill it with the selected password
function injectPasswordIntoPage(selectedPassword) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: (pwd) => {
                // Find standard password input fields
                const passField = document.querySelector('input[type="password"]');
                if (passField) {
                    passField.value = pwd;
                    // Trigger a standard browser 'input' event so modern JS frameworks detect the change
                    passField.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    alert("No standard password field found on this page.");
                }
            },
            args: [selectedPassword]
        });
    });
}