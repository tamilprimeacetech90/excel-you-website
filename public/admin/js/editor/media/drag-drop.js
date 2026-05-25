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

        this.setupDragging();

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
    }

    /* =====================================================
       MAIN DRAGGING
    ===================================================== */

    setupDragging() {

        // =========================
        // DRAG START
        // =========================
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

                e.dataTransfer.effectAllowed =
                    "move";

                console.log(
                    "Dragging started"
                );
            }
        );

        // =========================
        // DRAG OVER
        // =========================
        this.editor.addEventListener(
            "dragover",
            e => {

                e.preventDefault();

                const afterBlock =
                    this.getDragAfterElement(
                        e.clientY
                    );

                if (!this.draggedBlock) {
                    return;
                }

                // Remove old placeholder
                if (
                    this.placeholder.parentNode
                ) {

                    this.placeholder.remove();
                }

                if (!afterBlock) {

                    this.editor.appendChild(
                        this.placeholder
                    );
                }
                else {

                    this.editor.insertBefore(
                        this.placeholder,
                        afterBlock
                    );
                }
            }
        );

        // =========================
        // DROP
        // =========================
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
                    "Block dropped ✔"
                );
            }
        );

        // =========================
        // DRAG END
        // =========================
        this.editor.addEventListener(
            "dragend",
            () => {

                if (
                    this.draggedBlock
                ) {

                    this.draggedBlock
                        .classList.remove(
                            "dragging"
                        );
                }

                if (
                    this.placeholder.parentNode
                ) {

                    this.placeholder.remove();
                }

                this.draggedBlock =
                    null;

                console.log(
                    "Dragging ended"
                );
            }
        );
    }

    /* =====================================================
       FIND POSITION
    ===================================================== */

    getDragAfterElement(y) {

        const draggableElements =
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

        draggableElements.forEach(
            child => {

                const box =
                    child.getBoundingClientRect();

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
                        element: child
                    };
                }
            }
        );

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
