/* =========================================================
   EXCEL YOU FILE UPLOAD SYSTEM
========================================================= */

class FileUploadManager {

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
            "txt"
        ];

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        this.setupDragDrop();

        console.log(
            "File Upload Manager Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const fileBtn =
            document.getElementById(
                "fileUploadBtn"
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

                this.insertFile(file);
            }
        );
    }

    /* =====================================================
       VALIDATE FILE
    ===================================================== */

    validateFile(file) {

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        if (
            !this.allowedExtensions.includes(
                extension
            )
        ) {

            alert(
                "Unsupported file type"
            );

            return false;
        }

        return true;
    }

    /* =====================================================
       INSERT FILE
    ===================================================== */

    insertFile(file) {

        if (
            !this.validateFile(file)
        ) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload = e => {

            const fileUrl =
                e.target.result;

            this.createFileBlock(
                file,
                fileUrl
            );
        };

        reader.readAsDataURL(file);
    }

    /* =====================================================
       FILE ICON
    ===================================================== */

    getFileIcon(extension) {

        switch (extension) {

            case "pdf":
                return "fa-file-pdf";

            case "doc":
            case "docx":
                return "fa-file-word";

            case "xls":
            case "xlsx":
                return "fa-file-excel";

            case "ppt":
            case "pptx":
                return "fa-file-powerpoint";

            case "zip":
                return "fa-file-zipper";

            case "txt":
                return "fa-file-lines";

            default:
                return "fa-file";
        }
    }

    /* =====================================================
       CREATE FILE BLOCK
    ===================================================== */

    createFileBlock(file, fileUrl) {

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block media-block file-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // File card
        const fileCard =
            document.createElement(
                "div"
            );

        fileCard.className =
            "file-card";

        // Icon
        const icon =
            document.createElement(
                "i"
            );

        icon.className =
            `fas ${this.getFileIcon(extension)} file-icon`;

        // File info
        const info =
            document.createElement(
                "div"
            );

        info.className =
            "file-info";

        const fileName =
            document.createElement(
                "h4"
            );

        fileName.textContent =
            file.name;

        const fileSize =
            document.createElement(
                "p"
            );

        fileSize.textContent =
            this.formatFileSize(
                file.size
            );

        info.appendChild(
            fileName
        );

        info.appendChild(
            fileSize
        );

        // Download button
        const downloadBtn =
            document.createElement(
                "a"
            );

        downloadBtn.href =
            fileUrl;

        downloadBtn.download =
            file.name;

        downloadBtn.className =
            "file-download-btn";

        downloadBtn.innerHTML =
            `<i class="fas fa-download"></i>`;

        // Delete button
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

                wrapper.remove();
            }
        );

        // Controls
        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "media-controls";

        controls.appendChild(
            downloadBtn
        );

        controls.appendChild(
            deleteBtn
        );

        // Assemble
        fileCard.appendChild(
            icon
        );

        fileCard.appendChild(
            info
        );

        wrapper.appendChild(
            fileCard
        );

        wrapper.appendChild(
            controls
        );

        // Add to editor
        this.editor.appendChild(
            wrapper
        );

        wrapper.scrollIntoView({

            behavior: "smooth",

            block: "center"
        });

        console.log(
            "File inserted ✔"
        );
    }

    /* =====================================================
       FILE SIZE
    ===================================================== */

    formatFileSize(bytes) {

        if (bytes < 1024) {
            return bytes + " B";
        }

        if (bytes < 1048576) {

            return (
                (bytes / 1024)
                .toFixed(1)
                + " KB"
            );
        }

        return (
            (bytes / 1048576)
            .toFixed(1)
            + " MB"
        );
    }

    /* =====================================================
       DRAG DROP FILES
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
                            !file.type.startsWith(
                                "image/"
                            )
                        ) {

                            this.insertFile(
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

        window.fileUploadManager =
            new FileUploadManager(
                editor
            );
    }
);
