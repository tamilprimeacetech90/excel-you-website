/* =========================================================
   EXCEL YOU IMAGE BLOCK - FIXED & COMPATIBLE
========================================================= */
class ImageBlock {
    constructor(editor) {
        this.editor = editor;
        this.init();
    }

    init() {
        this.setupToolbarButton();
        console.log("Image Block Initialized ✔");
    }

    setupToolbarButton() {
        const imageBtn = document.getElementById("imageBtn");
        if (!imageBtn) return;

        imageBtn.addEventListener("click", () => {
            this.openImagePicker();
        });
    }

    openImagePicker() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.addEventListener("change", e => {
            const file = e.target.files[0];
            if (!file) return;
            this.insertImage(file);
        });
    }

    insertImage(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const imageUrl = e.target.result;

            // Use BlockEngine to create consistent block
            if (window.blockEngine) {
                const block = window.blockEngine.createImageBlock(imageUrl);
                
                // Optional: Add caption if you want
                this.addCaptionToBlock(block);
                
                block.scrollIntoView({ behavior: "smooth", block: "center" });

                // Save to media library
                if (window.mediaLibrary) {
                    window.mediaLibrary.addMedia({
                        type: "image",
                        name: file.name,
                        url: imageUrl,
                        size: file.size
                    });
                }
            } else {
                console.warn("BlockEngine not found. Falling back...");
                this.editor.appendChild(this.createLegacyImageBlock(imageUrl));
            }
        };
        reader.readAsDataURL(file);
    }

    /* Use BlockEngine for creation (Recommended) */
    createImageBlock(src) {
        return window.blockEngine ? window.blockEngine.createImageBlock(src) : null;
    }

    /* Legacy fallback (only if BlockEngine is missing) */
    createLegacyImageBlock(src) {
        const wrapper = document.createElement("div");
        wrapper.className = "editor-block image-block media-block";
        wrapper.draggable = true;
        wrapper.dataset.blockType = "image";
        wrapper.dataset.blockId = "img_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

        const image = document.createElement("img");
        image.src = src;
        image.className = "editor-image";
        image.draggable = false;

        const controls = this.createControls(wrapper, image);
        const caption = this.createCaption();

        wrapper.append(controls, image, caption);
        this.setupEvents(wrapper, image);

        return wrapper;
    }

    createCaption() {
        const caption = document.createElement("div");
        caption.className = "image-caption";
        caption.contentEditable = "true";
        caption.innerHTML = "Write caption...";
        return caption;
    }

    addCaptionToBlock(block) {
        // If BlockEngine's createImageBlock doesn't have caption, add it
        if (!block.querySelector(".image-caption")) {
            const caption = this.createCaption();
            block.appendChild(caption);
        }
    }

    createControls(wrapper, image) {
        const controls = document.createElement("div");
        controls.className = "media-controls";

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "media-delete-btn";
        deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete image?")) wrapper.remove();
        });

        // Alignment buttons (optional)
        const leftBtn = document.createElement("button");
        leftBtn.innerHTML = `<i class="fas fa-align-left"></i>`;
        leftBtn.onclick = () => wrapper.style.margin = "20px auto 20px 0";

        const centerBtn = document.createElement("button");
        centerBtn.innerHTML = `<i class="fas fa-align-center"></i>`;
        centerBtn.onclick = () => wrapper.style.margin = "20px auto";

        const rightBtn = document.createElement("button");
        rightBtn.innerHTML = `<i class="fas fa-align-right"></i>`;
        rightBtn.onclick = () => wrapper.style.margin = "20px 0 20px auto";

        controls.append(leftBtn, centerBtn, rightBtn, deleteBtn);
        return controls;
    }

    setupEvents(wrapper, image) {
        image.addEventListener("click", () => {
            document.querySelectorAll(".image-block").forEach(b => {
                b.classList.remove("selected-media");
            });
            wrapper.classList.add("selected-media");
        });

        image.addEventListener("dblclick", () => {
            this.openFullscreen(image.src);
        });
    }

    openFullscreen(src) {
        const overlay = document.createElement("div");
        overlay.className = "image-fullscreen";
        overlay.innerHTML = `
            <img src="${src}">
            <button class="close-fullscreen">✖</button>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector(".close-fullscreen").onclick = () => overlay.remove();
        overlay.onclick = e => {
            if (e.target === overlay) overlay.remove();
        };
    }
}

/* =========================================================
   INITIALIZE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    if (editor) {
        window.imageBlock = new ImageBlock(editor);
    }
});