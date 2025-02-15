import { onAuthStateChange, logOut } from './firebase-auth.js';
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { auth, db } from './firebase-config.js';

// Check authentication state
onAuthStateChange(async (user) => {
    if (!user) {
        // If not authenticated, redirect to auth page
        window.location.href = '/auth.html';
        return;
    }

    // Get user data from Realtime Database
    try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById('user-name').textContent = userData.email || 'Pet Lover';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

// Add logout handler
const logoutBtn = document.getElementById('logout-btn');
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