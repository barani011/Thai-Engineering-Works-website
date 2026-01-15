document.addEventListener("DOMContentLoaded", () => {

    const PHOTO_BASE_PATH = "../assets/photos/";
    const galleryContainer = document.getElementById("galleryContainer");

    // ===== GALLERY DATA (TITLE + IMAGES) =====
    const galleryData = [
        {
            title: "WORKS ON MACHINE SETUP",
            folder: "Machine setup works/",
            images: [
                "img1.jpeg",
                "img2.jpeg",
                "img3.jpeg",
                "img4.jpeg",
                "img5.jpeg",
            ]
        },
        {
            title: "SHED WORKS",
            folder: "Shed works/",
            images: [
                "img1.jpeg",
                "img2.jpeg",
                "img3.jpeg",
                "img4.jpeg",
                "img5.jpeg",
                "img6.jpeg",
                "img7.jpeg"
            ]
        }
    ];

    // ===== RENDER GALLERY =====
    galleryData.forEach(section => {

        // Section Title
        const title = document.createElement("h2");
        title.className = "gallery-section-title";
        title.textContent = section.title;

        // Grid
        const grid = document.createElement("section");
        grid.className = "masonry-grid";

        // Images
        section.images.forEach(imgName => {
            const item = document.createElement("div");
            item.className = "gallery-item";

            const img = document.createElement("img");
            img.src = PHOTO_BASE_PATH + section.folder + imgName;
            img.alt = section.title;

            item.appendChild(img);
            grid.appendChild(item);
        });

        galleryContainer.appendChild(title);
        galleryContainer.appendChild(grid);
    });

});
