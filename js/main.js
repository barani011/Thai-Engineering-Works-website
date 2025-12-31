const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('is-open');
    }
  });
});

// Basic form handler stub
const form = document.querySelector('.contact-form form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! We will get back to you shortly.');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  // Select all cards that are intended to be toggled
  // Note: We select based on the class 'hidden-card' in HTML
  // But once we remove that class to show them, we need a way to reference them again.
  // So we will select them once and keep the reference.
  const extraCards = document.querySelectorAll('.product-card.hidden-card');

  toggleBtn.addEventListener('click', () => {
    // Check if the first card is currently hidden
    const isHidden = extraCards[0].style.display === 'none' || extraCards[0].style.display === '';

    if (isHidden) {
      // --- ACTION: SHOW CARDS ---
      extraCards.forEach(card => {
        card.style.display = 'block'; // Or 'flex' depending on your layout needs
      });
      toggleBtn.textContent = 'Read Less';
    } else {
      // --- ACTION: HIDE CARDS ---
      extraCards.forEach(card => {
        card.style.display = 'none';
      });
      toggleBtn.textContent = 'Read More';

      // Optional: Smooth scroll back to the Products title so the user doesn't get lost
      document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const MASTER_PASSWORD = "1234";
    const VIDEO_STORAGE_KEY = 'my_youtube_gallery';

    // --- Elements ---
    const toggleBtn = document.getElementById('toggleAddBtn');
    const addSection = document.getElementById('addVideoSection');
    const urlInput = document.getElementById('videoUrlInput');
    const titleInput = document.getElementById('videoTitleInput');
    const passwordInput = document.getElementById('adminPassword');
    const addBtn = document.getElementById('addVideoBtn');
    const videoGrid = document.getElementById('videoGrid');
    
    // Context Menu
    const contextMenu = document.getElementById('contextMenu');
    const deleteOption = document.getElementById('deleteOption');
    let itemToDelete = null;

    // --- 1. Load Videos on Start ---
    loadVideos();

    function loadVideos() {
        const savedVideos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
        savedVideos.forEach(video => createVideoCard(video.id, video.videoId, video.title));
    }

    // --- 2. Toggle Add Menu ---
    toggleBtn.addEventListener('click', () => {
        addSection.classList.toggle('hidden');
        if (addSection.classList.contains('hidden')) {
            toggleBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Video';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> Close';
        }
    });

    // --- 3. Add Video Logic ---
    addBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        const title = titleInput.value.trim() || "Untitled Video";
        const password = passwordInput.value;

        if (password !== MASTER_PASSWORD) {
            alert("Incorrect Password!");
            return;
        }

        const videoId = extractYouTubeID(url);

        if (!videoId) {
            alert("Invalid YouTube URL. Please check the link.");
            return;
        }

        const uniqueId = Date.now();
        
        // Save to Storage
        saveVideoToStorage(uniqueId, videoId, title);
        
        // Create Visual Card
        createVideoCard(uniqueId, videoId, title);

        // Reset Inputs
        urlInput.value = '';
        titleInput.value = '';
        passwordInput.value = '';
        addSection.classList.add('hidden');
        toggleBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Video';
    });

    // Helper: Extract ID from various YouTube URL formats
    function extractYouTubeID(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function createVideoCard(uniqueId, videoId, title) {
        const card = document.createElement('div');
        card.classList.add('video-card');
        card.dataset.id = uniqueId;

        card.innerHTML = `
            <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h3>${title}</h3>
            </div>
        `;

        // Add to grid (newest first)
        videoGrid.insertBefore(card, videoGrid.firstChild);
    }

    function saveVideoToStorage(id, videoId, title) {
        const videos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
        videos.unshift({ id, videoId, title });
        localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(videos));
    }

    // --- 4. Right Click Delete Logic ---
    videoGrid.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.video-card');
        if (card) {
            e.preventDefault();
            itemToDelete = card;
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.classList.remove('hidden');
        }
    });

    document.addEventListener('click', () => contextMenu.classList.add('hidden'));

    deleteOption.addEventListener('click', () => {
        if (itemToDelete) {
            const pass = prompt("Enter password to delete video:");
            if (pass === MASTER_PASSWORD) {
                // Remove from Storage
                const idToDelete = parseInt(itemToDelete.dataset.id);
                let videos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
                videos = videos.filter(v => v.id !== idToDelete);
                localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(videos));

                // Remove from View
                itemToDelete.remove();
            } else if (pass !== null) {
                alert("Incorrect Password.");
            }
        }
    });
});