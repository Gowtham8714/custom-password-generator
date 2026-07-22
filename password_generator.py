import string
import random
import re

def extract_random_start(word):
    """
    Extracts a random number of characters (between 3 and 5) from the start of a word.
    """
    word = word.strip()
    length = random.randint(3, 5)
    
    # If the word is shorter than our random length, just use the whole word
    if len(word) < length:
        return word.capitalize()
    
    return word[:length].capitalize()

def extract_date_as_numbers(dob):
    """
    Converts month names to numbers, then extracts all remaining digits.
    '2nd april 2008' becomes '2042008'.
    """
    dob = dob.lower()
    
    # Map months and common abbreviations to their numeric values
    months = {
        'january': '01', 'jan': '01',
        'february': '02', 'feb': '02',
        'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'may': '05',
        'june': '06', 'jun': '06',
        'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sep': '09', 'sept': '09',
        'october': '10', 'oct': '10',
        'november': '11', 'nov': '11',
        'december': '12', 'dec': '12'
    }
    
    # Replace the text months with numbers using word boundaries (\b) 
    # to ensure we only replace whole words
    for month, num in months.items():
        dob = re.sub(rf'\b{month}\b', num, dob)
        
    # Filter out everything that isn't a digit (removes 'nd', 'st', spaces, etc.)
    digits_only = ''.join(filter(str.isdigit, dob))
    
    return digits_only

def generate_random_passwords(memorable_name, city, dob, num_options=4):
    """
    Generates highly randomized passwords using 3-to-5 letter slices 
    and fully numeric date values.
    """
    passwords = []
    d_part = extract_date_as_numbers(dob)
    symbols = ['@', '#', '$', '-', '!', '*', '?']
    
    for _ in range(num_options):
        # 1. Get random slices (3 to 5 letters)
        n_part = extract_random_start(memorable_name)
        c_part = extract_random_start(city)
        
        # Randomly lowercase one of the parts for added entropy
        if random.choice([True, False]):
            n_part = n_part.lower()
        else:
            c_part = c_part.lower()
            
        # 2. Gather components
        components = [n_part, c_part, d_part, random.choice(symbols)]
        
        # 3. Shuffle components completely
        random.shuffle(components)
        
        # 4. Join components
        password = "".join(components)
        passwords.append(password)
        
    return passwords

def main():
    print("=== Professional Random Password Generator ===")
    print("Generates highly secure, randomized passwords based on memorable details.\n")
    
    # 1. Gather Input
    memorable_name = input("Enter a memorable name (e.g., pet, best friend): ")
    city = input("Enter a memorable city (e.g., birthplace): ")
    dob = input("Enter a memorable Date of Birth or Anniversary (e.g., 2nd April 2008): ")
    
    # 2. Generate Passwords
    passwords = generate_random_passwords(memorable_name, city, dob, num_options=4)
    
    # 3. Display Results
    print("\nHere are your randomized, memorable password options:")
    for i, pwd in enumerate(passwords, 1):
        print(f"Option {i}: {pwd}")
        
    # 4. Privacy / Security Tip
    print("\n🔒 PRO TIP FOR ULTIMATE PRIVACY:")
    print("To ensure absolutely no one (not even this program) knows your exact password,")
    print("add a personal 'secret number' or letter somewhere in the password when you use it.")
    print("Example: If you choose Option 1, stick a '99' at the very end!\n")

if __name__ == "__main__":
    main()