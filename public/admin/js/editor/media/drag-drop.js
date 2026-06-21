/* =========================================================
   EXCEL YOU DRAG DROP SYSTEM
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

        this.observeBlocks();

        this.bindEvents();

        console.log(
            "Drag Drop Manager Initialized ✔"
        );
    }

    /* =====================================================
       PLACEHOLDER
    ===================================================== */

    createPlaceholder() {

        this.placeholder =
            document.createElement(
                "div"
            );

        this.placeholder.className =
            "drag-placeholder";

        this.placeholder.style.height =
            "8px";

        this.placeholder.style.margin =
            "12px 0";

        this.placeholder.style.borderRadius =
            "4px";

        this.placeholder.style.background =
            "#3b82f6";
    }

    /* =====================================================
       MAKE BLOCKS DRAGGABLE
    ===================================================== */

    observeBlocks() {

        const updateBlocks = () => {

            this.editor
                .querySelectorAll(
                    ".editor-block"
                )
                .forEach(block => {

                    block.draggable = true;
                });

            this.editor
                .querySelectorAll(
                    "img,iframe,video"
                )
                .forEach(el => {

                    el.draggable = false;
                });
        };

        updateBlocks();

        new MutationObserver(
            updateBlocks
        ).observe(
            this.editor,
            {
                childList: true,
                subtree: true
            }
        );
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {

        /* ==========================
           DRAG START
        ========================== */

        this.editor.addEventListener(
            "dragstart",
            e => {

                const block =
                    e.target.closest(
                        ".editor-block"
                    );

                if (!block) {
                    return;
                }

                this.draggedBlock =
                    block;

                block.classList.add(
                    "dragging"
                );

                block.style.opacity =
                    "0.4";

                e.dataTransfer.effectAllowed =
                    "move";
            }
        );

        /* ==========================
           DRAG OVER
        ========================== */

        this.editor.addEventListener(
            "dragover",
            e => {

                e.preventDefault();

                if (
                    !this.draggedBlock
                ) {
                    return;
                }

                const afterElement =
                    this.getAfterElement(
                        e.clientY
                    );

                if (
                    afterElement
                ) {

                    this.editor.insertBefore(
                        this.placeholder,
                        afterElement
                    );
                }
                else {

                    this.editor.appendChild(
                        this.placeholder
                    );
                }
            }
        );

        /* ==========================
           DROP
        ========================== */

        this.editor.addEventListener(
            "drop",
            e => {

                e.preventDefault();

                if (
                    !this.draggedBlock
                ) {
                    return;
                }

                if (
                    this.placeholder.parentNode
                ) {

                    this.editor.insertBefore(
                        this.draggedBlock,
                        this.placeholder
                    );

                    this.placeholder.remove();
                }

                console.log(
                    "Block moved ✔"
                );
            }
        );

        /* ==========================
           DRAG END
        ========================== */

        this.editor.addEventListener(
            "dragend",
            () => {

                if (
                    this.draggedBlock
                ) {

                    this.draggedBlock.classList.remove(
                        "dragging"
                    );

                    this.draggedBlock.style.opacity =
                        "";
                }

                this.placeholder.remove();

                this.draggedBlock = null;
            }
        );
    }

    /* =====================================================
       FIND POSITION
    ===================================================== */

    getAfterElement(y) {

        const blocks =
            [
                ...this.editor.querySelectorAll(
                    ".editor-block:not(.dragging)"
                )
            ];

        let closest = {

            offset:
                Number.NEGATIVE_INFINITY,

            element:
                null
        };

        blocks.forEach(block => {

            const box =
                block.getBoundingClientRect();

            const offset =
                y -
                box.top -
                box.height / 2;

            if (
                offset < 0 &&
                offset > closest.offset
            ) {

                closest = {

                    offset,
                    element: block
                };
            }
        });

        return closest.element;
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const editor =
            document.getElementById(
                "editor"
            );

        if (!editor) {
            return;
        }

        window.dragDropManager =
            new DragDropManager(
                editor
            );
    }
);