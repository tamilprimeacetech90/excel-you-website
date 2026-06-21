/* =========================================================
   EXCEL YOU IMAGE BLOCK - FIXED FOR DRAG
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
        imageBtn.addEventListener("click", () => this.openImagePicker());
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

            // Use BlockEngine as primary source
            if (window.blockEngine) {
                const block = window.blockEngine.createImageBlock(imageUrl);
                this.addCaptionIfMissing(block);
                block.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                console.warn("BlockEngine not found");
                this.editor.appendChild(this.createLegacyImageBlock(imageUrl));
            }

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

    addCaptionIfMissing(block) {
        if (!block.querySelector(".image-caption")) {
            const caption = document.createElement("div");
            caption.className = "image-caption";
            caption.contentEditable = "true";
            caption.innerHTML = "Write caption...";
            block.appendChild(caption);
        }
    }

    /* Legacy fallback */
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

        const controls = this.createControls(wrapper);
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

    createControls(wrapper) {
        const controls = document.createElement("div");
        controls.className = "media-controls";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "media-delete-btn";
        deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete image?")) wrapper.remove();
        });

        controls.appendChild(deleteBtn);
        return controls;
    }

    setupEvents(wrapper, image) {
        image.addEventListener("click", () => {
            document.querySelectorAll(".image-block").forEach(b => b.classList.remove("selected-media"));
            wrapper.classList.add("selected-media");
        });

        image.addEventListener("dblclick", () => this.openFullscreen(image.src));
    }

    openFullscreen(src) {
        const overlay = document.createElement("div");
        overlay.className = "image-fullscreen";
        overlay.innerHTML = `<img src="${src}"><button class="close-fullscreen">✖</button>`;
        document.body.appendChild(overlay);

        overlay.querySelector(".close-fullscreen").onclick = () => overlay.remove();
        overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
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