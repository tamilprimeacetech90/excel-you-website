/* =========================================================
   EXCEL YOU FILE BLOCK
========================================================= */

class FileBlock {

    constructor(editor) {

        this.editor = editor;

        this.allowedExtensions = [

            "pdf",
            "doc",
            "docx",
            "ppt",
            "pptx",
            "xls",
            "xlsx",
            "zip",
            "rar",
            "txt"
        ];

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        console.log(
            "File Block Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const fileBtn =
            document.getElementById(
                "fileBtn"
            );

        if (!fileBtn) {
            return;
        }

        fileBtn.addEventListener(
            "click",
            () => {

                this.openFilePicker();
            }
        );
    }

    /* =====================================================
       FILE PICKER
    ===================================================== */

    openFilePicker() {

        const input =
            document.createElement(
                "input"
            );

        input.type = "file";

        input.click();

        input.addEventListener(
            "change",
            e => {

                const file =
                    e.target.files[0];

                if (!file) {
                    return;
                }

                this.validateAndInsert(
                    file
                );
            }
        );
    }

    /* =====================================================
       VALIDATE
    ===================================================== */

    validateAndInsert(file) {

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        if (
            !this.allowedExtensions
                .includes(extension)
        ) {

            alert(
                "Unsupported file type"
            );

            return;
        }

        this.insertFile(
            file
        );
    }

    /* =====================================================
       INSERT FILE
    ===================================================== */

    insertFile(file) {

        const reader =
            new FileReader();

        reader.onload = e => {

            const fileUrl =
                e.target.result;

            const block =
                this.createFileBlock({

                    name: file.name,

                    size: file.size,

                    type: file.type,

                    url: fileUrl
                });

            this.editor.appendChild(
                block
            );

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

                        type: "file",

                        name: file.name,

                        url: fileUrl,

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

    createFileBlock(file) {

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block file-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // File Icon
        const icon =
            this.getFileIcon(
                file.name
            );

        // File Size
        const size =
            this.formatFileSize(
                file.size
            );

        // HTML
        wrapper.innerHTML = `

<div class="file-card">

    <div class="file-left">

        <div class="file-icon">

            <i class="${icon}"></i>

        </div>

        <div class="file-info">

            <h4>
                ${file.name}
            </h4>

            <p>
                ${size}
            </p>

        </div>

    </div>

    <div class="file-actions">

        <a
        href="${file.url}"
        download="${file.name}"
        class="download-file-btn">

            <i class="fas fa-download"></i>

        </a>

        <button
        class="delete-file-btn">

            <i class="fas fa-trash"></i>

        </button>

    </div>

</div>

<div
class="file-caption"
contenteditable="true">

    File description...

</div>

        `;

        // Events
        this.setupEvents(
            wrapper
        );

        return wrapper;
    }

    /* =====================================================
       FILE ICON
    ===================================================== */

    getFileIcon(name) {

        const ext =
            name
                .split(".")
                .pop()
                .toLowerCase();

        switch (ext) {

            case "pdf":
                return "fas fa-file-pdf";

            case "doc":
            case "docx":
                return "fas fa-file-word";

            case "xls":
            case "xlsx":
                return "fas fa-file-excel";

            case "ppt":
            case "pptx":
                return "fas fa-file-powerpoint";

            case "zip":
            case "rar":
                return "fas fa-file-zipper";

            case "txt":
                return "fas fa-file-lines";

            default:
                return "fas fa-file";
        }
    }

    /* =====================================================
       FILE SIZE
    ===================================================== */

    formatFileSize(bytes) {

        if (bytes < 1024) {

            return bytes + " B";
        }

        if (bytes < 1024 * 1024) {

            return (
                (bytes / 1024)
                .toFixed(1)
                + " KB"
            );
        }

        return (
            (bytes / 1024 / 1024)
            .toFixed(1)
            + " MB"
        );
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupEvents(wrapper) {

        // =========================
        // DELETE
        // =========================
        const deleteBtn =
            wrapper.querySelector(
                ".delete-file-btn"
            );

        deleteBtn.addEventListener(
            "click",
            () => {

                const confirmDelete =
                    confirm(
                        "Delete file?"
                    );

                if (
                    !confirmDelete
                ) {
                    return;
                }

                wrapper.remove();
            }
        );

        // =========================
        // SELECT
        // =========================
        wrapper.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".file-block"
                    )
                    .forEach(block => {

                        block.classList.remove(
                            "selected-file"
                        );
                    });

                wrapper.classList.add(
                    "selected-file"
                );
            }
        );

        // =========================
        // SAVE FLAG
        // =========================
        wrapper.addEventListener(
            "input",
            () => {

                window.hasUnsavedChanges =
                    true;
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

        window.fileBlock =
            new FileBlock(
                editor
            );
    }
);
