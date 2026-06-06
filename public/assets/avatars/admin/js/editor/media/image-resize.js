/* =========================================================
   EXCEL YOU IMAGE RESIZE SYSTEM
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

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupImageSelection();

        this.setupResizeEvents();

        console.log(
            "Image Resize Manager Initialized ✔"
        );
    }

    /* =====================================================
       IMAGE SELECTION
    ===================================================== */

    setupImageSelection() {

        this.editor.addEventListener(
            "click",
            e => {

                const image =
                    e.target.closest(
                        ".editor-image"
                    );

                // Remove old handles
                this.removeResizeHandles();

                if (!image) {
                    return;
                }

                const wrapper =
                    image.closest(
                        ".image-block"
                    );

                if (!wrapper) {
                    return;
                }

                this.activeImage =
                    image;

                this.activeWrapper =
                    wrapper;

                wrapper.classList.add(
                    "image-selected"
                );

                this.createResizeHandles(
                    wrapper
                );
            }
        );

        // Outside click remove
        document.addEventListener(
            "click",
            e => {

                const inside =
                    e.target.closest(
                        ".image-block"
                    );

                if (!inside) {

                    this.removeResizeHandles();
                }
            }
        );
    }

    /* =====================================================
       CREATE HANDLES
    ===================================================== */

    createResizeHandles(wrapper) {

        const positions = [

            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
        ];

        positions.forEach(position => {

            const handle =
                document.createElement(
                    "div"
                );

            handle.className =
                `resize-handle ${position}`;

            wrapper.appendChild(
                handle
            );

            handle.addEventListener(
                "mousedown",
                e => {

                    this.startResize(
                        e,
                        wrapper
                    );
                }
            );
        });
    }

    /* =====================================================
       REMOVE HANDLES
    ===================================================== */

    removeResizeHandles() {

        document
            .querySelectorAll(
                ".resize-handle"
            )
            .forEach(handle => {

                handle.remove();
            });

        document
            .querySelectorAll(
                ".image-selected"
            )
            .forEach(block => {

                block.classList.remove(
                    "image-selected"
                );
            });

        this.activeImage = null;

        this.activeWrapper = null;
    }

    /* =====================================================
       START RESIZE
    ===================================================== */

    startResize(e, wrapper) {

        e.preventDefault();

        this.isResizing = true;

        this.startX =
            e.clientX;

        this.startWidth =
            wrapper.offsetWidth;

        document.body.style.cursor =
            "nwse-resize";
    }

    /* =====================================================
       RESIZE EVENTS
    ===================================================== */

    setupResizeEvents() {

        document.addEventListener(
            "mousemove",
            e => {

                if (
                    !this.isResizing ||
                    !this.activeWrapper
                ) {
                    return;
                }

                const dx =
                    e.clientX -
                    this.startX;

                let newWidth =
                    this.startWidth + dx;

                // Min width
                if (newWidth < 150) {
                    newWidth = 150;
                }

                // Max width
                if (
                    newWidth >
                    this.editor.offsetWidth
                ) {

                    newWidth =
                        this.editor.offsetWidth;
                }

                this.activeWrapper.style.width =
                    `${newWidth}px`;
            }
        );

        document.addEventListener(
            "mouseup",
            () => {

                this.isResizing = false;

                document.body.style.cursor =
                    "default";
            }
        );
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

        window.imageResizeManager =
            new ImageResizeManager(
                editor
            );
    }
);
