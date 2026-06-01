/* =========================================================
   EXCEL YOU EDITOR CORE
========================================================= */

class ExcelYouEditor {

    constructor(editorId) {

        // Main editor container
        this.editor =
            document.getElementById(editorId);

        // All blocks
        this.blocks = [];

        // Active selected block
        this.activeBlock = null;

        // History stack
        this.history = [];

        // History index
        this.historyIndex = -1;

        // Initialize
        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        if (!this.editor) {

            console.error(
                "Editor container not found"
            );

            return;
        }

        // Add first paragraph block
        this.createParagraphBlock();

        // Editor click
        this.editor.addEventListener(
            "click",
            e => {

                const block =
                    e.target.closest(
                        ".editor-block"
                    );

                if (block) {

                    this.setActiveBlock(
                        block
                    );
                }
            }
        );

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        console.log(
            "EXCEL YOU Editor Initialized ✔"
        );
    }

    /* =====================================================
       CREATE PARAGRAPH BLOCK
    ===================================================== */

    createParagraphBlock(content = "") {

        const block =
            document.createElement("div");

        block.className =
            "editor-block paragraph-block";

        block.innerHTML = `
            <div
                class="editable"
                contenteditable="true"
                spellcheck="true"
            >${content}</div>
        `;

        // Add block
        this.editor.appendChild(block);

        // Save internally
        this.blocks.push(block);

        // Focus
        const editable =
            block.querySelector(
                ".editable"
            );

        editable.focus();

        // Listen input
        editable.addEventListener(
            "input",
            () => {

                this.saveHistory();
            }
        );

        return block;
    }

    /* =====================================================
       CREATE IMAGE BLOCK
    ===================================================== */

    createImageBlock(src) {

        const block =
            document.createElement("div");

        block.className =
            "editor-block image-block";

        block.innerHTML = `
            <div class="media-wrapper">

                <img
                    src="${src}"
                    class="editor-image"
                    draggable="false"
                >

                <div class="media-actions">

                    <button
                        class="delete-media-btn">

                        <i class="fas fa-trash"></i>

                    </button>

                </div>

            </div>
        `;

        this.editor.appendChild(block);

        this.blocks.push(block);

        // Delete image
        const deleteBtn =
            block.querySelector(
                ".delete-media-btn"
            );

        deleteBtn.addEventListener(
            "click",
            () => {

                this.deleteBlock(block);
            }
        );

        return block;
    }

    /* =====================================================
       CREATE VIDEO BLOCK
    ===================================================== */

    createVideoBlock(videoUrl) {

        const block =
            document.createElement("div");

        block.className =
            "editor-block video-block";

        block.innerHTML = `
            <div class="media-wrapper">

                <iframe
                    src="${videoUrl}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>

                <div class="media-actions">

                    <button
                        class="delete-media-btn">

                        <i class="fas fa-trash"></i>

                    </button>

                </div>

            </div>
        `;

        this.editor.appendChild(block);

        this.blocks.push(block);

        // Delete
        const deleteBtn =
            block.querySelector(
                ".delete-media-btn"
            );

        deleteBtn.addEventListener(
            "click",
            () => {

                this.deleteBlock(block);
            }
        );

        return block;
    }

    /* =====================================================
       DELETE BLOCK
    ===================================================== */

    deleteBlock(block) {

        if (!block) return;

        block.remove();

        this.blocks =
            this.blocks.filter(
                b => b !== block
            );

        this.saveHistory();
    }

    /* =====================================================
       ACTIVE BLOCK
    ===================================================== */

    setActiveBlock(block) {

        document
            .querySelectorAll(
                ".editor-block"
            )
            .forEach(b => {

                b.classList.remove(
                    "active-block"
                );
            });

        block.classList.add(
            "active-block"
        );

        this.activeBlock = block;
    }

    /* =====================================================
       SAVE HISTORY
    ===================================================== */

    saveHistory() {

        const snapshot =
            this.editor.innerHTML;

        this.history.push(snapshot);

        this.historyIndex =
            this.history.length - 1;
    }

    /* =====================================================
       UNDO
    ===================================================== */

    undo() {

        if (
            this.historyIndex <= 0
        ) {
            return;
        }

        this.historyIndex--;

        this.editor.innerHTML =
            this.history[
                this.historyIndex
            ];
    }

    /* =====================================================
       REDO
    ===================================================== */

    redo() {

        if (
            this.historyIndex >=
            this.history.length - 1
        ) {
            return;
        }

        this.historyIndex++;

        this.editor.innerHTML =
            this.history[
                this.historyIndex
            ];
    }

    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    setupKeyboardShortcuts() {

        document.addEventListener(
            "keydown",
            e => {

                // Undo
                if (
                    e.ctrlKey &&
                    e.key === "z"
                ) {

                    e.preventDefault();

                    this.undo();
                }

                // Redo
                if (
                    e.ctrlKey &&
                    e.key === "y"
                ) {

                    e.preventDefault();

                    this.redo();
                }
            }
        );
    }

    /* =====================================================
       EXPORT JSON
    ===================================================== */

    exportJSON() {

        const data = [];

        this.editor
            .querySelectorAll(
                ".editor-block"
            )
            .forEach(block => {

                // Paragraph
                if (
                    block.classList.contains(
                        "paragraph-block"
                    )
                ) {

                    data.push({

                        type: "paragraph",

                        content:
                            block.querySelector(
                                ".editable"
                            ).innerHTML
                    });
                }

                // Image
                if (
                    block.classList.contains(
                        "image-block"
                    )
                ) {

                    data.push({

                        type: "image",

                        src:
                            block.querySelector(
                                "img"
                            ).src
                    });
                }

                // Video
                if (
                    block.classList.contains(
                        "video-block"
                    )
                ) {

                    data.push({

                        type: "video",

                        src:
                            block.querySelector(
                                "iframe"
                            ).src
                    });
                }
            });

        return data;
    }
}


