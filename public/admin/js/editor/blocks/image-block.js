/* =========================================================
   EXCEL YOU IMAGE BLOCK
========================================================= */

class ImageBlock {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        console.log(
            "Image Block Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const imageBtn =
            document.getElementById(
                "imageBtn"
            );

        if (!imageBtn) {
            return;
        }

        imageBtn.addEventListener(
            "click",
            () => {

                this.openImagePicker();
            }
        );
    }

    /* =====================================================
       IMAGE PICKER
    ===================================================== */

    openImagePicker() {

        const input =
            document.createElement(
                "input"
            );

        input.type = "file";

        input.accept =
            "image/*";

        input.click();

        input.addEventListener(
            "change",
            e => {

                const file =
                    e.target.files[0];

                if (!file) {
                    return;
                }

                this.insertImage(
                    file
                );
            }
        );
    }

    /* =====================================================
       INSERT IMAGE
    ===================================================== */

    insertImage(file) {

        const reader =
            new FileReader();

        reader.onload = e => {

            const imageUrl =
                e.target.result;

            const block =
                this.createImageBlock(
                    imageUrl
                );

           const selection =
    window.getSelection();

if (
    selection.rangeCount > 0
) {

    const range =
        selection.getRangeAt(0);

    range.insertNode(block);

} else {

    this.editor.appendChild(
        block
    );
}
            block.scrollIntoView({

                behavior: "smooth",

                block: "center"
            });

            // Save to media library
            if (
                window.mediaLibrary
            ) {

                window.mediaLibrary
                    .addMedia({

                        type: "image",

                        name: file.name,

                        url: imageUrl,

                        size: file.size
                    });
            }
        };

        reader.readAsDataURL(
            file
        );
    }

    /* =====================================================
       CREATE BLOCK
    ===================================================== */

    createImageBlock(src) {

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

    wrapper.className =
    "editor-block image-block media-block";

wrapper.draggable = true;

/* =========================
   BLOCK IDENTIFIER
========================= */

wrapper.dataset.blockType =
    "image";

wrapper.dataset.blockId =
    "img_" +
    Date.now() +
    "_" +
    Math.random()
        .toString(36)
        .substring(2, 8);

/* =========================
   DRAG HANDLE SUPPORT
========================= */

wrapper.setAttribute(
    "data-draggable",
    "true"
);

        // Image
        const image =
            document.createElement(
                "img"
            );

        image.src = src;

        image.className =
            "editor-image";

        image.draggable = false;

        // Controls
        const controls =
            this.createControls(
                wrapper,
                image
            );

        // Caption
        const caption =
            document.createElement(
                "div"
            );

        caption.className =
            "image-caption";

        caption.contentEditable =
            "true";

        caption.innerHTML =
            "Write caption...";

        // Append
        wrapper.appendChild(
            controls
        );

        wrapper.appendChild(
            image
        );

        wrapper.appendChild(
            caption
        );

        // Events
        this.setupEvents(
            wrapper,
            image
        );

        return wrapper;
    }

    /* =====================================================
       CONTROLS
    ===================================================== */

    createControls(
        wrapper,
        image
    ) {

        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "media-controls";

        // Crop
        const cropBtn =
            document.createElement(
                "button"
            );

        cropBtn.className =
            "crop-image-btn";

        cropBtn.innerHTML =
            `<i class="fas fa-crop"></i>`;

        // Delete
        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.className =
            "media-delete-btn";

        deleteBtn.innerHTML =
            `<i class="fas fa-trash"></i>`;

        deleteBtn.addEventListener(
            "click",
            () => {

                const confirmDelete =
                    confirm(
                        "Delete image?"
                    );

                if (
                    !confirmDelete
                ) {
                    return;
                }

                wrapper.remove();
            }
        );

        // Align Left
        const leftBtn =
            document.createElement(
                "button"
            );

        leftBtn.innerHTML =
            `<i class="fas fa-align-left"></i>`;

        leftBtn.onclick = () => {

            wrapper.style.margin =
                "20px auto 20px 0";
        };

        // Center
        const centerBtn =
            document.createElement(
                "button"
            );

        centerBtn.innerHTML =
            `<i class="fas fa-align-center"></i>`;

        centerBtn.onclick = () => {

            wrapper.style.margin =
                "20px auto";
        };

        // Right
        const rightBtn =
            document.createElement(
                "button"
            );

        rightBtn.innerHTML =
            `<i class="fas fa-align-right"></i>`;

        rightBtn.onclick = () => {

            wrapper.style.margin =
                "20px 0 20px auto";
        };

        // Append
        controls.appendChild(
            cropBtn
        );

        controls.appendChild(
            leftBtn
        );

        controls.appendChild(
            centerBtn
        );

        controls.appendChild(
            rightBtn
        );

        controls.appendChild(
            deleteBtn
        );

        return controls;
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupEvents(
        wrapper,
        image
    ) {

        // =========================
        // CLICK SELECT
        // =========================
        image.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".image-block"
                    )
                    .forEach(block => {

                        block.classList.remove(
                            "selected-media"
                        );
                    });

                wrapper.classList.add(
                    "selected-media"
                );
            }
        );

        // =========================
        // DOUBLE CLICK FULL VIEW
        // =========================
        image.addEventListener(
            "dblclick",
            () => {

                this.openFullscreen(
                    image.src
                );
            }
        );
    }

    /* =====================================================
       FULLSCREEN VIEW
    ===================================================== */

    openFullscreen(src) {

        const overlay =
            document.createElement(
                "div"
            );

        overlay.className =
            "image-fullscreen";

        overlay.innerHTML = `

            <img src="${src}">

            <button
            class="close-fullscreen">

                ✖

            </button>
        `;

        document.body.appendChild(
            overlay
        );

        overlay.querySelector(
            ".close-fullscreen"
        ).onclick = () => {

            overlay.remove();
        };

        overlay.onclick = e => {

            if (
                e.target === overlay
            ) {

                overlay.remove();
            }
        };
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

        window.imageBlock =
            new ImageBlock(
                editor
            );
    }
);
