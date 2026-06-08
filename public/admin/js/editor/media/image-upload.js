/* =========================================================
   EXCEL YOU IMAGE UPLOAD SYSTEM - FIXED
========================================================= */
class ImageUploadManager {
    constructor(editor) {
        this.editor = editor;
        this.init();
    }

    init() {
        this.setupToolbarUpload();
        this.setupDragDrop();
        console.log("Image Upload Manager Initialized ✔");
    }

    setupToolbarUpload() {
        const imageBtn = document.getElementById("imageUploadBtn");
        if (!imageBtn) return;

        imageBtn.addEventListener("click", () => {
            this.openFilePicker();
        });
    }

    openFilePicker() {
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
        if (!file.type.startsWith("image/")) {
            alert("Invalid image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            const imageUrl = e.target.result;

            // Prefer BlockEngine if available (best consistency)
            if (window.blockEngine && typeof window.blockEngine.createImageBlock === "function") {
                const block = window.blockEngine.createImageBlock(imageUrl);
                this.insertBlock(block);
            } 
            // Fallback to ImageBlock
            else if (window.imageBlock && typeof window.imageBlock.createImageBlock === "function") {
                const block = window.imageBlock.createImageBlock(imageUrl);
                this.insertBlock(block);
            } 
            else {
                this.createImageBlock(imageUrl);
            }

            // Save to media library
            if (window.mediaLibrary) {
                window.mediaLibrary.addMedia({
                    type: "image",
                    name: file.name,
                    url: imageUrl,
                    size: file.size
                });
            }
        };
        reader.readAsDataURL(file);
    }

    insertBlock(block) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const currentBlock = range.startContainer.parentElement?.closest(".editor-block");
            if (currentBlock) {
                currentBlock.after(block);
                return;
            }
        }
        this.editor.appendChild(block);

        block.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log("Image inserted ✔");
    }

    /* Fallback only if others are missing */
    createImageBlock(src) {
        const wrapper = document.createElement("div");
        wrapper.className = "editor-block media-block image-block";
        wrapper.draggable = true;

        const img = document.createElement("img");
        img.src = src;
        img.className = "editor-image";
        img.draggable = false;

        const controls = document.createElement("div");
        controls.className = "media-controls";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "media-delete-btn";
        deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteBtn.addEventListener("click", () => wrapper.remove());

        controls.appendChild(deleteBtn);
        wrapper.append(img, controls);

        this.insertBlock(wrapper);
    }

    setupDragDrop() {
        this.editor.addEventListener("dragover", e => e.preventDefault());

        this.editor.addEventListener("drop", e => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (!files.length) return;

            Array.from(files).forEach(file => {
                if (file.type.startsWith("image/")) {
                    this.insertImage(file);
                }
            });
        });
    }
}

/* =========================================================
   INITIALIZE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    if (editor) {
        window.imageUploadManager = new ImageUploadManager(editor);
    }
});