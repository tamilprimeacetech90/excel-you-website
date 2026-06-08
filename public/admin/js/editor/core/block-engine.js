/* =========================================================
   EXCEL YOU BLOCK ENGINE
========================================================= */

class BlockEngine {

    constructor(editor) {

        // Main editor instance
        this.editor = editor;

        // Block counter
        this.blockId = 0;

        // Active dragging block
        this.draggingBlock = null;

        // Initialize
        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.enableBlockDragging();

        console.log(
            "Block Engine Initialized ✔"
        );
    }

    /* =====================================================
       GENERATE BLOCK ID
    ===================================================== */

    generateBlockId() {

        this.blockId++;

        return `block-${this.blockId}`;
    }

    /* =====================================================
       CREATE BASE BLOCK
    ===================================================== */

    createBaseBlock(type) {

        const block =
            document.createElement("div");

        block.className =
            `editor-block ${type}-block`;

        block.dataset.blockId =
            this.generateBlockId();

        block.dataset.blockType =
            type;

        // Drag enabled
        block.draggable = true;

        // Add controls
        this.addBlockControls(block);

        return block;
    }

    /* =====================================================
       BLOCK CONTROLS
    ===================================================== */

    addBlockControls(block) {

        const controls =
            document.createElement("div");

        controls.className =
            "block-controls";

        controls.innerHTML = `

            <button
                class="block-btn drag-btn"
                title="Drag">

                <i class="fas fa-grip-vertical"></i>

            </button>

            <button
                class="block-btn delete-btn"
                title="Delete">

                <i class="fas fa-trash"></i>

            </button>

        `;

        block.appendChild(controls);

        // Delete block
        controls
            .querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => {

                    this.deleteBlock(block);
                }
            );
    }

    /* =====================================================
       CREATE PARAGRAPH BLOCK
    ===================================================== */

    createParagraphBlock(content = "") {

        const block =
            this.createBaseBlock(
                "paragraph"
            );

        const editable =
            document.createElement("div");

        editable.className =
            "editable";

        editable.contentEditable =
            "true";

        editable.spellcheck = true;

        editable.innerHTML =
            content || "<p><br></p>";

        block.appendChild(editable);

        this.editor.appendChild(block);

        editable.focus();

        return block;
    }

    /* =====================================================
       CREATE HEADING BLOCK
    ===================================================== */

    createHeadingBlock(content = "Heading") {

        const block =
            this.createBaseBlock(
                "heading"
            );

        const heading =
            document.createElement("h2");

        heading.className =
            "editable";

        heading.contentEditable =
            "true";

        heading.innerHTML =
            content;

        block.appendChild(heading);

        this.editor.appendChild(block);

        heading.focus();

        return block;
    }

/* =====================================================
   CREATE IMAGE BLOCK
===================================================== */

createImageBlock(src) {

    const block =
        this.createBaseBlock(
            "image"
        );

    block.innerHTML += `

        <div class="image-container">

            <img
                src="${src}"
                class="editor-image"
                draggable="false"
            >

            <div
                class="resize-handle">
            </div>

        </div>

    `;

    this.insertBlockAtCursor(
        block
    );

    return block;
}

/* =====================================================
   CREATE VIDEO BLOCK
===================================================== */

createVideoBlock(videoUrl) {

    const block =
        this.createBaseBlock(
            "video"
        );

    block.innerHTML += `

        <div class="video-container">

            <iframe
                src="${videoUrl}"
                frameborder="0"
                allowfullscreen>
            </iframe>

        </div>

    `;

    this.insertBlockAtCursor(
        block
    );

    return block;
}

/* =====================================================
   INSERT BLOCK AT CURSOR
===================================================== */

insertBlockAtCursor(block) {

    const selection =
        window.getSelection();

    if (
        selection &&
        selection.rangeCount > 0
    ) {

        const range =
            selection.getRangeAt(0);

        const currentBlock =
            range.startContainer
                .parentElement
                ?.closest(
                    ".editor-block"
                );

        if (currentBlock) {

            currentBlock.after(
                block
            );

            return;
        }
    }

    this.editor.appendChild(
        block
    );
}


    /* =====================================================
       CREATE FILE BLOCK
    ===================================================== */

    createFileBlock(fileName, fileUrl) {

        const block =
            this.createBaseBlock(
                "file"
            );

        block.innerHTML += `

            <div class="file-container">

                <i class="fas fa-file"></i>

                <a
                    href="${fileUrl}"
                    target="_blank">

                    ${fileName}

                </a>

            </div>

        `;

        this.editor.appendChild(block);

        return block;
    }

    /* =====================================================
       DELETE BLOCK
    ===================================================== */

    deleteBlock(block) {

        if (!block) return;

        // Animation
        block.style.opacity = "0";

        block.style.transform =
            "scale(.9)";

        setTimeout(() => {

            block.remove();

        }, 200);
    }

    /* =====================================================
       DUPLICATE BLOCK
    ===================================================== */

    duplicateBlock(block) {

        const clone =
            block.cloneNode(true);

        clone.dataset.blockId =
            this.generateBlockId();

        this.editor.insertBefore(
            clone,
            block.nextSibling
        );
    }

    /* =====================================================
       MOVE BLOCK UP
    ===================================================== */

    moveBlockUp(block) {

        const previous =
            block.previousElementSibling;

        if (!previous) return;

        this.editor.insertBefore(
            block,
            previous
        );
    }

    /* =====================================================
       MOVE BLOCK DOWN
    ===================================================== */

    moveBlockDown(block) {

        const next =
            block.nextElementSibling;

        if (!next) return;

        this.editor.insertBefore(
            next,
            block
        );
    }
    /* =====================================================
       DRAG POSITION
    ===================================================== */

    getDragAfterElement(y) {

        const draggableElements =
            [
                ...this.editor.querySelectorAll(
                    ".editor-block:not(.dragging)"
                )
            ];

        return draggableElements.reduce(
            (closest, child) => {

                const box =
                    child.getBoundingClientRect();

                const offset =
                    y - box.top -
                    box.height / 2;

                if (
                    offset < 0 &&
                    offset > closest.offset
                ) {

                    return {

                        offset,
                        element: child
                    };
                }
                else {

                    return closest;
                }

            },
            {
                offset:
                    Number.NEGATIVE_INFINITY
            }
        ).element;
    }

    /* =====================================================
       EXPORT BLOCKS
    ===================================================== */

    exportBlocks() {

        const blocks = [];

        document
            .querySelectorAll(
                ".editor-block"
            )
            .forEach(block => {

                const type =
                    block.dataset.blockType;

                // Paragraph
                if (
                    type === "paragraph"
                ) {

                    blocks.push({

                        type,

                        content:
                            block.querySelector(
                                ".editable"
                            ).innerHTML
                    });
                }

                // Heading
                if (
                    type === "heading"
                ) {

                    blocks.push({

                        type,

                        content:
                            block.querySelector(
                                ".editable"
                            ).innerHTML
                    });
                }

                // Image
                if (
                    type === "image"
                ) {

                    blocks.push({

                        type,

                        src:
                            block.querySelector(
                                "img"
                            ).src
                    });
                }

                // Video
                if (
                    type === "video"
                ) {

                    blocks.push({

                        type,

                        src:
                            block.querySelector(
                                "iframe"
                            ).src
                    });
                }

                // File
                if (
                    type === "file"
                ) {

                    blocks.push({

                        type,

                        url:
                            block.querySelector(
                                "a"
                            ).href
                    });
                }
            });

        return blocks;
    }
}

/* =========================================================
   INITIALIZE BLOCK ENGINE
========================================================= */

window.blockEngine =
    new BlockEngine(
        document.getElementById(
            "editor"
        )
    );