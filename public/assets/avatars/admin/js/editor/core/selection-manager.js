/* =========================================================
   EXCEL YOU SELECTION MANAGER
========================================================= */

class SelectionManager {

    constructor(editor) {

        this.editor = editor;

        // Current selected block
        this.selectedBlock = null;

        // Current selected media
        this.selectedMedia = null;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupSelection();

        this.setupKeyboardDelete();

        this.setupOutsideClick();

        console.log(
            "Selection Manager Initialized ✔"
        );
    }

    /* =====================================================
       BLOCK SELECTION
    ===================================================== */

    setupSelection() {

        this.editor.addEventListener(
            "click",
            e => {

                // Find nearest media block
                const mediaBlock =
                    e.target.closest(
                        ".media-block"
                    );

                // Find nearest editor block
                const editorBlock =
                    e.target.closest(
                        ".editor-block"
                    );

                // Clear all previous selections
                this.clearSelections();

                // =========================
                // MEDIA SELECT
                // =========================
                if (mediaBlock) {

                    mediaBlock.classList.add(
                        "selected-media"
                    );

                    this.selectedMedia =
                        mediaBlock;

                    console.log(
                        "Media selected"
                    );

                    return;
                }

                // =========================
                // BLOCK SELECT
                // =========================
                if (editorBlock) {

                    editorBlock.classList.add(
                        "selected-block"
                    );

                    this.selectedBlock =
                        editorBlock;

                    console.log(
                        "Block selected"
                    );
                }
            }
        );
    }

    /* =====================================================
       CLEAR SELECTIONS
    ===================================================== */

    clearSelections() {

        // Remove all selected block styles
        document
            .querySelectorAll(
                ".selected-block"
            )
            .forEach(block => {

                block.classList.remove(
                    "selected-block"
                );
            });

        // Remove all selected media styles
        document
            .querySelectorAll(
                ".selected-media"
            )
            .forEach(media => {

                media.classList.remove(
                    "selected-media"
                );
            });

        this.selectedBlock = null;

        this.selectedMedia = null;
    }

    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    setupOutsideClick() {

        document.addEventListener(
            "click",
            e => {

                const insideEditor =
                    e.target.closest(
                        "#editor"
                    );

                if (!insideEditor) {

                    this.clearSelections();
                }
            }
        );
    }

    /* =====================================================
       KEYBOARD DELETE
    ===================================================== */

    setupKeyboardDelete() {

        document.addEventListener(
            "keydown",
            e => {

                // Ignore typing fields
                const active =
                    document.activeElement;

                if (
                    active &&
                    (
                        active.tagName === "INPUT" ||
                        active.tagName === "TEXTAREA"
                    )
                ) {
                    return;
                }

                // =========================
                // DELETE MEDIA
                // =========================
                if (
                    (
                        e.key === "Delete" ||
                        e.key === "Backspace"
                    ) &&
                    this.selectedMedia
                ) {

                    e.preventDefault();

                    this.deleteSelectedMedia();
                }

                // =========================
                // DELETE BLOCK
                // =========================
                if (
                    (
                        e.key === "Delete" ||
                        e.key === "Backspace"
                    ) &&
                    this.selectedBlock
                ) {

                    // Prevent deleting editor root
                    if (
                        this.selectedBlock.id ===
                        "editor"
                    ) {
                        return;
                    }

                    e.preventDefault();

                    this.deleteSelectedBlock();
                }
            }
        );
    }

    /* =====================================================
       DELETE MEDIA
    ===================================================== */

    deleteSelectedMedia() {

        if (!this.selectedMedia) {
            return;
        }

        this.selectedMedia.remove();

        this.selectedMedia = null;

        console.log(
            "Media deleted ✔"
        );
    }

    /* =====================================================
       DELETE BLOCK
    ===================================================== */

    deleteSelectedBlock() {

        if (!this.selectedBlock) {
            return;
        }

        this.selectedBlock.remove();

        this.selectedBlock = null;

        console.log(
            "Block deleted ✔"
        );
    }

    /* =====================================================
       GET SELECTED
    ===================================================== */

    getSelectedBlock() {

        return this.selectedBlock;
    }

    getSelectedMedia() {

        return this.selectedMedia;
    }

    /* =====================================================
       FORCE SELECT
    ===================================================== */

    selectBlock(block) {

        this.clearSelections();

        block.classList.add(
            "selected-block"
        );

        this.selectedBlock = block;
    }

    selectMedia(media) {

        this.clearSelections();

        media.classList.add(
            "selected-media"
        );

        this.selectedMedia = media;
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

const selectionManager =
    new SelectionManager(
        document.getElementById(
            "editor"
        )
    );
