import { onAuthStateChange, logOut } from './firebase-auth.js';

// Function to create and update navigation
function updateNavigation(user) {
    // Update all navbar brand links to point to index.html instead of pexverse.com
    const brandLinks = document.querySelectorAll('.navbar-brand');
    brandLinks.forEach(link => {
        link.href = 'index.html';
    });

    const navContainer = document.querySelector('.d-flex.align-items-center');
    if (!navContainer) return;

    // Clear existing navigation
    navContainer.innerHTML = '';

    if (user) {
        // User is logged in - show dashboard, profile and logout on all pages
        const isDashboard = window.location.pathname.endsWith('dashboard.html');
        const isProfile = window.location.pathname.endsWith('profile.html');
        
        navContainer.innerHTML = `
            <a href="dashboard.html">
                <button type="button" style="${isDashboard ? 'background-color: orange;color:white;' : 'color:orange;'}" class="btn ${isDashboard ? '' : 'btn-link'} px-3 me-2">
                    Dashboard
                </button>
            </a>
            <a href="profile.html">
                <button type="button" style="${isProfile ? 'background-color: orange;color:white;' : 'color:orange;'}" class="btn ${isProfile ? '' : 'btn-link'} px-3 me-2">
                    Profile
                </button>
            </a>
            <button type="button" style="color:orange;" class="btn btn-link px-3 me-2" id="logout-btn">
                Logout
            </button>
        `;
    } else {
        // User is not logged in - show only login button except on auth page
        const isAuthPage = window.location.pathname.endsWith('auth.html');
        if (!isAuthPage) {
            navContainer.innerHTML = `
                <a href="auth.html">
                    <button type="button" style="color:orange;" class="btn btn-link px-3 me-2">
                        Login
                    </button>
                </a>
            `;
        }
    }

    // Add logout event listener if logged in
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
}

// Check authentication state and update navigation
onAuthStateChange((user) => {
    updateNavigation(user);
}); 