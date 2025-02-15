import { onAuthStateChange, logOut } from './firebase-auth.js';

// Get DOM elements
const authButtons = document.getElementById('auth-buttons');
const userButtons = document.getElementById('user-buttons');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication state
onAuthStateChange((user) => {
    if (user) {
        // User is signed in
        authButtons.style.display = 'none';
        userButtons.style.display = 'block';
    } else {
        // User is signed out
        authButtons.style.display = 'block';
        userButtons.style.display = 'none';
    }
});

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await logOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    });
} 