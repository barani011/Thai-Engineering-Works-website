document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const MASTER_PASSWORD = "abcd"; 
    const STORAGE_KEY = 'my_gallery_photos'; // Key for LocalStorage

    // --- Elements ---
    const toggleBtn = document.getElementById('toggleUploadBtn');
    const uploadSection = document.getElementById('uploadSection');
    const fileInput = document.getElementById('imageUploadInput');
    const chooseBtn = document.getElementById('chooseFileBtn');
    const addBtn = document.getElementById('addPhotoBtn');
    const fileNameDisplay = document.getElementById('fileName');
    const passwordInput = document.getElementById('uploadPassword');
    const galleryGrid = document.getElementById('galleryGrid');
    
    // Context Menu Elements
    const contextMenu = document.getElementById('contextMenu');
    const deleteOption = document.getElementById('deleteOption');
    
    let itemToDelete = null;

    // --- 1. LOAD PHOTOS FROM STORAGE ON STARTUP ---
    loadGalleryFromStorage();

    function loadGalleryFromStorage() {
        // Get data from browser memory, or empty array if nothing exists
        const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Loop through and create elements
        savedPhotos.forEach(photo => {
            createGalleryItem(photo.data, photo.id, false); // false means "don't save again, just show"
        });
    }

    // --- 2. UPLOAD LOGIC ---
    
    // Toggle Menu
    toggleBtn.addEventListener('click', () => {
        uploadSection.classList.toggle('hidden');
        if (uploadSection.classList.contains('hidden')) {
            toggleBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Upload New Photo';
            toggleBtn.style.backgroundColor = '#e60023';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> Close';
            toggleBtn.style.backgroundColor = '#333';
        }
    });

    chooseBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            fileNameDisplay.textContent = e.target.files[0].name;
            addBtn.disabled = false;
        }
    });

    addBtn.addEventListener('click', () => {
        const selectedFile = fileInput.files[0];
        if (!selectedFile) return;

        // Check Password
        if (passwordInput.value !== MASTER_PASSWORD) {
            alert("Incorrect Upload Password!");
            passwordInput.value = ''; 
            passwordInput.focus();
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageData = event.target.result; // This is the Base64 image string
            const uniqueId = Date.now(); // Create a unique ID for this photo
            
            // Create DOM Element AND Save to Storage
            try {
                createGalleryItem(imageData, uniqueId, true); // true means "save this to storage"
                resetControls();
            } catch (error) {
                alert("Storage full! Image too large to save.");
                console.error(error);
            }
        };
        reader.readAsDataURL(selectedFile);
    });

    // --- 3. HELPER: CREATE & RENDER ITEM ---
    function createGalleryItem(imageBase64, id, saveToStorage) {
        // Create HTML Structure
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('gallery-item');
        // Attach the ID to the HTML element so we know which one to delete later
        newItemDiv.dataset.id = id; 

        const newImg = document.createElement('img');
        newImg.src = imageBase64;
        newImg.alt = "Gallery Photo";

        newItemDiv.appendChild(newImg);
        
        // Add to Grid (Prepend to show newest first)
        galleryGrid.insertBefore(newItemDiv, galleryGrid.firstChild);

        // Save to LocalStorage if this is a new upload
        if (saveToStorage) {
            savePhotoData(id, imageBase64);
        }
    }

    function savePhotoData(id, data) {
        const savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Add new photo to the beginning of the array
        savedPhotos.unshift({ id: id, data: data });
        
        // Save back to browser memory
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhotos));
    }

    // --- 4. RIGHT CLICK CONTEXT MENU ---
    galleryGrid.addEventListener('contextmenu', (e) => {
        const clickedItem = e.target.closest('.gallery-item');

        if (clickedItem) {
            e.preventDefault(); 
            itemToDelete = clickedItem;

            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.classList.remove('hidden');
        }
    });

    document.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
    });
    
    // --- 5. DELETE LOGIC (UPDATED FOR STORAGE) ---
    deleteOption.addEventListener('click', () => {
        if (itemToDelete) {
            const userEnteredPass = prompt("Enter password to delete this photo:");
            
            if (userEnteredPass === MASTER_PASSWORD) {
                // 1. Remove from LocalStorage
                const idToDelete = parseInt(itemToDelete.dataset.id);
                removePhotoFromStorage(idToDelete);

                // 2. Remove from Visual Grid
                itemToDelete.remove();
                itemToDelete = null; 
            } else if (userEnteredPass !== null) {
                alert("Incorrect password.");
            }
        }
        contextMenu.classList.add('hidden');
    });

    function removePhotoFromStorage(id) {
        let savedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Filter out the photo with the matching ID
        savedPhotos = savedPhotos.filter(photo => photo.id !== id);
        
        // Save the updated list back to storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhotos));
    }

    function resetControls() {
        fileInput.value = '';
        fileNameDisplay.textContent = "No file chosen";
        passwordInput.value = ''; 
        addBtn.disabled = true;
        uploadSection.classList.add('hidden');
        toggleBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Upload New Photo';
        toggleBtn.style.backgroundColor = '#e60023';
    }
});