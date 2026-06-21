/* =========================================================
   EXCEL YOU IMAGE RESIZE SYSTEM - DRAG COMPATIBLE
========================================================= */
class ImageResizeManager {
    constructor(editor) {
        this.editor = editor;
        this.activeImage = null;
        this.activeWrapper = null;
        this.startX = 0;
        this.startWidth = 0;
        this.isResizing = false;
        this.init();
    }

    init() {
        this.setupImageSelection();
        this.setupResizeEvents();
        console.log("Image Resize Manager Initialized ✔");
    }

    setupImageSelection() {
        this.editor.addEventListener("click", e => {
            // Ignore clicks during dragging
            if (document.body.classList.contains("editor-dragging")) return;

            const image = e.target.closest(".editor-image");
            if (!image) return;

            const wrapper = image.closest(".image-block");
            if (!wrapper) return;

            this.removeResizeHandles();

            this.activeImage = image;
            this.activeWrapper = wrapper;
            wrapper.classList.add("image-selected");

            this.createResizeHandles(wrapper);
        });

        // Outside click remove
        document.addEventListener("click", e => {
            if (!e.target.closest(".image-block")) {
                this.removeResizeHandles();
            }
        });
    }

    createResizeHandles(wrapper) {
        const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];

        positions.forEach(position => {
            const handle = document.createElement("div");
            handle.className = `resize-handle ${position}`;
            handle.draggable = false;           // Important
            wrapper.appendChild(handle);

            handle.addEventListener("mousedown", e => {
                e.stopImmediatePropagation();   // Prevent drag conflict
                this.startResize(e, wrapper);
            });
        });
    }

    removeResizeHandles() {
        document.querySelectorAll(".resize-handle").forEach(handle => handle.remove());
        document.querySelectorAll(".image-selected").forEach(block => {
            block.classList.remove("image-selected");
        });
        this.activeImage = null;
        this.activeWrapper = null;
    }

    startResize(e, wrapper) {
        e.preventDefault();
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = wrapper.offsetWidth;
        document.body.style.cursor = "nwse-resize";
    }

    setupResizeEvents() {
        document.addEventListener("mousemove", e => {
            if (!this.isResizing || !this.activeWrapper) return;

            const dx = e.clientX - this.startX;
            let newWidth = this.startWidth + dx;

            if (newWidth < 150) newWidth = 150;
            if (newWidth > this.editor.offsetWidth - 40) {
                newWidth = this.editor.offsetWidth - 40;
            }

            this.activeWrapper.style.width = `${newWidth}px`;
        });

        document.addEventListener("mouseup", () => {
            if (this.isResizing) {
                this.isResizing = false;
                document.body.style.cursor = "default";
            }
        });
    }
}

/* =========================================================
   INITIALIZE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    if (editor) {
        window.imageResizeManager = new ImageResizeManager(editor);
    }
});