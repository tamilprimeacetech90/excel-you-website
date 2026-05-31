/* =========================================================
   EXCEL YOU TEXT FORMAT SYSTEM
========================================================= */
console.log("TEXT-FORMAT.JS LOADED");
class TextFormatManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupFormatting();

        console.log(
            "Text Format Manager Initialized ✔"
        );
    }

    /* =====================================================
       MAIN FORMATTING
    ===================================================== */

    setupFormatting() {

        // =========================
        // BOLD
        // =========================
        this.bindFormat(
            "boldBtn",
            () => {

                this.exec(
                    "bold"
                );
            }
        );

        // =========================
        // ITALIC
        // =========================
        this.bindFormat(
            "italicBtn",
            () => {

                this.exec(
                    "italic"
                );
            }
        );

        // =========================
        // UNDERLINE
        // =========================
        this.bindFormat(
            "underlineBtn",
            () => {

                this.exec(
                    "underline"
                );
            }
        );

        // =========================
        // STRIKE
        // =========================
        this.bindFormat(
            "strikeBtn",
            () => {

                this.exec(
                    "strikeThrough"
                );
            }
        );

        // =========================
        // H2
        // =========================
        this.bindFormat(
            "headingBtn",
            () => {

                this.exec(
                    "formatBlock",
                    "H2"
                );
            }
        );

        // =========================
        // BLOCKQUOTE
        // =========================
        this.bindFormat(
            "quoteBtn",
            () => {

                this.exec(
                    "formatBlock",
                    "BLOCKQUOTE"
                );
            }
        );

        // =========================
        // BULLET LIST
        // =========================
        this.bindFormat(
            "bulletListBtn",
            () => {

                this.exec(
                    "insertUnorderedList"
                );
            }
        );

        // =========================
        // ORDERED LIST
        // =========================
        this.bindFormat(
            "orderedListBtn",
            () => {

                this.exec(
                    "insertOrderedList"
                );
            }
        );

        // =========================
        // CODE BLOCK
        // =========================
        this.bindFormat(
            "codeBtn",
            () => {

                this.wrapSelection(
                    "pre"
                );
            }
        );

        // =========================
        // INLINE CODE
        // =========================
        this.bindFormat(
            "inlineCodeBtn",
            () => {

                this.wrapSelection(
                    "code"
                );
            }
        );
    }

    /* =====================================================
       GENERIC EXEC
    ===================================================== */

    exec(command, value = null) {

        this.editor.focus();

        document.execCommand(

            command,

            false,

            value
        );
    }

    /* =====================================================
       BUTTON BINDER
    ===================================================== */

    bindFormat(id, callback) {

        const button =
            document.getElementById(
                id
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            callback
        );
    }

    /* =====================================================
       WRAP SELECTION
    ===================================================== */

    wrapSelection(tagName) {

        const selection =
            window.getSelection();

        if (
            !selection.rangeCount
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        const selectedText =
            range.extractContents();

        const wrapper =
            document.createElement(
                tagName
            );

        wrapper.appendChild(
            selectedText
        );

        range.insertNode(
            wrapper
        );

        selection.removeAllRanges();

        const newRange =
            document.createRange();

        newRange.selectNodeContents(
            wrapper
        );

        selection.addRange(
            newRange
        );
    }

    /* =====================================================
       REMOVE FORMAT
    ===================================================== */

    clearFormatting() {

        this.exec(
            "removeFormat"
        );
    }

    /* =====================================================
       INSERT PARAGRAPH
    ===================================================== */

    insertParagraph() {

        this.exec(
            "formatBlock",
            "P"
        );
    }

    /* =====================================================
       INSERT H1
    ===================================================== */

    insertHeading1() {

        this.exec(
            "formatBlock",
            "H1"
        );
    }

    /* =====================================================
       INSERT H3
    ===================================================== */

    insertHeading3() {

        this.exec(
            "formatBlock",
            "H3"
        );
    }

    /* =====================================================
       INSERT HR
    ===================================================== */

    insertDivider() {

        const hr =
            document.createElement(
                "hr"
            );

        const selection =
            window.getSelection();

        if (
            !selection.rangeCount
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        range.insertNode(
            hr
        );
    }
}


/* =========================================================
   HTML TOOLBAR COMPATIBILITY
========================================================= */

function formatText(command) {

    document.execCommand(
        command,
        false,
        null
    );
}

function undoEditor() {

    document.execCommand(
        "undo"
    );
}

function redoEditor() {

    document.execCommand(
        "redo"
    );
}

function insertLink() {

    const url =
        prompt("Enter URL");

    if (!url) return;

    document.execCommand(
        "createLink",
        false,
        url
    );
}

function insertImage() {

    const url =
        prompt("Image URL");

    if (!url) return;

    document.execCommand(
        "insertImage",
        false,
        url
    );
}

function insertVideo() {

    const url =
        prompt("Video URL");

    if (!url) return;

    document.execCommand(
        "insertHTML",
        false,
        `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`
    );
}

function toggleHTMLMode() {

    const editor =
        document.getElementById(
            "editor"
        );

    if (!editor) return;

    if (
        editor.getAttribute(
            "contenteditable"
        ) === "true"
    ) {

        editor.textContent =
            editor.innerHTML;

        editor.setAttribute(
            "contenteditable",
            "false"
        );

    } else {

        editor.innerHTML =
            editor.textContent;

        editor.setAttribute(
            "contenteditable",
            "true"
        );
    }
}

window.formatText = formatText;
window.undoEditor = undoEditor;
window.redoEditor = redoEditor;
window.insertLink = insertLink;
window.insertImage = insertImage;
window.insertVideo = insertVideo;
window.toggleHTMLMode = toggleHTMLMode;

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

        window.textFormatManager =
            new TextFormatManager(
                editor
            );
    }
);
