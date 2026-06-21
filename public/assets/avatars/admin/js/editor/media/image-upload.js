/* =========================================================
   EXCEL YOU IMAGE UPLOAD SYSTEM
========================================================= */

class ImageUploadManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarUpload();

        this.setupDragDrop();

        console.log(
            "Image Upload Manager Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR IMAGE BUTTON
    ===================================================== */

    setupToolbarUpload() {

        const imageBtn =
            document.getElementById(
                "imageUploadBtn"
            );

        if (!imageBtn) {
            return;
        }

        imageBtn.addEventListener(
            "click",
            () => {

                this.openFilePicker();
            }
        );
    }

    /* =====================================================
       OPEN FILE PICKER
    ===================================================== */

    openFilePicker() {

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

                this.insertImage(file);
            }
        );
    }

    /* =====================================================
       INSERT IMAGE
    ===================================================== */

    insertImage(file) {

        // Validate image
        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Invalid image file"
            );

            return;
        }

        const reader =
            new FileReader();

        reader.onload = e => {

            const imageUrl =
                e.target.result;

            this.createImageBlock(
                imageUrl
            );
        };

        reader.readAsDataURL(file);
    }

    /* =====================================================
       CREATE IMAGE BLOCK
    ===================================================== */

    createImageBlock(src) {

        // Main wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block media-block image-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // Image
        const img =
            document.createElement(
                "img"
            );

        img.src = src;

        img.className =
            "editor-image";

        // Controls
        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "media-controls";

        // Delete button
        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.innerHTML =
            `<i class="fas fa-trash"></i>`;

        deleteBtn.className =
            "media-delete-btn";

        deleteBtn.addEventListener(
            "click",
            () => {

                wrapper.remove();
            }
        );

        // Append
        controls.appendChild(
            deleteBtn
        );

        wrapper.appendChild(img);

        wrapper.appendChild(
            controls
        );

        // Add to editor
        this.editor.appendChild(
            wrapper
        );

        // Auto scroll
        wrapper.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        console.log(
            "Image inserted ✔"
        );
    }

    /* =====================================================
       DRAG DROP
    ===================================================== */

    setupDragDrop() {

        this.editor.addEventListener(
            "dragover",
            e => {

                e.preventDefault();
            }
        );

        this.editor.addEventListener(
            "drop",
            e => {

                e.preventDefault();

                const files =
                    e.dataTransfer.files;

                if (!files.length) {
                    return;
                }

                Array.from(files)
                    .forEach(file => {

                        if (
                            file.type.startsWith(
                                "image/"
                            )
                        ) {

                            this.insertImage(
                                file
                            );
                        }
                    });
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

        window.imageUploadManager =
            new ImageUploadManager(
                editor
            );
    }
);
