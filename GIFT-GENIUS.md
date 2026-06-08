# Gift Genius - Password Protected Gift Tracker

A private gift idea generator and tracker with password protection.

## 🔒 Security

The page is password-protected using SHA-256 hashing. Only you can access your gift history.

**Default Password:** `password` (⚠️ **CHANGE THIS IMMEDIATELY**)

## Changing Your Password

1. Open your browser's JavaScript console (F12 → Console tab)
2. Run this command with YOUR desired password:
   ```javascript
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PASSWORD_HERE')).then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('')))
   ```
3. Copy the generated hash
4. Open `gift-genius.html` in a text editor
5. Find this line (search for `PASSWORD_HASH`):
   ```javascript
   const PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
   ```
6. Replace the hash with your generated hash
7. Save the file
8. Commit and push the change to GitHub

## Features

### Gift Generator
- Smart gift recommendations based on relationship, age, interests, and budget
- Unique, personalized, and experiential gift ideas
- Budget filtering (Under $50 to $500+)
- 12 interest categories
- Save suggestions directly to tracker

### Gift Tracker
- Track all gifts you've given
- See statistics: total gifts, people gifted, amount spent
- Export gift history to CSV
- Filter by recipient, relationship, occasion
- Secure local storage (data never leaves your browser)

## Privacy

- All data stored locally in your browser (localStorage)
- No server communication
- No analytics or tracking
- Password required for access (session-based)
- Data remains in your browser only

## Access

After pushing to GitHub, visit: https://lehmonster.github.io/happy-puppy/gift-genius.html

Your gift data is private and only accessible with your password.
