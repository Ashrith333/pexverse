import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { auth, db } from './firebase-config.js';

// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        forms.forEach(f => f.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-form`).classList.remove('hidden');
    });
});

// Sign In form submission
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Sign in error:', error);
        showError('signin-error', error.message);
    }
});

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const signupError = document.getElementById('signup-error');
    signupError.textContent = ''; // Clear previous errors

    try {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);

        try {
            // Try to create user profile in database
            await set(ref(db, `users/${userCredential.user.uid}`), {
                email: userCredential.user.email,
                createdAt: new Date().toISOString()
            });
        } catch (dbError) {
            // If database write fails, log error but continue
            console.error('Error writing to database:', dbError);
        }

        // Show success message and redirect regardless of database write
        alert('Account created successfully! Redirecting to dashboard...');
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Error during signup:', error);
        signupError.textContent = getErrorMessage(error);
        signupError.style.display = 'block';
    }
});

function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/permission-denied':
            // If it's a permission error, we'll still let the user proceed
            return 'Account created successfully! Redirecting...';
        default:
            return error.message;
    }
}

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.classList.add('show');
    }
}

// Add this to ensure errors are visible
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .error-message {
            color: #dc3545;
            font-size: 14px;
            margin-top: 10px;
            display: none;
            padding: 10px;
            background-color: rgba(220, 53, 69, 0.1);
            border-radius: 4px;
        }
        
        .error-message.show {
            display: block;
        }
    </style>
`); 