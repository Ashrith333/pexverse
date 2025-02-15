import { onAuthStateChange, logOut } from './firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDx5ViCf5WVIzMq0MQRFT5UeR8Xnztzvks",
    authDomain: "pexverse-42c0f.firebaseapp.com",
    databaseURL: "https://pexverse-42c0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pexverse-42c0f",
    storageBucket: "pexverse-42c0f.firebasestorage.app",
    messagingSenderId: "48846009059",
    appId: "1:48846009059:web:c473791994e8e22bc90bd6",
    measurementId: "G-LM3LJEYR30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentUser = null;

// Check authentication state
onAuthStateChange(async (user) => {
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    currentUser = user;
    loadUserProfile();
    loadUserPets();
});

// Load user profile
async function loadUserProfile() {
    const userRef = ref(db, `users/${currentUser.uid}`);
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            // Basic Info
            document.getElementById('fullName').value = userData.fullName || '';
            document.getElementById('email').value = currentUser.email;
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('bio').value = userData.bio || '';

            // Address Info
            document.getElementById('addressLine1').value = userData.address?.line1 || '';
            document.getElementById('addressLine2').value = userData.address?.line2 || '';
            document.getElementById('city').value = userData.address?.city || '';
            document.getElementById('state').value = userData.address?.state || '';
            document.getElementById('postalCode').value = userData.address?.postalCode || '';
            document.getElementById('country').value = userData.address?.country || '';
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Error loading profile data');
    }
}

// Update user profile
document.getElementById('user-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        // Required fields
        fullName: document.getElementById('fullName').value,
        email: currentUser.email,
        
        // Optional fields
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value,
        
        // Address information
        address: {
            line1: document.getElementById('addressLine1').value,
            line2: document.getElementById('addressLine2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            postalCode: document.getElementById('postalCode').value,
            country: document.getElementById('country').value
        },
        
        // Metadata
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    try {
        await set(ref(db, `users/${currentUser.uid}`), userData);
        showSuccessMessage('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        showErrorMessage('Error updating profile');
    }
});

// Helper function to show success message
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.getElementById('user-profile-form').insertAdjacentElement('afterend', alertDiv);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Helper function to show error message
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.getElementById('user-profile-form').insertAdjacentElement('afterend', alertDiv);
}

// Remove the duplicate event listeners
// Remove this entire block
document.getElementById('add-pet-form').addEventListener('submit', async (e) => {
    // ... remove this entire event listener
});

// Keep only this one event listener for the form
const addPetForm = document.getElementById('add-pet-form');
addPetForm?.replaceWith(addPetForm.cloneNode(true));

const newPetForm = document.getElementById('add-pet-form');
newPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const isEditMode = form.dataset.editMode === 'true';
    const petId = form.dataset.petId;
    
    const petData = {
        name: document.getElementById('petName').value,
        type: document.getElementById('petType').value,
        age: parseInt(document.getElementById('petAge').value),
        addedAt: new Date().toISOString()
    };
    
    try {
        let petRef;
        if (isEditMode) {
            petRef = ref(db, `users/${currentUser.uid}/pets/${petId}`);
        } else {
            petRef = push(ref(db, `users/${currentUser.uid}/pets`));
        }
        
        await set(petRef, petData);
        
        // Reset form and close modal
        form.reset();
        form.dataset.editMode = 'false';
        form.dataset.petId = '';
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPetModal'));
        modal.hide();
        
        loadUserPets();
    } catch (error) {
        console.error('Error saving pet:', error);
        showErrorMessage('Error saving pet');
    }
});

// Load user's pets
async function loadUserPets() {
    const petsRef = ref(db, `users/${currentUser.uid}/pets`);
    try {
        const snapshot = await get(petsRef);
        const petsContainer = document.getElementById('pets-container');
        petsContainer.innerHTML = '';
        
        if (snapshot.exists()) {
            const pets = snapshot.val();
            Object.entries(pets).forEach(([id, pet]) => {
                const petCard = createPetCard(id, pet);
                petsContainer.appendChild(petCard);
            });
        }
    } catch (error) {
        console.error('Error loading pets:', error);
        alert('Error loading pets');
    }
}

// Update the pet card creation to show more details
function createPetCard(id, pet) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
        <div class="pet-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">${pet.name}</h5>
                    <span class="pet-type-badge">${pet.type}</span>
                </div>
                <p class="card-text">Age: ${pet.age} years</p>
                <div class="pet-actions">
                    <button class="btn btn-warning btn-sm me-2" onclick="editPet('${id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePet('${id}')">Remove</button>
                </div>
            </div>
        </div>
    `;
    return col;
}

// Delete pet
window.deletePet = async (petId) => {
    if (confirm('Are you sure you want to remove this pet?')) {
        try {
            await set(ref(db, `users/${currentUser.uid}/pets/${petId}`), null);
            loadUserPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
            alert('Error removing pet');
        }
    }
};

// Add edit pet functionality
window.editPet = async (petId) => {
    const petRef = ref(db, `users/${currentUser.uid}/pets/${petId}`);
    try {
        const snapshot = await get(petRef);
        if (snapshot.exists()) {
            const pet = snapshot.val();
            
            // Populate modal with existing data
            document.getElementById('petName').value = pet.name;
            document.getElementById('petType').value = pet.type;
            document.getElementById('petAge').value = pet.age;
            
            // Update form submission handler for edit mode
            const form = document.getElementById('add-pet-form');
            form.dataset.editMode = 'true';
            form.dataset.petId = petId;
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('addPetModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Error loading pet data:', error);
        alert('Error loading pet data');
    }
};

// Add this after other event listeners
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await logOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        showErrorMessage('Error logging out. Please try again.');
    }
}); 