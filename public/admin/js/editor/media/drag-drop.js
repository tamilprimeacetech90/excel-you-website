/* =========================================================
   EXCEL YOU DRAG DROP SYSTEM - FIXED VERSION
========================================================= */
class DragDropManager {
    constructor(editor) {
        this.editor = editor;
        this.draggedBlock = null;
        this.placeholder = null;
        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */
    init() {
        this.createPlaceholder();
        this.setupDragging();
        this.makeBlocksDraggable();   // ← Important fix
        console.log("Drag Drop Manager Initialized ✔");
    }

    /* =====================================================
       PLACEHOLDER
    ===================================================== */
    createPlaceholder() {
        this.placeholder = document.createElement("div");
        this.placeholder.className = "drag-placeholder";
    }

    /* =====================================================
       MAKE BLOCKS DRAGGABLE + DISABLE NATIVE IMAGE DRAG
    ===================================================== */
    makeBlocksDraggable() {
        const applyDragSettings = () => {
            // Make all editor blocks draggable
            this.editor.querySelectorAll('.editor-block').forEach(block => {
                block.draggable = true;
            });

            // Prevent images and videos from triggering native browser drag (copy)
            this.editor.querySelectorAll('img, video').forEach(media => {
                media.draggable = false;
            });
        };

        // Apply immediately
        applyDragSettings();

        // Watch for new blocks added dynamically
        const observer = new MutationObserver(applyDragSettings);
        observer.observe(this.editor, { 
            childList: true, 
            subtree: true 
        });
    }

    /* =====================================================
       MAIN EVENTS
    ===================================================== */
    setupDragging() {
       /* =========================================
   DRAG START - FIXED
========================================= */
this.editor.addEventListener("dragstart", e => {
    // Ignore caption editing
    if (e.target.closest(".image-caption, .video-caption")) {
        return;
    }

    // Find the block (works even if user drags on image)
    const block = e.target.closest(".editor-block");
    if (!block) return;

    // === CRITICAL FIX: Stop native image copying ===
    if (e.target.tagName === "IMG" || 
        e.target.tagName === "VIDEO" || 
        e.target.closest("img, video, iframe")) {
        e.preventDefault();   // This stops the browser from copying the image
    }

    this.draggedBlock = block;
    block.classList.add("dragging");
    block.style.opacity = "0.5";
    document.body.classList.add("editor-dragging");
    e.dataTransfer.effectAllowed = "move";
});
        /* =========================================
           DRAG OVER
        ========================================= */
        this.editor.addEventListener("dragover", e => {
            e.preventDefault();
            this.editor.classList.add("drag-over");

            if (!this.draggedBlock) return;

            const afterBlock = this.getDragAfterElement(e.clientY);

            if (this.placeholder.parentNode) {
                this.placeholder.remove();
            }

            if (afterBlock === null) {
                this.editor.appendChild(this.placeholder);
            } else {
                this.editor.insertBefore(this.placeholder, afterBlock);
            }
        });

        /* =========================================
           DRAG LEAVE
        ========================================= */
        this.editor.addEventListener("dragleave", () => {
            this.editor.classList.remove("drag-over");
        });

        /* =========================================
           DROP
        ========================================= */
        this.editor.addEventListener("drop", e => {
            e.preventDefault();
            this.editor.classList.remove("drag-over");

            // Desktop file drop (images, videos, etc.)
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
                document.dispatchEvent(
                    new CustomEvent("editor-file-drop", {
                        detail: {
                            files: e.dataTransfer.files,
                            x: e.clientX,
                            y: e.clientY
                        }
                    })
                );
                return;
            }

            // Block reordering
            if (!this.draggedBlock) return;

            if (this.placeholder.parentNode) {
                this.editor.insertBefore(this.draggedBlock, this.placeholder);
                this.placeholder.remove();
            }

            console.log("Block dropped ✔");
            document.dispatchEvent(new CustomEvent("editor-block-reordered"));
        });

        /* =========================================
           DRAG END
        ========================================= */
        this.editor.addEventListener("dragend", () => {
            this.editor.classList.remove("drag-over");
            document.body.classList.remove("editor-dragging");

            if (this.draggedBlock) {
                this.draggedBlock.classList.remove("dragging");
                this.draggedBlock.style.opacity = "";
            }

            if (this.placeholder.parentNode) {
                this.placeholder.remove();
            }

            this.draggedBlock = null;
        });
    }

    /* =====================================================
       FIND DROP POSITION
    ===================================================== */
    getDragAfterElement(y) {
        const draggableElements = [
            ...this.editor.querySelectorAll(".editor-block:not(.dragging)")
        ];

        let closest = {
            offset: Number.NEGATIVE_INFINITY,
            element: null
        };

        draggableElements.forEach(element => {
            const box = element.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                closest = { offset, element };
            }
        });

        return closest.element;
    }
}

/* =========================================================
   INITIALIZE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("editor");
    if (!editor) return;

    window.dragDropManager = new DragDropManager(editor);
});